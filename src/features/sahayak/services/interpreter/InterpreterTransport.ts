export interface InterpreterMessage {
  id: string;
  sessionId: string;
  sender: 'clerk' | 'interpreter' | 'system';
  content: string;
  timestamp: string;
}

export type InterpreterStatus = 'idle' | 'requesting' | 'queued' | 'connecting' | 'connected' | 'ended' | 'failed';

export interface InterpreterTransport {
  requestSession(servicePackId: string, reason: string): Promise<void>;
  getStatus(): InterpreterStatus;
  sendMessage(content: string): Promise<void>;
  onStatusChange(callback: (status: InterpreterStatus) => void): void;
  onMessage(callback: (message: InterpreterMessage) => void): void;
  end(): Promise<void>;
  destroy(): void;
}
