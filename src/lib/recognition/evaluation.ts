import { trainingData, type TrainingSample } from '@/data/recognition/training-data';
import { normalizeLandmarks, validateFeatureVector, type Landmark2D } from './features';
import { loadRealSamples, loadUnknownSamples, type RealTrainingSample } from './dataset';

export interface DifficultPair {
  actual: string;
  predicted: string;
  errors: number;
  totalActual: number;
  errorRate: number;
}

export interface EvaluationResult {
  labels: string[];
  matrix: number[][];
  total: number;
  correct: number;
  accuracy: number;
  rejectionRate: number;
  recommendedDistance: number;
  recommendedMargin: number;
  samplesByClass: Record<string, number>;
  realSamplesByClass: Record<string, number>;
  split: { train: number; validation: number; test: number };
  validation: { accepted: number; correctAccepted: number; precision: number; coverage: number };
  openSet: { samples: number; falseAccepts: number; falseAcceptRate: number };
  difficultPairs: DifficultPair[];
}

function normalizeStored(vector: number[]): number[] {
  const landmarks: Landmark2D[] = [];
  for (let i = 0; i < vector.length; i += 2) landmarks.push({ x: vector[i], y: vector[i + 1] });
  return normalizeLandmarks(landmarks);
}

function distance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) { const d = a[i] - b[i]; sum += d * d; }
  return Math.sqrt(sum / a.length);
}

interface Candidate { signId: string; distance: number }

function classify(input: number[], train: TrainingSample[]): { label?: string; distance: number; margin: number } {
  const nearest: Candidate[] = train
    .filter((s) => validateFeatureVector(s.landmarks))
    .map((s) => ({ signId: s.signId, distance: distance(input, s.landmarks) }))
    .sort((a, b) => a.distance - b.distance);
  if (!nearest.length) return { distance: Infinity, margin: 0 };
  const best = nearest[0];
  const second = nearest.find((item) => item.signId !== best.signId);
  return { label: best.signId, distance: best.distance, margin: (second?.distance ?? best.distance + 1) - best.distance };
}

function prepared(samples: TrainingSample[]): TrainingSample[] {
  return samples.map((sample) => ({ ...sample, landmarks: normalizeStored(sample.landmarks) })).filter((sample) => validateFeatureVector(sample.landmarks));
}

function stableShuffle<T>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const sa = JSON.stringify(a); const sb = JSON.stringify(b);
    let ha = 2166136261; let hb = 2166136261;
    for (const ch of sa) { ha ^= ch.charCodeAt(0); ha = Math.imul(ha, 16777619); }
    for (const ch of sb) { hb ^= ch.charCodeAt(0); hb = Math.imul(hb, 16777619); }
    return ha - hb;
  });
}

function splitByClass(samples: TrainingSample[]): { train: TrainingSample[]; validation: TrainingSample[]; test: TrainingSample[] } {
  const byClass = new Map<string, TrainingSample[]>();
  for (const sample of samples) { const list = byClass.get(sample.signId) ?? []; list.push(sample); byClass.set(sample.signId, list); }
  const train: TrainingSample[] = []; const validation: TrainingSample[] = []; const test: TrainingSample[] = [];
  for (const list of Array.from(byClass.values())) {
    const shuffled = stableShuffle(list);
    const n = shuffled.length;
    const testCount = Math.max(1, Math.floor(n * 0.15));
    const validationCount = Math.max(1, Math.floor(n * 0.15));
    const trainCount = Math.max(1, n - testCount - validationCount);
    shuffled.forEach((sample, i) => {
      if (i < trainCount) train.push(sample);
      else if (i < trainCount + validationCount) validation.push(sample);
      else test.push(sample);
    });
  }
  return { train, validation, test };
}

function calibrate(train: TrainingSample[], validation: TrainingSample[], unknownSamples: TrainingSample[]) {
  const observations = validation.map((sample) => {
    const result = classify(sample.landmarks, train);
    return { correct: result.label === sample.signId, distance: result.distance, margin: result.margin };
  });
  const negativeObservations = unknownSamples.map((sample) => classify(sample.landmarks, train));
  const distances = [0.18, 0.22, 0.26, 0.28, 0.30, 0.32, 0.35, 0.38, 0.42];
  const margins = [0.02, 0.04, 0.05, 0.06, 0.08, 0.10, 0.12];
  let best = { distance: 0.30, margin: 0.06, score: -Infinity, accepted: 0, correctAccepted: 0, falseAccepts: 0 };
  for (const d of distances) for (const m of margins) {
    const accepted = observations.filter((o) => o.distance <= d && o.margin >= m);
    const correctAccepted = accepted.filter((o) => o.correct).length;
    const precision = accepted.length ? correctAccepted / accepted.length : 0;
    const coverage = observations.length ? accepted.length / observations.length : 0;
    const falseAccepts = negativeObservations.filter((o) => o.distance <= d && o.margin >= m).length;
    const far = negativeObservations.length ? falseAccepts / negativeObservations.length : 0;
    const score = precision * 0.65 + coverage * 0.20 + (1 - far) * 0.15;
    if (score > best.score) best = { distance: d, margin: m, score, accepted: accepted.length, correctAccepted, falseAccepts };
  }
  return best;
}

export function evaluateDataset(extraSamples: RealTrainingSample[] = loadRealSamples()): EvaluationResult {
  const base = prepared(trainingData);
  const real = prepared(extraSamples);
  const all = [...base, ...real];
  const labels = Array.from(new Set(all.map((s) => s.signId))).sort();
  const index = new Map(labels.map((label, i) => [label, i]));
  const { train, validation, test } = splitByClass(all);
  const negatives = prepared(loadUnknownSamples().map((s) => ({ signId: '__unknown__', landmarks: s.landmarks })));
  const calibration = calibrate(train, validation, negatives);
  const matrix = labels.map(() => labels.map(() => 0));
  let total = 0; let correct = 0; let rejected = 0;
  for (const sample of test) {
    const result = classify(sample.landmarks, train); total += 1;
    const accepted = Boolean(result.label) && result.distance <= calibration.distance && result.margin >= calibration.margin;
    if (!accepted) { rejected += 1; continue; }
    matrix[index.get(sample.signId)!][index.get(result.label!)!] += 1;
    if (result.label === sample.signId) correct += 1;
  }
  const acceptedValidation = validation.filter((sample) => { const r = classify(sample.landmarks, train); return Boolean(r.label) && r.distance <= calibration.distance && r.margin >= calibration.margin; });
  const correctValidation = acceptedValidation.filter((sample) => classify(sample.landmarks, train).label === sample.signId);
  const difficultPairs: DifficultPair[] = [];
  for (let r = 0; r < labels.length; r += 1) for (let c = 0; c < labels.length; c += 1) {
    if (r === c || !matrix[r][c]) continue;
    const totalActual = matrix[r].reduce((a, b) => a + b, 0);
    difficultPairs.push({ actual: labels[r], predicted: labels[c], errors: matrix[r][c], totalActual, errorRate: totalActual ? matrix[r][c] / totalActual : 0 });
  }
  difficultPairs.sort((a, b) => b.errors - a.errors || b.errorRate - a.errorRate);
  const falseAccepts = negatives.filter((sample) => { const r = classify(sample.landmarks, train); return Boolean(r.label) && r.distance <= calibration.distance && r.margin >= calibration.margin; }).length;
  return {
    labels, matrix, total, correct, accuracy: total ? correct / total : 0, rejectionRate: total ? rejected / total : 0,
    recommendedDistance: calibration.distance, recommendedMargin: calibration.margin,
    samplesByClass: base.reduce<Record<string, number>>((acc, s) => { acc[s.signId] = (acc[s.signId] ?? 0) + 1; return acc; }, {}),
    realSamplesByClass: real.reduce<Record<string, number>>((acc, s) => { acc[s.signId] = (acc[s.signId] ?? 0) + 1; return acc; }, {}),
    split: { train: train.length, validation: validation.length, test: test.length },
    validation: { accepted: acceptedValidation.length, correctAccepted: correctValidation.length, precision: acceptedValidation.length ? correctValidation.length / acceptedValidation.length : 0, coverage: validation.length ? acceptedValidation.length / validation.length : 0 },
    openSet: { samples: negatives.length, falseAccepts, falseAcceptRate: negatives.length ? falseAccepts / negatives.length : 0 },
    difficultPairs: difficultPairs.slice(0, 12),
  };
}
