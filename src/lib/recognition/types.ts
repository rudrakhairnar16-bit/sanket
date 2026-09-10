export interface SignDefinition {
  id: string;
  label: string;
  category: string;
  keywords: string[];
}

export interface ModelInfo {
  name: string;
  version: string;
  type: 'knn' | 'mlp' | 'future';
  signCount: number;
}

export interface RecognitionResult {
  signId?: string;
  label?: string;
  confidence: number;
  state: 'high' | 'medium' | 'low' | 'unknown' | 'processing' | 'ambiguous';
  timestamp: string;
  modelVersion: string;
  distance?: number;
  margin?: number;
  handDetected?: boolean;
  handQuality?: number;
  candidateCount?: number;
}

export interface RecognitionEngine {
  initialize(): Promise<void>;
  recognize(frame: ImageData | HTMLVideoElement): Promise<RecognitionResult>;
  getSupportedSigns(): SignDefinition[];
  getModelInfo(): ModelInfo;
  addTrainingSample(signId: string, landmarks: number[]): void;
  /** Restrict recognition to the active service-pack vocabulary. Pass null/undefined to clear. */
  setAllowedSignIds?(signIds?: string[] | null): void;
  destroy(): void;
}

export type ConfidenceState = 'UNKNOWN' | 'PROCESSING' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CONFIRMED';
