export type { InterpreterTransport, InterpreterMessage, InterpreterStatus } from './InterpreterTransport';
export { DemoInterpreterTransport } from './DemoInterpreterTransport';
export { RealInterpreterTransport } from './RealInterpreterTransport';

import type { InterpreterTransport } from './InterpreterTransport';
import { DemoInterpreterTransport } from './DemoInterpreterTransport';
import { RealInterpreterTransport } from './RealInterpreterTransport';

type TransportMode = 'demo' | 'real';

let instance: InterpreterTransport | null = null;

export function getInterpreterTransport(mode: TransportMode = 'demo', socketUrl?: string): InterpreterTransport {
  if (instance) {
    instance.destroy();
    instance = null;
  }

  if (mode === 'real') {
    instance = new RealInterpreterTransport(socketUrl);
  } else {
    instance = new DemoInterpreterTransport();
  }

  return instance;
}

export function getCurrentTransport(): InterpreterTransport | null {
  return instance;
}
