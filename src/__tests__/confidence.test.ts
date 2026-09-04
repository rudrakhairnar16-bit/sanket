import { describe, it, expect } from 'vitest';
import { getConfidenceState, requiresInterpreter, canAutoConfirm, getStateIcon } from '@/lib/recognition/confidence';

describe('getConfidenceState', () => {
  it('returns HIGH for confidence >= 0.82', () => {
    expect(getConfidenceState(0.95)).toBe('HIGH');
    expect(getConfidenceState(0.82)).toBe('HIGH');
  });

  it('returns MEDIUM for confidence >= 0.62 and < 0.82', () => {
    expect(getConfidenceState(0.7)).toBe('MEDIUM');
    expect(getConfidenceState(0.62)).toBe('MEDIUM');
    expect(getConfidenceState(0.81)).toBe('MEDIUM');
  });

  it('returns LOW for confidence >= 0.45 and < 0.62', () => {
    expect(getConfidenceState(0.45)).toBe('LOW');
    expect(getConfidenceState(0.5)).toBe('LOW');
    expect(getConfidenceState(0.61)).toBe('LOW');
  });

  it('returns UNKNOWN for confidence < 0.45', () => {
    expect(getConfidenceState(0)).toBe('UNKNOWN');
    expect(getConfidenceState(0.01)).toBe('UNKNOWN');
    expect(getConfidenceState(0.44)).toBe('UNKNOWN');
  });
});

describe('requiresInterpreter', () => {
  it('returns true for LOW', () => {
    expect(requiresInterpreter('LOW')).toBe(true);
  });

  it('returns true for UNKNOWN', () => {
    expect(requiresInterpreter('UNKNOWN')).toBe(true);
  });

  it('returns false for HIGH', () => {
    expect(requiresInterpreter('HIGH')).toBe(false);
  });

  it('returns false for MEDIUM', () => {
    expect(requiresInterpreter('MEDIUM')).toBe(false);
  });
});

describe('canAutoConfirm', () => {
  it('returns true only for HIGH', () => {
    expect(canAutoConfirm('HIGH')).toBe(true);
  });

  it('returns false for MEDIUM', () => {
    expect(canAutoConfirm('MEDIUM')).toBe(false);
  });

  it('returns false for LOW', () => {
    expect(canAutoConfirm('LOW')).toBe(false);
  });

  it('returns false for UNKNOWN', () => {
    expect(canAutoConfirm('UNKNOWN')).toBe(false);
  });
});

describe('getStateIcon', () => {
  it('returns correct icons', () => {
    expect(getStateIcon('HIGH')).toBe('✓');
    expect(getStateIcon('MEDIUM')).toBe('!');
    expect(getStateIcon('LOW')).toBe('×');
    expect(getStateIcon('UNKNOWN')).toBe('?');
  });
});
