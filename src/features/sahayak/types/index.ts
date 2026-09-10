export type ConfidenceState = 'unknown' | 'processing' | 'low' | 'medium' | 'high' | 'confirmed';

export type CommunicationDirection =
  | 'citizen_to_clerk'
  | 'clerk_to_citizen'
  | 'interpreter_to_clerk'
  | 'interpreter_to_citizen';

export type CommunicationChannel = 'isl' | 'text' | 'audio' | 'visual' | 'interpreter';

export interface CommunicationEvent {
  id: string;
  sessionId: string;
  sender: 'citizen' | 'clerk' | 'interpreter' | 'system';
  receiver: 'citizen' | 'clerk' | 'interpreter';
  direction: CommunicationDirection;
  channel: CommunicationChannel;
  text?: string;
  signId?: string;
  signSequence?: string[];
  confidence?: number;
  confidenceState?: ConfidenceState;
  confirmed?: boolean;
  timestamp: string;
}

export type CameraState = 'idle' | 'requesting' | 'ready' | 'running' | 'paused' | 'denied' | 'unsupported' | 'error';

export interface RecognitionResult {
  signId: string | null;
  label?: string;
  confidence: number;
  confidenceState: ConfidenceState;
  stable: boolean;
  modelVersion: string;
  timestamp: string;
}

export interface RecognitionEngine {
  initialize(): Promise<void>;
  recognize(frame: HTMLVideoElement | ImageData): Promise<RecognitionResult>;
  getSupportedSigns(): string[];
  getModelInfo(): ModelInfo;
  addTrainingSample(signId: string, landmarks: number[]): void;
  destroy(): void;
}

export interface ModelInfo {
  name: string;
  version: string;
  type: 'knn' | 'mlp' | 'demo' | 'future';
  signCount: number;
}

export type SessionStatus =
  | 'created'
  | 'active'
  | 'interpreter_requested'
  | 'interpreter_connected'
  | 'completed'
  | 'cancelled';

export interface SahayakSession {
  id: string;
  clerkId: string;
  servicePackId: string;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  language: string;
  recognitionCount: number;
  highConfidenceCount: number;
  confirmedCount: number;
  interpreterRequested: boolean;
  events: CommunicationEvent[];
  feedback?: SessionFeedback;
}

export interface SessionFeedback {
  rating: 'yes' | 'partially' | 'no';
  comment?: string;
  timestamp: string;
}

export interface SignAsset {
  signId: string;
  type: 'svg' | 'image' | 'video' | 'placeholder';
  path: string;
  source: string;
  sourceReference?: string;
  license?: string;
  attribution?: string;
  reviewStatus: 'validated' | 'draft' | 'placeholder';
  reviewer?: string;
  reviewDate?: string;
  version: string;
}

export interface SignSequence {
  phrase: string;
  language: string;
  signIds: string[];
  source: string;
  reviewStatus: 'validated' | 'draft';
}
