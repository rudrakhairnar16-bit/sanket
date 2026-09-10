import { addRealSample, type RealTrainingSample } from './dataset';
import { validateFeatureVector } from './features';

export interface ExternalLandmarkSample {
  signId: string;
  landmarks: number[];
}

export interface ExternalLandmarkBundle {
  version?: number;
  source?: string;
  samples: ExternalLandmarkSample[];
}

export function validateExternalBundle(value: unknown): value is ExternalLandmarkBundle {
  if (!value || typeof value !== 'object') return false;
  const bundle = value as Partial<ExternalLandmarkBundle>;
  return Array.isArray(bundle.samples) && bundle.samples.some((s) =>
    Boolean(s && typeof s.signId === 'string' && validateFeatureVector(s.landmarks))
  );
}

/**
 * Imports already-extracted, normalized landmark vectors into the same local
 * store used by the camera calibration workflow. Imported data is tagged as
 * camera-compatible research data only after the user explicitly imports it.
 */
export function importExternalLandmarkBundle(bundle: ExternalLandmarkBundle): number {
  let imported = 0;
  for (const sample of bundle.samples) {
    if (!sample || typeof sample.signId !== 'string' || !validateFeatureVector(sample.landmarks)) continue;
    const stored: RealTrainingSample = {
      signId: sample.signId,
      landmarks: sample.landmarks,
      capturedAt: new Date().toISOString(),
      source: 'external',
    };
    addRealSample(stored);
    imported += 1;
  }
  return imported;
}
