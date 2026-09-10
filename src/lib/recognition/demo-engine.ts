import { municipalSigns } from '@/data/signs/municipal-signs';
import type {
  RecognitionEngine,
  RecognitionResult,
  SignDefinition,
  ModelInfo,
} from './types';
import { getConfidenceState } from './confidence';

export class DemoRecognitionEngine implements RecognitionEngine {
  private signs: SignDefinition[];
  private modelVersion = 'sanket-demo-v1';
  private trainingSamples: Map<string, number[][]> = new Map();

  constructor() {
    this.signs = municipalSigns.map((s) => ({
      id: s.id,
      label: s.name,
      category: s.category,
      keywords: s.keywords,
    }));
  }

  async initialize(): Promise<void> {
    await Promise.resolve();
  }

  async recognize(_frame: ImageData | HTMLVideoElement): Promise<RecognitionResult> {
    const samples = Array.from(this.trainingSamples.entries());
    if (samples.length === 0) {
      const randomIndex = Math.floor(Math.random() * this.signs.length);
      const sign = this.signs[randomIndex];
      const confidence = Math.random() * 0.5 + 0.1;
      return {
        signId: sign.id,
        label: sign.label,
        confidence,
        state: getConfidenceState(confidence).toLowerCase() as RecognitionResult['state'],
        timestamp: new Date().toISOString(),
        modelVersion: this.modelVersion,
      };
    }

    const [signId] = samples[Math.floor(Math.random() * samples.length)];
    const baseConfidence = 0.65 + Math.random() * 0.3;
    const sign = this.signs.find((s) => s.id === signId);
    return {
      signId,
      label: sign?.label ?? signId,
      confidence: baseConfidence,
      state: getConfidenceState(baseConfidence).toLowerCase() as RecognitionResult['state'],
      timestamp: new Date().toISOString(),
      modelVersion: this.modelVersion,
    };
  }

  getSupportedSigns(): SignDefinition[] {
    return [...this.signs];
  }

  getModelInfo(): ModelInfo {
    return {
      name: 'Sanket Demo Model',
      version: this.modelVersion,
      type: 'knn',
      signCount: this.signs.length,
    };
  }

  addTrainingSample(signId: string, landmarks: number[]): void {
    const existing = this.trainingSamples.get(signId) ?? [];
    existing.push(landmarks);
    this.trainingSamples.set(signId, existing);
  }

  destroy(): void {
    this.trainingSamples.clear();
  }
}
