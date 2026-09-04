import { analyzeWeakAreas, type WeakArea } from '@/lib/learning/recommendations';

interface LearningRecommendation {
  area: string;
  score: number;
  recommendedModule: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

const AREA_TO_MODULE: Record<string, string> = {
  'greetings': 'Module 1: Greetings & Basics',
  'basic': 'Module 2: Basic Signs',
  'services': 'Module 3: Service Vocabulary',
  'documents': 'Module 4: Documents & Identity',
  'civic': 'Module 5: Civic Services',
  'daily-life': 'Module 6: Daily Life Signs',
};

export function getLearningRecommendations(
  completedSigns: string[],
  failedSigns: string[]
): LearningRecommendation[] {
  const weakAreas = analyzeWeakAreas(completedSigns, failedSigns);

  return weakAreas.map(area => ({
    area: area.category,
    score: area.score,
    recommendedModule: AREA_TO_MODULE[area.category] || `Practice: ${area.category}`,
    reason: area.score < 50
      ? `Low readiness in ${area.category} — practice recommended`
      : `Continue improving ${area.category} readiness`,
    priority: (area.score < 30 ? 'high' : area.score < 60 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
  })).sort((a, b) => {
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function getSuggestedModule(completedSigns: string[], failedSigns: string[]): string | null {
  const recs = getLearningRecommendations(completedSigns, failedSigns);
  return recs.length > 0 ? recs[0].recommendedModule : null;
}
