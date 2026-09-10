import { describe, it, expect } from 'vitest';
import { createDefaultCard, updateCard, getDueCards, getCardsByDifficulty } from '@/lib/learning/srs';

describe('createDefaultCard', () => {
  it('creates a card with default values', () => {
    const card = createDefaultCard('help');
    expect(card.signId).toBe('help');
    expect(card.easeFactor).toBe(2.5);
    expect(card.interval).toBe(1);
    expect(card.repetitions).toBe(0);
    expect(card.quality).toBe(0);
  });

  it('sets nextReview and lastReview as ISO strings', () => {
    const card = createDefaultCard('hello');
    expect(() => new Date(card.nextReview)).not.toThrow();
    expect(() => new Date(card.lastReview)).not.toThrow();
  });
});

describe('updateCard', () => {
  it('increases interval for good quality (>= 3)', () => {
    const card = createDefaultCard('help');
    const updated = updateCard(card, 4);
    expect(updated.interval).toBeGreaterThanOrEqual(card.interval);
    expect(updated.repetitions).toBe(1);
    expect(updated.quality).toBe(4);
  });

  it('sets interval to 6 on second repetition', () => {
    const card = createDefaultCard('help');
    card.repetitions = 1;
    card.interval = 1;
    const updated = updateCard(card, 4);
    expect(updated.interval).toBe(6);
    expect(updated.repetitions).toBe(2);
  });

  it('applies ease factor multiplier after two repetitions', () => {
    const card = createDefaultCard('help');
    card.repetitions = 2;
    card.interval = 6;
    card.easeFactor = 2.5;
    const updated = updateCard(card, 4);
    expect(updated.interval).toBe(Math.round(6 * updated.easeFactor));
  });

  it('resets for poor quality (< 3)', () => {
    const card = createDefaultCard('help');
    card.repetitions = 3;
    card.interval = 10;
    const updated = updateCard(card, 1);
    expect(updated.repetitions).toBe(0);
    expect(updated.interval).toBe(1);
    expect(updated.quality).toBe(1);
  });

  it('never lets ease factor drop below 1.3', () => {
    const card = createDefaultCard('help');
    card.easeFactor = 1.3;
    const updated = updateCard(card, 0);
    expect(updated.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('updates lastReview timestamp', () => {
    const before = new Date().toISOString();
    const card = createDefaultCard('help');
    const updated = updateCard(card, 5);
    expect(new Date(updated.lastReview).getTime()).toBeGreaterThanOrEqual(new Date(before).getTime());
  });

  it('sets nextReview in the future', () => {
    const card = createDefaultCard('help');
    const updated = updateCard(card, 4);
    expect(new Date(updated.nextReview).getTime()).toBeGreaterThan(new Date(updated.lastReview).getTime());
  });
});

describe('getDueCards', () => {
  it('returns cards due for review', () => {
    const card = createDefaultCard('help');
    card.nextReview = new Date(Date.now() - 1000).toISOString();
    const due = getDueCards([card]);
    expect(due.length).toBe(1);
  });

  it('excludes future cards', () => {
    const card = createDefaultCard('help');
    card.nextReview = new Date(Date.now() + 86400000).toISOString();
    const due = getDueCards([card]);
    expect(due.length).toBe(0);
  });

  it('returns empty array for empty input', () => {
    expect(getDueCards([]).length).toBe(0);
  });

  it('returns only due cards from mixed list', () => {
    const due = createDefaultCard('help');
    due.nextReview = new Date(Date.now() - 1000).toISOString();
    const future = createDefaultCard('hello');
    future.nextReview = new Date(Date.now() + 86400000).toISOString();
    const result = getDueCards([due, future]);
    expect(result.length).toBe(1);
    expect(result[0].signId).toBe('help');
  });
});

describe('getCardsByDifficulty', () => {
  it('categorizes cards by ease factor', () => {
    const easy = createDefaultCard('help');
    easy.easeFactor = 2.8;
    const medium = createDefaultCard('hello');
    medium.easeFactor = 2.0;
    const hard = createDefaultCard('yes');
    hard.easeFactor = 1.5;
    const result = getCardsByDifficulty([easy, medium, hard]);
    expect(result.easy.length).toBe(1);
    expect(result.medium.length).toBe(1);
    expect(result.hard.length).toBe(1);
  });

  it('returns empty arrays for no cards', () => {
    const result = getCardsByDifficulty([]);
    expect(result.easy.length).toBe(0);
    expect(result.medium.length).toBe(0);
    expect(result.hard.length).toBe(0);
  });
});
