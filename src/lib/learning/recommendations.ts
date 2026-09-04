import { municipalSigns, signCategories } from '@/data/signs/municipal-signs';

export interface LearningRecommendation {
  signId: string;
  signName: string;
  category: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WeakArea {
  category: string;
  weakSigns: string[];
  score: number;
  recommendation: string;
}

export function analyzeWeakAreas(
  completedSigns: string[],
  failedSigns: string[],
): WeakArea[] {
  const weakAreas: WeakArea[] = [];

  for (const cat of signCategories) {
    const categorySigns = municipalSigns.filter(s => s.category === cat.name);
    const learned = categorySigns.filter(s => completedSigns.includes(s.id));
    const failed = categorySigns.filter(s => failedSigns.includes(s.id));

    if (categorySigns.length === 0) continue;

    const score = Math.round(((learned.length - failed.length) / categorySigns.length) * 100);

    if (score < 70 || failed.length > 0) {
      weakAreas.push({
        category: cat.name,
        weakSigns: failed.map(s => s.id),
        score: Math.max(0, score),
        recommendation: `Review ${cat.name} — ${failed.length} signs need practice`,
      });
    }
  }

  return weakAreas.sort((a, b) => a.score - b.score);
}

export function getRecommendations(
  completedSigns: string[],
  failedSigns: string[],
  limit: number = 5,
): LearningRecommendation[] {
  const recs: LearningRecommendation[] = [];

  for (const sign of municipalSigns) {
    const isFailed = failedSigns.includes(sign.id);
    const isCompleted = completedSigns.includes(sign.id);

    if (isFailed) {
      recs.push({
        signId: sign.id,
        signName: sign.name,
        category: sign.category,
        reason: 'Previously failed — needs review',
        priority: 'high',
      });
    } else if (!isCompleted) {
      recs.push({
        signId: sign.id,
        signName: sign.name,
        category: sign.category,
        reason: 'Not yet learned',
        priority: 'medium',
      });
    }
  }

  return recs
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, limit);
}
