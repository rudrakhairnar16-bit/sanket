import type { ConfidenceState } from './types';

export function getConfidenceState(confidence: number): ConfidenceState {
  if (confidence >= 0.82) return 'HIGH';
  if (confidence >= 0.62) return 'MEDIUM';
  if (confidence >= 0.45) return 'LOW';
  return 'UNKNOWN';
}

export function canAutoConfirm(state: ConfidenceState): boolean {
  return state === 'HIGH';
}

export function requiresInterpreter(state: ConfidenceState): boolean {
  return state === 'LOW' || state === 'UNKNOWN';
}

export function getStateIcon(state: ConfidenceState): string {
  switch (state) {
    case 'HIGH': return '✓';
    case 'MEDIUM': return '!';
    case 'LOW': return '×';
    case 'UNKNOWN': return '?';
    case 'PROCESSING': return '…';
    case 'CONFIRMED': return '✓';
    default: return '○';
  }
}

export function getStateLabel(state: ConfidenceState): string {
  switch (state) {
    case 'HIGH': return 'HIGH CONFIDENCE';
    case 'MEDIUM': return 'CONFIRM / HOLD';
    case 'LOW': return 'LOW CONFIDENCE';
    case 'UNKNOWN': return 'NOT CONFIDENT';
    case 'PROCESSING': return 'ANALYZING';
    case 'CONFIRMED': return 'CONFIRMED';
    default: return 'IDLE';
  }
}

export function getStateColor(state: ConfidenceState): string {
  switch (state) {
    case 'HIGH': return 'green';
    case 'MEDIUM': return 'gold';
    case 'LOW': return 'red';
    case 'UNKNOWN': return 'gray';
    case 'PROCESSING': return 'blue';
    case 'CONFIRMED': return 'green';
    default: return 'gray';
  }
}
