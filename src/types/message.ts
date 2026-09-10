export type MessageDirection = 'citizen_to_clerk' | 'clerk_to_citizen' | 'interpreter_to_clerk' | 'interpreter_to_citizen';
export type MessageChannel = 'isl' | 'text' | 'audio' | 'interpreter';
export type MessageSender = 'citizen' | 'clerk' | 'interpreter' | 'system';
export type MessageReceiver = 'citizen' | 'clerk' | 'interpreter';

export interface Message {
  id: string;
  sessionId: string;
  sender: MessageSender;
  receiver: MessageReceiver;
  direction: MessageDirection;
  channel: MessageChannel;
  content: string;
  confidence?: number;
  confidenceState?: 'high' | 'medium' | 'low' | 'unknown';
  timestamp: string;
  signId?: string;
}

export function createMessage(
  sessionId: string,
  sender: MessageSender,
  receiver: MessageReceiver,
  direction: MessageDirection,
  channel: MessageChannel,
  content: string,
  confidence?: number,
  signId?: string
): Message {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sessionId,
    sender,
    receiver,
    direction,
    channel,
    content,
    confidence,
    confidenceState: confidence !== undefined
      ? confidence >= 0.82 ? 'high' : confidence >= 0.62 ? 'medium' : confidence >= 0.45 ? 'low' : 'unknown'
      : undefined,
    timestamp: new Date().toISOString(),
    signId,
  };
}
