export interface Landmark2D {
  x: number;
  y: number;
  z?: number;
}

export interface HandFeatureQuality {
  valid: boolean;
  scale: number;
  span: number;
  reason?: string;
}

/**
 * Converts MediaPipe's 21 normalized hand landmarks into the 42-value feature
 * vector used by the current Sanket classifier.
 *
 * The old pipeline only translated the wrist. This version also normalizes
 * hand scale, making the classifier much less sensitive to how close the hand
 * is to the camera. We intentionally do not rotate or mirror the landmarks:
 * orientation and handedness can carry sign meaning and the existing training
 * data was authored in a fixed orientation.
 */
export function normalizeLandmarks(raw: Landmark2D[]): number[] {
  if (raw.length !== 21) return [];

  const wrist = raw[0];
  const translated = raw.map((lm) => ({
    x: lm.x - wrist.x,
    y: lm.y - wrist.y,
  }));

  // Use the maximum wrist-relative radius as a stable scale reference.
  // It works for open and partially closed hands without depending on a
  // single fingertip that may be occluded.
  const scale = Math.max(
    ...translated.map((p) => Math.hypot(p.x, p.y)),
    Math.hypot(translated[9].x, translated[9].y),
    1e-6
  );

  return translated.flatMap((p) => [p.x / scale, p.y / scale]);
}

export function assessHandQuality(raw: Landmark2D[]): HandFeatureQuality {
  if (raw.length !== 21) {
    return { valid: false, scale: 0, span: 0, reason: 'expected-21-landmarks' };
  }

  if (!raw.every((lm) => Number.isFinite(lm.x) && Number.isFinite(lm.y))) {
    return { valid: false, scale: 0, span: 0, reason: 'invalid-landmark-values' };
  }

  const xs = raw.map((lm) => lm.x);
  const ys = raw.map((lm) => lm.y);
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const wrist = raw[0];
  const scale = Math.max(...raw.map((lm) => Math.hypot(lm.x - wrist.x, lm.y - wrist.y)));

  if (span < 0.08 || scale < 0.08) {
    return { valid: false, scale, span, reason: 'hand-too-small' };
  }

  // MediaPipe normalized coordinates are expected to remain mostly inside the
  // image. A small margin is allowed because fingertips can touch the edge.
  const outOfBounds = raw.filter((lm) => lm.x < -0.15 || lm.x > 1.15 || lm.y < -0.15 || lm.y > 1.15).length;
  if (outOfBounds > 4) {
    return { valid: false, scale, span, reason: 'hand-out-of-frame' };
  }

  return { valid: true, scale, span };
}

export function validateFeatureVector(vector: number[]): boolean {
  return vector.length === 42 && vector.every(Number.isFinite);
}
