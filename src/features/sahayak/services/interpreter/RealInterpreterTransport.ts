import type { InterpreterTransport, InterpreterMessage, InterpreterStatus } from './InterpreterTransport';

interface SocketData {
  landmarks?: number[];
  label?: string;
  confidence?: number;
  text?: string;
  emoji?: string;
}

export class RealInterpreterTransport implements InterpreterTransport {
  private status: InterpreterStatus = 'idle';
  private statusCallbacks: ((status: InterpreterStatus) => void)[] = [];
  private messageCallbacks: ((msg: InterpreterMessage) => void)[] = [];
  private signDataCallbacks: ((data: SocketData) => void)[] = [];
  private reactionCallbacks: ((emoji: string) => void)[] = [];
  private endCallbacks: (() => void)[] = [];
  private sessionId: string = '';
  private socket: any = null;
  private connected: boolean = false;

  constructor(private socketUrl: string = 'http://localhost:3001') {}

  async requestSession(servicePackId: string, reason: string): Promise<void> {
    this.sessionId = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.setStatus('requesting');

    try {
      const { io } = await import('socket.io-client');
      this.socket = io(this.socketUrl, {
        transports: ['websocket', 'polling'],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        this.socket.emit('join-session', {
          sessionId: this.sessionId,
          userRole: 'interpreter',
        });
      });

      this.socket.on('session-joined', () => {
        this.connected = true;
        this.setStatus('connected');
        this.emitMessage({
          id: `msg-${Date.now()}`,
          sessionId: this.sessionId,
          sender: 'system',
          content: 'Connected to session via Socket.IO',
          timestamp: new Date().toISOString(),
        });
      });

      this.socket.on('text-message', (data: { text: string; sender: string; timestamp: number }) => {
        if (data.sender !== 'interpreter') {
          this.emitMessage({
            id: `msg-${data.timestamp}`,
            sessionId: this.sessionId,
            sender: data.sender as 'clerk' | 'system',
            content: data.text,
            timestamp: new Date(data.timestamp).toISOString(),
          });
        }
      });

      this.socket.on('sign-data', (data: SocketData) => {
        this.signDataCallbacks.forEach(cb => cb(data));
      });

      this.socket.on('reaction', (data: { emoji: string }) => {
        this.reactionCallbacks.forEach(cb => cb(data.emoji));
      });

      this.socket.on('session-ended', () => {
        this.setStatus('ended');
        this.endCallbacks.forEach(cb => cb());
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
      });

      this.socket.on('reconnect', () => {
        this.socket.emit('join-session', {
          sessionId: this.sessionId,
          userRole: 'interpreter',
        });
      });

      this.socket.connect();
      this.setStatus('connecting');
    } catch (error) {
      this.setStatus('failed');
      throw error;
    }
  }

  getStatus(): InterpreterStatus {
    return this.status;
  }

  async sendMessage(content: string): Promise<void> {
    if (this.status !== 'connected' || !this.socket?.connected) return;

    this.socket.emit('text-message', {
      sessionId: this.sessionId,
      text: content,
      sender: 'interpreter',
    });

    this.emitMessage({
      id: `msg-${Date.now()}`,
      sessionId: this.sessionId,
      sender: 'interpreter',
      content,
      timestamp: new Date().toISOString(),
    });
  }

  sendSignData(landmarks: number[], label?: string, confidence?: number): void {
    if (this.status !== 'connected' || !this.socket?.connected) return;

    this.socket.emit('sign-data', {
      sessionId: this.sessionId,
      landmarks,
      label,
      confidence,
      timestamp: new Date().toISOString(),
    });
  }

  sendReaction(emoji: string): void {
    if (this.status !== 'connected' || !this.socket?.connected) return;

    this.socket.emit('reaction', {
      sessionId: this.sessionId,
      emoji,
    });
  }

  onSignData(callback: (data: SocketData) => void): void {
    this.signDataCallbacks.push(callback);
  }

  onReaction(callback: (emoji: string) => void): void {
    this.reactionCallbacks.push(callback);
  }

  onSessionEnd(callback: () => void): void {
    this.endCallbacks.push(callback);
  }

  onStatusChange(callback: (status: InterpreterStatus) => void): void {
    this.statusCallbacks.push(callback);
  }

  onMessage(callback: (msg: InterpreterMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  async end(): Promise<void> {
    if (this.socket?.connected) {
      this.socket.emit('session-end', { sessionId: this.sessionId });
    }
    this.setStatus('ended');
  }

  destroy(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
    this.statusCallbacks = [];
    this.messageCallbacks = [];
    this.signDataCallbacks = [];
    this.reactionCallbacks = [];
    this.endCallbacks = [];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  isConnected(): boolean {
    return this.connected && this.socket?.connected;
  }

  private setStatus(status: InterpreterStatus) {
    this.status = status;
    this.statusCallbacks.forEach(cb => cb(status));
  }

  private emitMessage(msg: InterpreterMessage) {
    this.messageCallbacks.forEach(cb => cb(msg));
  }
}
