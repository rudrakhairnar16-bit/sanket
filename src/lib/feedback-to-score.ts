import { calculateScore, DEFAULT_WEIGHTS, type ScoreInput } from '@/lib/score/calculator';

interface FeedbackData {
  sessionId: string;
  rating: 'yes' | 'partially' | 'no';
  clerkId: string;
  servicePackId: string;
}

interface SessionData {
  recognitionCount: number;
  highConfidenceCount: number;
  confirmedCount: number;
  interpreterUsed: boolean;
  duration: number;
}

export function calculateFeedbackImpact(
  feedback: FeedbackData,
  sessionData: SessionData,
  currentScore: number
): { newScore: number; change: number; pillar: string } {
  let adjustment = 0;
  let pillar = 'Communication Readiness';

  if (feedback.rating === 'yes') {
    adjustment = 2;
    pillar = 'Citizen Feedback';
  } else if (feedback.rating === 'partially') {
    adjustment = 0;
    pillar = 'Citizen Feedback';
  } else {
    adjustment = -3;
    pillar = 'Citizen Feedback';
  }

  if (sessionData.interpreterUsed) {
    adjustment += 1;
    pillar = 'Safety Net Usage';
  }

  if (sessionData.highConfidenceCount > sessionData.recognitionCount * 0.7) {
    adjustment += 1;
    pillar = 'Communication Readiness';
  }

  const newScore = Math.max(0, Math.min(100, currentScore + adjustment));

  return { newScore, change: adjustment, pillar };
}
