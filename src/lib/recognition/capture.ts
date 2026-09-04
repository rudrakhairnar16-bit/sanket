'use client';

import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { normalizeLandmarks, assessHandQuality, validateFeatureVector, type Landmark2D } from './features';

const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';

let landmarker: HandLandmarker | null = null;
let initPromise: Promise<HandLandmarker> | null = null;
let lastTimestamp = 0;

export async function getCaptureLandmarker(): Promise<HandLandmarker> {
  if (landmarker) return landmarker;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks(WASM_URL);
    const instance = await HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_URL },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: 0.55,
      minHandPresenceConfidence: 0.55,
      minTrackingConfidence: 0.55,
    });
    landmarker = instance;
    return instance;
  })().catch((error) => {
    initPromise = null;
    throw error;
  });
  return initPromise;
}

export function captureFeatures(video: HTMLVideoElement): number[] | null {
  if (!landmarker || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.videoWidth === 0) return null;
  const timestamp = Math.max(Date.now(), lastTimestamp + 1);
  lastTimestamp = timestamp;
  const result = landmarker.detectForVideo(video, timestamp);
  const raw = result?.landmarks?.[0] as Landmark2D[] | undefined;
  if (!raw) return null;
  const quality = assessHandQuality(raw);
  if (!quality.valid) return null;
  const features = normalizeLandmarks(raw);
  return validateFeatureVector(features) ? features : null;
}

export function closeCaptureLandmarker(): void {
  try { landmarker?.close(); } catch {}
  landmarker = null;
  initPromise = null;
  lastTimestamp = 0;
}
