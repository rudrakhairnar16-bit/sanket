export interface ScoreWeights {
  communicationReadiness: number;
  clerkLearning: number;
  assistedInteraction: number;
  citizenFeedback: number;
  safetyNet: number;
  systemAvailability: number;
}

export const DEFAULT_WEIGHTS: ScoreWeights = {
  communicationReadiness: 0.30,
  clerkLearning: 0.20,
  assistedInteraction: 0.20,
  citizenFeedback: 0.15,
  safetyNet: 0.10,
  systemAvailability: 0.05,
};

export interface ScoreInput {
  totalSessions: number;
  completedSessions: number;
  escalatedSessions: number;
  totalFeedback: number;
  positiveFeedback: number;
  averageRating: number;
  activeLearners: number;
  totalStaff: number;
  signsLearned: number;
  totalSignsAvailable: number;
  systemUptime: number;
}

export interface SugamyaScore {
  overall: number;
  communicationReadiness: number;
  clerkLearning: number;
  assistedInteraction: number;
  citizenFeedback: number;
  safetyNet: number;
  systemAvailability: number;
  breakdown: {
    communicationReadiness: { score: number; weight: number; detail: string };
    clerkLearning: { score: number; weight: number; detail: string };
    assistedInteraction: { score: number; weight: number; detail: string };
    citizenFeedback: { score: number; weight: number; detail: string };
    safetyNet: { score: number; weight: number; detail: string };
    systemAvailability: { score: number; weight: number; detail: string };
  };
  recommendations: string[];
}

export function calculateScore(input: ScoreInput, weights: ScoreWeights = DEFAULT_WEIGHTS): SugamyaScore {
  const communicationReadiness = Math.min(100, Math.round(
    (input.totalSessions > 0 ? (input.completedSessions / input.totalSessions) * 100 : 0) * 0.5 +
    (input.totalStaff > 0 ? (input.activeLearners / input.totalStaff) * 100 : 0) * 0.5
  ));

  const clerkLearning = Math.min(100, Math.round(
    (input.totalSignsAvailable > 0 ? (input.signsLearned / input.totalSignsAvailable) * 100 : 0) * 0.6 +
    (input.totalStaff > 0 ? (input.activeLearners / input.totalStaff) * 100 : 0) * 0.4
  ));

  const assistedInteraction = Math.min(100, Math.round(
    (input.totalSessions > 0 ? (input.completedSessions / input.totalSessions) * 100 : 0) * 0.7 +
    (input.totalSessions > 0 ? Math.min(100, ((input.totalSessions - input.escalatedSessions) / input.totalSessions) * 100) : 0) * 0.3
  ));

  const citizenFeedback = Math.min(100, Math.round(
    input.averageRating > 0 ? (input.averageRating / 5) * 100 : 0
  ));

  const safetyNet = Math.min(100, Math.round(
    input.totalSessions > 0 ? Math.min(100, (input.escalatedSessions / input.totalSessions) * 100 * 5) : 50
  ));

  const systemAvailability = input.systemUptime;

  const overall = Math.round(
    communicationReadiness * weights.communicationReadiness +
    clerkLearning * weights.clerkLearning +
    assistedInteraction * weights.assistedInteraction +
    citizenFeedback * weights.citizenFeedback +
    safetyNet * weights.safetyNet +
    systemAvailability * weights.systemAvailability
  );

  const recommendations: string[] = [];
  if (clerkLearning < 60) recommendations.push('Increase clerk ISL learning participation');
  if (citizenFeedback < 70) recommendations.push('Improve citizen communication experience');
  if (safetyNet < 50) recommendations.push('Review interpreter escalation patterns');
  if (communicationReadiness < 70) recommendations.push('Boost active session completion rate');

  return {
    overall: Math.min(100, overall),
    communicationReadiness,
    clerkLearning,
    assistedInteraction,
    citizenFeedback,
    safetyNet,
    systemAvailability,
    breakdown: {
      communicationReadiness: { score: communicationReadiness, weight: weights.communicationReadiness, detail: `${input.completedSessions}/${input.totalSessions} sessions completed` },
      clerkLearning: { score: clerkLearning, weight: weights.clerkLearning, detail: `${input.signsLearned}/${input.totalSignsAvailable} signs learned` },
      assistedInteraction: { score: assistedInteraction, weight: weights.assistedInteraction, detail: `${input.completedSessions}/${input.totalSessions} successful` },
      citizenFeedback: { score: citizenFeedback, weight: weights.citizenFeedback, detail: `Avg rating: ${input.averageRating.toFixed(1)}/5` },
      safetyNet: { score: safetyNet, weight: weights.safetyNet, detail: `${input.escalatedSessions} escalations` },
      systemAvailability: { score: systemAvailability, weight: weights.systemAvailability, detail: `${input.systemUptime}% uptime` },
    },
    recommendations,
  };
}
