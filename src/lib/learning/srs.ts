export interface SRSCard {
  signId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReview: string;
  quality: number;
}

export function createDefaultCard(signId: string): SRSCard {
  return {
    signId,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: new Date().toISOString(),
    lastReview: new Date().toISOString(),
    quality: 0,
  };
}

export function updateCard(card: SRSCard, quality: number): SRSCard {
  const now = new Date();
  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    ...card,
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReview: nextReview.toISOString(),
    lastReview: now.toISOString(),
    quality,
  };
}

export function getDueCards(cards: SRSCard[]): SRSCard[] {
  const now = new Date();
  return cards.filter(card => new Date(card.nextReview) <= now);
}

export function getCardsByDifficulty(cards: SRSCard[]): { easy: SRSCard[]; medium: SRSCard[]; hard: SRSCard[] } {
  return {
    easy: cards.filter(c => c.easeFactor >= 2.5),
    medium: cards.filter(c => c.easeFactor >= 1.8 && c.easeFactor < 2.5),
    hard: cards.filter(c => c.easeFactor < 1.8),
  };
}
