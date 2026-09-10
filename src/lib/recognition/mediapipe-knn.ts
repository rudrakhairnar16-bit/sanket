import { municipalSigns } from '@/data/signs/municipal-signs';
import type { RecognitionEngine, RecognitionResult, SignDefinition, ModelInfo } from './types';
import { getConfidenceState } from './confidence';
import { trainingData } from '@/data/recognition/training-data';
import { assessHandQuality, normalizeLandmarks, validateFeatureVector, type Landmark2D } from './features';
import { loadCalibration, loadRealSamples } from './dataset';

const MODEL_VERSION = 'sanket-knn-v2';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';

// Distances are measured in the normalized 42-D feature space. The thresholds
// are deliberately conservative because the current dataset is synthetic and
// small. A wrong confident sign is more harmful than an honest unknown state.
const MAX_ACCEPT_DISTANCE = 0.30;
const MIN_MARGIN = 0.060;
const MIN_VOTE_RATIO = 0.60;
const K_NEIGHBORS = 7;

let handLandmarkerInstance: any = null;
let initPromise: Promise<void> | null = null;

async function initHandLandmarker(): Promise<void> {
  if (handLandmarkerInstance) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (typeof window === 'undefined') return;

    const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
    const vision = await FilesetResolver.forVisionTasks(WASM_URL);

    handLandmarkerInstance = await HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_URL },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: 0.55,
      minHandPresenceConfidence: 0.55,
      minTrackingConfidence: 0.55,
    });

    console.info('[Sanket] MediaPipe Hand Landmarker ready');
  })().catch((error) => {
    handLandmarkerInstance = null;
    console.error('[Sanket] Failed to initialize Hand Landmarker:', error);
    throw error;
  });

  return initPromise;
}

function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return Number.POSITIVE_INFINITY;
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum / a.length);
}

interface KnnVote {
  signId: string;
  dist: number;
}

interface Classification {
  signId?: string;
  confidence: number;
  distance: number;
  margin: number;
  voteRatio: number;
  candidateCount: number;
}

function knnClassify(input: number[], samples: Map<string, number[][]>, k = K_NEIGHBORS, allowedSignIds?: Set<string>, thresholds = { distance: MAX_ACCEPT_DISTANCE, margin: MIN_MARGIN }): Classification {
  const neighbors: KnnVote[] = [];
  for (const [signId, vectors] of Array.from(samples.entries())) {
    if (allowedSignIds && !allowedSignIds.has(signId)) continue;
    for (const vector of vectors) {
      if (validateFeatureVector(vector)) {
        neighbors.push({ signId, dist: euclideanDistance(input, vector) });
      }
    }
  }

  if (!neighbors.length) {
    return { confidence: 0, distance: Infinity, margin: 0, voteRatio: 0, candidateCount: 0 };
  }

  neighbors.sort((a, b) => a.dist - b.dist);
  const top = neighbors.slice(0, Math.min(k, neighbors.length));
  const scores = new Map<string, number>();
  const counts = new Map<string, number>();

  for (const neighbor of top) {
    const weight = 1 / Math.max(neighbor.dist, 0.035);
    scores.set(neighbor.signId, (scores.get(neighbor.signId) ?? 0) + weight);
    counts.set(neighbor.signId, (counts.get(neighbor.signId) ?? 0) + 1);
  }

  const ranked = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
  const best = ranked[0];
  const second = ranked[1];
  if (!best) {
    return { confidence: 0, distance: Infinity, margin: 0, voteRatio: 0, candidateCount: 0 };
  }

  const signId = best[0];
  const bestDistance = top.find((n) => n.signId === signId)?.dist ?? Infinity;
  const secondDistance = neighbors.find((n) => n.signId !== signId)?.dist ?? bestDistance + 1;
  const margin = Math.max(0, secondDistance - bestDistance);
  const voteRatio = (counts.get(signId) ?? 0) / top.length;

  const distanceScore = Math.max(0, Math.min(1, 1 - bestDistance / MAX_ACCEPT_DISTANCE));
  const marginScore = Math.max(0, Math.min(1, margin / 0.15));
  const confidence = Math.max(0, Math.min(1,
    distanceScore * 0.55 + marginScore * 0.30 + voteRatio * 0.15
  ));

  const accepted = bestDistance <= thresholds.distance && margin >= thresholds.margin && voteRatio >= MIN_VOTE_RATIO;
  return {
    signId: accepted ? signId : undefined,
    confidence: accepted ? confidence : Math.min(confidence, 0.37),
    distance: bestDistance,
    margin,
    voteRatio,
    candidateCount: second ? ranked.length : 1,
  };
}

function resultBase(state: RecognitionResult['state'], extra: Partial<RecognitionResult> = {}): RecognitionResult {
  return {
    confidence: 0,
    state,
    timestamp: new Date().toISOString(),
    modelVersion: MODEL_VERSION,
    ...extra,
  };
}

export class MediaPipeKnnEngine implements RecognitionEngine {
  private readonly signs: SignDefinition[];
  private readonly trainingSamples: Map<string, number[][]> = new Map();
  private handDetectionAvailable = false;
  private processing = false;
  private lastVideoTimestamp = 0;
  private allowedSignIds: Set<string> | null = null;
  private calibration = { distance: MAX_ACCEPT_DISTANCE, margin: MIN_MARGIN };
  private recentPredictions: string[] = [];

  constructor() {
    this.signs = municipalSigns.map((s) => ({
      id: s.id,
      label: s.name,
      category: s.category,
      keywords: s.keywords,
    }));
    this.loadTrainingData();
    const calibration = typeof window !== 'undefined' ? loadCalibration() : null;
    if (calibration) this.calibration = { distance: calibration.distance, margin: calibration.margin };
  }

  private loadTrainingData() {
    this.trainingSamples.clear();
    const realSamples = typeof window !== 'undefined' ? loadRealSamples() : [];
    const realCounts = new Map<string, number>();
    for (const sample of realSamples) realCounts.set(sample.signId, (realCounts.get(sample.signId) ?? 0) + 1);
    // Once a sign has enough real-camera examples, synthetic anchors are removed
    // for that sign. This prevents the demo dataset from pulling predictions away
    // from the actual camera distribution.
    const baseSamples = trainingData.filter((sample) => (realCounts.get(sample.signId) ?? 0) < 20);
    const allSamples = typeof window !== 'undefined' ? [...baseSamples, ...realSamples] : trainingData;
    for (const sample of allSamples) {
      if (!validateFeatureVector(sample.landmarks)) continue;
      const existing = this.trainingSamples.get(sample.signId) ?? [];
      // Training data in the repository is already wrist-relative. Re-normalize
      // it with the same scale rule used for camera frames so train/inference
      // feature spaces remain consistent.
      const landmarks: Landmark2D[] = [];
      for (let i = 0; i < sample.landmarks.length; i += 2) {
        landmarks.push({ x: sample.landmarks[i], y: sample.landmarks[i + 1] });
      }
      const normalized = normalizeLandmarks(landmarks);
      if (validateFeatureVector(normalized)) existing.push(normalized);
      this.trainingSamples.set(sample.signId, existing);
    }
    console.info(`[Sanket] Loaded ${allSamples.length} raw samples → ${Array.from(this.trainingSamples.values()).reduce((n, v) => n + v.length, 0)} normalized samples across ${this.trainingSamples.size} signs`);
  }

  async initialize(): Promise<void> {
    await initHandLandmarker();
    this.handDetectionAvailable = Boolean(handLandmarkerInstance);
  }

  private detectFromVideo(video: HTMLVideoElement): Landmark2D[] | null {
    if (!handLandmarkerInstance) return null;
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.videoWidth === 0 || video.videoHeight === 0) return null;

    const timestamp = Math.max(Date.now(), this.lastVideoTimestamp + 1);
    this.lastVideoTimestamp = timestamp;
    const result = handLandmarkerInstance.detectForVideo(video, timestamp);
    return result?.landmarks?.[0] ?? null;
  }

  async recognize(frame: ImageData | HTMLVideoElement): Promise<RecognitionResult> {
    if (this.processing) return resultBase('processing');
    if (!(frame instanceof HTMLVideoElement) || !handLandmarkerInstance) {
      return resultBase('unknown', { handDetected: false });
    }

    this.processing = true;
    try {
      const landmarks = this.detectFromVideo(frame);
      if (!landmarks) return resultBase('unknown', { handDetected: false });

      const quality = assessHandQuality(landmarks);
      if (!quality.valid) {
        return resultBase('unknown', { handDetected: true, handQuality: 0 });
      }

      const normalized = normalizeLandmarks(landmarks);
      if (!validateFeatureVector(normalized)) {
        return resultBase('unknown', { handDetected: true, handQuality: 0 });
      }

      const classification = knnClassify(normalized, this.trainingSamples, K_NEIGHBORS, this.allowedSignIds ?? undefined, this.calibration);
      if (classification.signId) {
        this.recentPredictions = [...this.recentPredictions.slice(-4), classification.signId];
        const votes = this.recentPredictions.filter((id) => id === classification.signId).length;
        if (votes < 3) classification.signId = undefined;
      } else {
        this.recentPredictions = [];
      }
      const state = classification.signId
        ? getConfidenceState(classification.confidence).toLowerCase() as RecognitionResult['state']
        : 'unknown';

      const sign = classification.signId ? this.signs.find((s) => s.id === classification.signId) : undefined;
      return resultBase(state, {
        signId: classification.signId,
        label: sign?.label,
        confidence: classification.confidence,
        distance: classification.distance,
        margin: classification.margin,
        candidateCount: classification.candidateCount,
        handDetected: true,
        handQuality: Math.min(1, quality.span / 0.45),
      });
    } catch (error) {
      console.warn('[Sanket] recognition error:', error);
      return resultBase('unknown', { handDetected: false });
    } finally {
      this.processing = false;
    }
  }

  reloadTrainingData(): void {
    this.loadTrainingData();
    const calibration = typeof window !== 'undefined' ? loadCalibration() : null;
    if (calibration) this.calibration = { distance: calibration.distance, margin: calibration.margin };
    this.recentPredictions = [];
  }

  getSupportedSigns(): SignDefinition[] {
    return [...this.signs];
  }

  getModelInfo(): ModelInfo {
    return {
      name: this.handDetectionAvailable ? 'Sanket MediaPipe Hand + kNN v2' : 'Sanket kNN (initializing)',
      version: MODEL_VERSION,
      type: 'knn',
      signCount: this.signs.length,
    };
  }

  setAllowedSignIds(signIds?: string[] | null): void {
    this.allowedSignIds = signIds && signIds.length > 0 ? new Set(signIds) : null;
  }

  addTrainingSample(signId: string, landmarks: number[]): void {
    if (!validateFeatureVector(landmarks)) return;
    const existing = this.trainingSamples.get(signId) ?? [];
    existing.push([...landmarks]);
    this.trainingSamples.set(signId, existing);
  }

  destroy(): void {
    try { handLandmarkerInstance?.close?.(); } catch {}
    handLandmarkerInstance = null;
    initPromise = null;
    this.handDetectionAvailable = false;
    this.processing = false;
    this.lastVideoTimestamp = 0;
    this.allowedSignIds = null;
    this.recentPredictions = [];
  }
}
