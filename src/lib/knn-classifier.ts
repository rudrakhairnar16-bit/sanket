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

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export class KNNClassifier {
  private samples: Map<string, number[][]> = new Map();
  private history: { signId: string | null; confidence: number }[] = [];
  private readonly historySize = 15;
  private readonly k = 3;
  private readonly minConfidence = 0.55;

  addSample(signId: string, landmarks: Landmark[]) {
    const features = normalizeLandmarks(landmarks);
    if (features.length === 0) return;
    if (!this.samples.has(signId)) {
      this.samples.set(signId, []);
    }
    this.samples.get(signId)!.push(features);
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

    for (const [signId, refs] of Array.from(this.samples.entries())) {
      let totalSim = 0;
      const count = Math.min(refs.length, 5); // Use up to 5 nearest refs
      const sims = refs.map((ref) => cosineSimilarity(features, ref));
      sims.sort((a, b) => b - a);
      for (let i = 0; i < count; i++) totalSim += sims[i];
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
    for (const [sign, count] of Array.from(votes.entries())) {
      if (count > bestVotes) {
        bestVotes = count;
        bestSign = sign;
      }
    }

    const confidence = this.history.length > 0
      ? Math.round((bestVotes / this.history.length) * 100) / 100
      : 0;

    return { signId: bestSign, confidence };
  }

  getSampleCount(): number {
    let total = 0;
    for (const refs of Array.from(this.samples.values())) total += refs.length;
    return total;
  }

  getSignCount(): number {
    return this.samples.size;
  }

  getHistorySize(): number {
    return this.history.length;
  }

  reset() {
    this.samples.clear();
    this.history = [];
  }

  // Serialize for localStorage
  serialize(): string {
    const data: Record<string, number[][]> = {};
    for (const [id, refs] of Array.from(this.samples.entries())) {
      data[id] = refs;
    }
    return JSON.stringify(data);
  }

  deserialize(json: string) {
    try {
      const data = JSON.parse(json);
      for (const [id, refs] of Array.from(Object.entries(data))) {
        this.samples.set(id, refs as number[][]);
      }
    } catch {}
  }
}

export const classifier = new KNNClassifier();
