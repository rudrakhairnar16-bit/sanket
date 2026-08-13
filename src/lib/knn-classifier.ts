export interface Landmark {
  x: number;
  y: number;
  z?: number;
}

export interface ClassificationResult {
  signId: string | null;
  confidence: number;
}

const KEYPOINT_NAMES = [
  "wrist", "thumb_cmc", "thumb_mcp", "thumb_ip", "thumb_tip",
  "index_mcp", "index_pip", "index_dip", "index_tip",
  "middle_mcp", "middle_pip", "middle_dip", "middle_tip",
  "ring_mcp", "ring_pip", "ring_dip", "ring_tip",
  "pinky_mcp", "pinky_pip", "pinky_dip", "pinky_tip",
];

function normalizeLandmarks(landmarks: Landmark[]): number[] {
  if (landmarks.length < 21) return [];
  const wrist = landmarks[0];
  const features: number[] = [];

  // Normalized (x, y) relative to wrist
  for (let i = 0; i < 21; i++) {
    features.push(landmarks[i].x - wrist.x);
    features.push(landmarks[i].y - wrist.y);
  }

  // Pairwise distances between key fingertips and wrist
  const fingerTips = [4, 8, 12, 16, 20];
  for (const tip of fingerTips) {
    const dx = landmarks[tip].x - wrist.x;
    const dy = landmarks[tip].y - wrist.y;
    features.push(Math.sqrt(dx * dx + dy * dy));
  }

  // Finger extension: tip-to-pip distance vs pip-to-mcp distance
  const fingerChains = [
    [4, 3, 2],
    [8, 6, 5],
    [12, 10, 9],
    [16, 14, 13],
    [20, 18, 17],
  ];
  for (const [tip, pip, mcp] of fingerChains) {
    const tipPip = distance(landmarks[tip], landmarks[pip]);
    const pipMcp = distance(landmarks[pip], landmarks[mcp]);
    features.push(tipPip / (pipMcp + 0.001));
  }

  // Relative angles of fingertips from wrist
  for (const tip of fingerTips) {
    features.push(Math.atan2(landmarks[tip].y - wrist.y, landmarks[tip].x - wrist.x));
  }

  return features;
}

function distance(a: Landmark, b: Landmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
}

function augmentFeatures(features: number[], noise = 0.02): number[] {
  return features.map((f) => f + (Math.random() - 0.5) * noise);
}

export class KNNClassifier {
  static readonly TRAINING_KEY = "sanket-knn-training";

  private samples: Map<string, number[][]> = new Map();
  private history: { signId: string | null; confidence: number }[] = [];
  private readonly historySize = 15;
  private readonly k = 3;
  private readonly minConfidence = 0.45;
  private readonly minSamplesPerSign = 2;

  private get entries() { return Array.from(this.samples.entries()); }
  private get sampleValues() { return Array.from(this.samples.values()); }

  addSample(signId: string, landmarks: Landmark[], augment = true) {
    const base = normalizeLandmarks(landmarks);
    if (base.length === 0) return;
    if (!this.samples.has(signId)) {
      this.samples.set(signId, []);
    }
    this.samples.get(signId)!.push(base);
    if (augment) {
      for (let i = 0; i < 3; i++) {
        this.samples.get(signId)!.push(augmentFeatures(base));
      }
    }
    this.saveTraining();
  }

  addMultipleSamples(signId: string, allLandmarks: Landmark[][]) {
    for (const lm of allLandmarks) {
      this.addSample(signId, lm);
    }
  }

  classify(landmarks: Landmark[]): ClassificationResult {
    const features = normalizeLandmarks(landmarks);
    if (features.length === 0 || this.samples.size === 0) {
      return { signId: null, confidence: 0 };
    }

    let bestSign: string | null = null;
    let bestScore = 0;

    for (const [signId, refs] of this.entries) {
      if (refs.length < this.minSamplesPerSign) continue;

      let totalSim = 0;
      const count = Math.min(refs.length, 5);
      const dists = refs.map((ref) => euclideanDistance(features, ref));
      dists.sort((a, b) => a - b);
      for (let i = 0; i < count; i++) totalSim += 1 / (1 + dists[i]);
      const avgSim = totalSim / count;

      if (avgSim > bestScore) {
        bestScore = avgSim;
        bestSign = signId;
      }
    }

    const result: ClassificationResult = {
      signId: bestScore >= this.minConfidence ? bestSign : null,
      confidence: Math.round(bestScore * 100) / 100,
    };

    // Temporal smoothing
    this.history.push(result);
    if (this.history.length > this.historySize) {
      this.history.shift();
    }

    return this.smooth();
  }

  private smooth(): ClassificationResult {
    const votes = new Map<string | null, number>();
    for (const h of this.history) {
      votes.set(h.signId, (votes.get(h.signId) || 0) + 1);
    }

    let bestSign: string | null = null;
    let bestVotes = 0;
    votes.forEach((count, sign) => {
      if (count > bestVotes) {
        bestVotes = count;
        bestSign = sign;
      }
    });

    const confidence = this.history.length > 0
      ? Math.round((bestVotes / this.history.length) * 100) / 100
      : 0;

    return { signId: bestSign, confidence };
  }

  getSampleCount(): number {
    let total = 0;
    for (const refs of this.sampleValues) total += refs.length;
    return total;
  }

  getSignCount(): number {
    return this.samples.size;
  }

  getSamplesPerSign(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [id, refs] of this.entries) {
      result[id] = refs.length;
    }
    return result;
  }

  getMinSamplesPerSign(): number {
    return this.minSamplesPerSign;
  }

  getHistorySize(): number {
    return this.history.length;
  }

  reset() {
    this.samples.clear();
    this.history = [];
  }

  saveTraining(): void {
    try {
      const data: Record<string, number[][]> = {};
      for (const [id, refs] of this.entries) {
        data[id] = refs;
      }
      localStorage.setItem(KNNClassifier.TRAINING_KEY, JSON.stringify(data));
    } catch {}
  }

  loadTraining(): void {
    try {
      const raw = localStorage.getItem(KNNClassifier.TRAINING_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      for (const [id, refs] of Object.entries(data)) {
        if (Array.isArray(refs) && refs.length > 0) {
          this.samples.set(id, refs as number[][]);
        }
      }
    } catch {}
  }

  // Serialize for localStorage
  serialize(): string {
    const data: Record<string, number[][]> = {};
    for (const [id, refs] of this.entries) {
      data[id] = refs;
    }
    return JSON.stringify(data);
  }

  deserialize(json: string) {
    try {
      const data = JSON.parse(json);
      for (const [id, refs] of Object.entries(data)) {
        this.samples.set(id, refs as number[][]);
      }
    } catch {}
  }
}

/**
 * Generate synthetic hand landmarks for a given sign.
 *
 * These are rough approximations — enough for a basic demo but NOT accurate
 * enough for reliable real-world use. Users SHOULD calibrate by recording
 * real samples via the calibration UI in PracticeScreen for production use.
 *
 * Each synthetic hand starts from a base configuration and adds controlled
 * random noise to produce varied training samples.
 */
function makeSyntheticLandmarks(
  config: { x: number; y: number }[],
  noise = 0.015
): Landmark[] {
  return config.map((p) => ({
    x: p.x + (Math.random() - 0.5) * noise,
    y: p.y + (Math.random() - 0.5) * noise,
  }));
}

// Hand landmark configurations for known signs.
// Index mapping: 0=wrist, 1=thumb_cmc, 2=thumb_mcp, 3=thumb_ip, 4=thumb_tip,
// 5=index_mcp, 6=index_pip, 7=index_dip, 8=index_tip,
// 9=middle_mcp, 10=middle_pip, 11=middle_dip, 12=middle_tip,
// 13=ring_mcp, 14=ring_pip, 15=ring_dip, 16=ring_tip,
// 17=pinky_mcp, 18=pinky_pip, 19=pinky_dip, 20=pinky_tip
const BASELINE_CONFIGS: Record<string, { x: number; y: number }[]> = {
  // Namaste: palms together, fingers pointing up, thumb forward
  namaste: [
    { x: 0.5, y: 0.6 },  // wrist
    { x: 0.48, y: 0.52 }, { x: 0.46, y: 0.45 }, { x: 0.44, y: 0.38 }, { x: 0.42, y: 0.32 }, // thumb
    { x: 0.5, y: 0.52 }, { x: 0.5, y: 0.45 }, { x: 0.5, y: 0.38 }, { x: 0.5, y: 0.30 }, // index
    { x: 0.52, y: 0.52 }, { x: 0.52, y: 0.45 }, { x: 0.52, y: 0.38 }, { x: 0.53, y: 0.30 }, // middle
    { x: 0.54, y: 0.53 }, { x: 0.55, y: 0.47 }, { x: 0.55, y: 0.41 }, { x: 0.56, y: 0.34 }, // ring
    { x: 0.56, y: 0.54 }, { x: 0.57, y: 0.49 }, { x: 0.57, y: 0.44 }, { x: 0.58, y: 0.40 }, // pinky
  ],
  "thank-you": [
    { x: 0.5, y: 0.55 },
    { x: 0.42, y: 0.48 }, { x: 0.38, y: 0.40 }, { x: 0.35, y: 0.33 }, { x: 0.32, y: 0.26 },
    { x: 0.48, y: 0.46 }, { x: 0.46, y: 0.38 }, { x: 0.44, y: 0.30 }, { x: 0.42, y: 0.22 },
    { x: 0.5, y: 0.46 }, { x: 0.5, y: 0.38 }, { x: 0.5, y: 0.30 }, { x: 0.5, y: 0.22 },
    { x: 0.53, y: 0.47 }, { x: 0.54, y: 0.40 }, { x: 0.55, y: 0.33 }, { x: 0.56, y: 0.27 },
    { x: 0.56, y: 0.48 }, { x: 0.58, y: 0.42 }, { x: 0.59, y: 0.37 }, { x: 0.60, y: 0.32 },
  ],
  yes: [
    { x: 0.5, y: 0.6 },
    { x: 0.48, y: 0.55 }, { x: 0.47, y: 0.50 }, { x: 0.45, y: 0.46 }, { x: 0.43, y: 0.42 },
    { x: 0.5, y: 0.52 }, { x: 0.49, y: 0.45 }, { x: 0.48, y: 0.40 }, { x: 0.47, y: 0.35 },
    { x: 0.51, y: 0.52 }, { x: 0.51, y: 0.46 }, { x: 0.50, y: 0.41 }, { x: 0.50, y: 0.36 },
    { x: 0.52, y: 0.53 }, { x: 0.52, y: 0.48 }, { x: 0.51, y: 0.44 }, { x: 0.51, y: 0.40 },
    { x: 0.53, y: 0.54 }, { x: 0.53, y: 0.50 }, { x: 0.52, y: 0.47 }, { x: 0.52, y: 0.44 },
  ],
  no: [
    { x: 0.5, y: 0.55 },
    { x: 0.46, y: 0.49 }, { x: 0.44, y: 0.43 }, { x: 0.42, y: 0.37 }, { x: 0.40, y: 0.31 },
    { x: 0.5, y: 0.47 }, { x: 0.49, y: 0.38 }, { x: 0.49, y: 0.30 }, { x: 0.48, y: 0.20 },
    { x: 0.52, y: 0.48 }, { x: 0.52, y: 0.42 }, { x: 0.51, y: 0.37 }, { x: 0.51, y: 0.34 },
    { x: 0.53, y: 0.49 }, { x: 0.53, y: 0.44 }, { x: 0.52, y: 0.40 }, { x: 0.52, y: 0.37 },
    { x: 0.54, y: 0.50 }, { x: 0.54, y: 0.46 }, { x: 0.53, y: 0.43 }, { x: 0.53, y: 0.40 },
  ],
  wait: [
    { x: 0.5, y: 0.55 },
    { x: 0.40, y: 0.48 }, { x: 0.35, y: 0.42 }, { x: 0.30, y: 0.36 }, { x: 0.26, y: 0.30 },
    { x: 0.48, y: 0.46 }, { x: 0.47, y: 0.37 }, { x: 0.46, y: 0.28 }, { x: 0.45, y: 0.18 },
    { x: 0.5, y: 0.46 }, { x: 0.5, y: 0.37 }, { x: 0.5, y: 0.28 }, { x: 0.5, y: 0.18 },
    { x: 0.53, y: 0.47 }, { x: 0.54, y: 0.39 }, { x: 0.55, y: 0.31 }, { x: 0.56, y: 0.24 },
    { x: 0.56, y: 0.48 }, { x: 0.58, y: 0.42 }, { x: 0.60, y: 0.37 }, { x: 0.62, y: 0.32 },
  ],
};

/**
 * Pre-seed the classifier with synthetic baseline data so it works out of the
 * box in the demo. These synthetic samples are rough approximations and will
 * NOT yield high accuracy in real webcam conditions. Users should calibrate
 * via the PracticeScreen calibration UI for reliable results.
 */
export function loadBaseline(classifier: KNNClassifier): void {
  const signIds = Object.keys(BASELINE_CONFIGS);
  for (const signId of signIds) {
    const config = BASELINE_CONFIGS[signId];
    for (let i = 0; i < 5; i++) {
      const landmarks = makeSyntheticLandmarks(config, 0.02);
      classifier.addSample(signId, landmarks, true);
    }
  }
}

export const classifier = new KNNClassifier();

// Auto-seed on first import so the classifier works without any training.
loadBaseline(classifier);

// Load any persisted training data from localStorage (overwrites synthetic
// samples with same signId keys so the user's real data takes priority).
classifier.loadTraining();
