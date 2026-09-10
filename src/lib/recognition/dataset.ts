import type { TrainingSample } from '@/data/recognition/training-data';
import { validateFeatureVector } from './features';

export const REAL_SAMPLE_STORAGE_KEY = 'sanket-real-recognition-samples-v1';
export const UNKNOWN_SAMPLE_STORAGE_KEY = 'sanket-unknown-recognition-samples-v1';
export const CALIBRATION_STORAGE_KEY = 'sanket-recognition-calibration-v1';
export const REAL_SAMPLE_TARGET_MIN = 20;
export const REAL_SAMPLE_TARGET_RECOMMENDED = 30;
export const REAL_SAMPLE_TARGET_MAX = 50;

export interface RealTrainingSample extends TrainingSample {
  capturedAt: string;
  source: 'camera' | 'external';
}

export interface UnknownTrainingSample {
  landmarks: number[];
  capturedAt: string;
  source: 'camera' | 'external';
}

export interface RecognitionCalibration {
  distance: number;
  margin: number;
  calibratedAt: string;
  validationPrecision: number;
  validationCoverage: number;
  openSetFalseAcceptRate?: number;
}

function readArray<T>(key: string, guard: (value: unknown) => value is T): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed.filter(guard) : [];
  } catch {
    return [];
  }
}

const isRealSample = (s: unknown): s is RealTrainingSample => {
  if (!s || typeof s !== 'object') return false;
  const value = s as Partial<RealTrainingSample>;
  return typeof value.signId === 'string' && Array.isArray(value.landmarks) && validateFeatureVector(value.landmarks);
};

const isUnknownSample = (s: unknown): s is UnknownTrainingSample => {
  if (!s || typeof s !== 'object') return false;
  const value = s as Partial<UnknownTrainingSample>;
  return Array.isArray(value.landmarks) && validateFeatureVector(value.landmarks);
};

export function loadRealSamples(): RealTrainingSample[] { return readArray(REAL_SAMPLE_STORAGE_KEY, isRealSample); }
export function loadUnknownSamples(): UnknownTrainingSample[] { return readArray(UNKNOWN_SAMPLE_STORAGE_KEY, isUnknownSample); }

export function saveRealSamples(samples: RealTrainingSample[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(REAL_SAMPLE_STORAGE_KEY, JSON.stringify(samples));
}

export function saveUnknownSamples(samples: UnknownTrainingSample[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(UNKNOWN_SAMPLE_STORAGE_KEY, JSON.stringify(samples));
}

export function addRealSample(sample: RealTrainingSample): number {
  const samples = loadRealSamples();
  samples.push(sample);
  saveRealSamples(samples);
  return samples.length;
}

export function addUnknownSample(sample: UnknownTrainingSample): number {
  const samples = loadUnknownSamples();
  samples.push(sample);
  saveUnknownSamples(samples);
  return samples.length;
}

export function clearRealSamples(signId?: string): void {
  if (typeof window === 'undefined') return;
  if (!signId) { window.localStorage.removeItem(REAL_SAMPLE_STORAGE_KEY); return; }
  saveRealSamples(loadRealSamples().filter((sample) => sample.signId !== signId));
}

export function clearUnknownSamples(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(UNKNOWN_SAMPLE_STORAGE_KEY);
}

export function loadCalibration(): RecognitionCalibration | null {
  if (typeof window === 'undefined') return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CALIBRATION_STORAGE_KEY) || 'null');
    if (!parsed || typeof parsed.distance !== 'number' || typeof parsed.margin !== 'number') return null;
    return parsed as RecognitionCalibration;
  } catch { return null; }
}

export function saveCalibration(calibration: RecognitionCalibration): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(calibration));
}

export function clearCalibration(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CALIBRATION_STORAGE_KEY);
}

export function realSampleCounts(samples = loadRealSamples()): Record<string, number> {
  return samples.reduce<Record<string, number>>((counts, sample) => {
    counts[sample.signId] = (counts[sample.signId] ?? 0) + 1;
    return counts;
  }, {});
}
