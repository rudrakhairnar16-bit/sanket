import type { InterpreterTransport, InterpreterMessage, InterpreterStatus } from './InterpreterTransport';

export class DemoInterpreterTransport implements InterpreterTransport {
  private status: InterpreterStatus = 'idle';
  private statusCallbacks: ((status: InterpreterStatus) => void)[] = [];
  private messageCallbacks: ((msg: InterpreterMessage) => void)[] = [];
  private sessionId: string = '';
  private timers: NodeJS.Timeout[] = [];

  async requestSession(servicePackId: string, reason: string): Promise<void> {
    this.sessionId = `interp-${Date.now()}`;
    this.setStatus('requesting');
    
    const t1 = setTimeout(() => this.setStatus('queued'), 500);
    const t2 = setTimeout(() => this.setStatus('connecting'), 1500);
    const t3 = setTimeout(() => {
      this.setStatus('connected');
      this.emitMessage({
        id: `msg-${Date.now()}`,
        sessionId: this.sessionId,
        sender: 'system',
        content: 'Interpreter connected. How can I help with this session?',
        timestamp: new Date().toISOString(),
      });
    }, 2500);
    this.timers.push(t1, t2, t3);
  }

  getStatus(): InterpreterStatus { return this.status; }

  async sendMessage(content: string): Promise<void> {
    if (this.status !== 'connected') return;
    this.emitMessage({
      id: `msg-${Date.now()}`,
      sessionId: this.sessionId,
      sender: 'interpreter',
      content,
      timestamp: new Date().toISOString(),
    });
    setTimeout(() => {
      this.emitMessage({
        id: `msg-${Date.now()}`,
        sessionId: this.sessionId,
        sender: 'interpreter',
        content: 'I understand. Let me help translate that.',
        timestamp: new Date().toISOString(),
      });
    }, 1200);
  }

  onStatusChange(callback: (status: InterpreterStatus) => void): void {
    this.statusCallbacks.push(callback);
  }

  onMessage(callback: (msg: InterpreterMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  async end(): Promise<void> {
    this.timers.forEach(clearTimeout);
    this.setStatus('ended');
  }

  destroy(): void {
    this.timers.forEach(clearTimeout);
    this.statusCallbacks = [];
    this.messageCallbacks = [];
  }

  private setStatus(status: InterpreterStatus) {
    this.status = status;
    this.statusCallbacks.forEach(cb => cb(status));
  }

  private emitMessage(msg: InterpreterMessage) {
    this.messageCallbacks.forEach(cb => cb(msg));
  }
}
