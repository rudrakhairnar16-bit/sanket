import { describe, it, expect } from 'vitest';
import { calculateFeedbackImpact } from '@/lib/feedback-to-score';

describe('calculateFeedbackImpact', () => {
  const baseSessionData = {
    recognitionCount: 5,
    highConfidenceCount: 4,
    confirmedCount: 3,
    interpreterUsed: false,
    duration: 300,
  };

  it('increases score for positive feedback', () => {
    const result = calculateFeedbackImpact(
      { sessionId: '1', rating: 'yes', clerkId: 'c1', servicePackId: 'sp1' },
      baseSessionData,
      70
    );
    expect(result.newScore).toBeGreaterThan(70);
    expect(result.change).toBeGreaterThan(0);
    expect(result.pillar).toBe('Communication Readiness');
  });

  it('decreases score for negative feedback', () => {
    const result = calculateFeedbackImpact(
      { sessionId: '1', rating: 'no', clerkId: 'c1', servicePackId: 'sp1' },
      baseSessionData,
      70
    );
    expect(result.newScore).toBeLessThan(70);
    expect(result.change).toBeLessThan(0);
    expect(result.pillar).toBe('Communication Readiness');
  });

  it('does not add base adjustment for partially feedback', () => {
    const result = calculateFeedbackImpact(
      { sessionId: '1', rating: 'partially', clerkId: 'c1', servicePackId: 'sp1' },
      { recognitionCount: 5, highConfidenceCount: 2, confirmedCount: 1, interpreterUsed: false, duration: 300 },
      70
    );
    expect(result.newScore).toBe(70);
    expect(result.change).toBe(0);
  });

  it('adds bonus when interpreter is used', () => {
    const result = calculateFeedbackImpact(
      { sessionId: '1', rating: 'yes', clerkId: 'c1', servicePackId: 'sp1' },
      { recognitionCount: 10, highConfidenceCount: 2, confirmedCount: 1, interpreterUsed: true, duration: 300 },
      70
    );
    expect(result.change).toBe(3);
    expect(result.pillar).toBe('Safety Net Usage');
  });

  it('adds bonus when high confidence ratio exceeds 70%', () => {
    const result = calculateFeedbackImpact(
      { sessionId: '1', rating: 'yes', clerkId: 'c1', servicePackId: 'sp1' },
      { recognitionCount: 10, highConfidenceCount: 9, confirmedCount: 3, interpreterUsed: false, duration: 300 },
      70
    );
    expect(result.change).toBe(3);
    expect(result.pillar).toBe('Communication Readiness');
  });

  it('caps score at 100', () => {
    const result = calculateFeedbackImpact(
      { sessionId: '1', rating: 'yes', clerkId: 'c1', servicePackId: 'sp1' },
      { recognitionCount: 10, highConfidenceCount: 10, confirmedCount: 10, interpreterUsed: true, duration: 600 },
      98
    );
    expect(result.newScore).toBeLessThanOrEqual(100);
  });

  it('caps score at 0', () => {
    const result = calculateFeedbackImpact(
      { sessionId: '1', rating: 'no', clerkId: 'c1', servicePackId: 'sp1' },
      { recognitionCount: 0, highConfidenceCount: 0, confirmedCount: 0, interpreterUsed: false, duration: 300 },
      2
    );
    expect(result.newScore).toBeGreaterThanOrEqual(0);
  });

  it('returns a pillar string', () => {
    const result = calculateFeedbackImpact(
      { sessionId: '1', rating: 'yes', clerkId: 'c1', servicePackId: 'sp1' },
      baseSessionData,
      50
    );
    expect(typeof result.pillar).toBe('string');
    expect(result.pillar.length).toBeGreaterThan(0);
  });
});
