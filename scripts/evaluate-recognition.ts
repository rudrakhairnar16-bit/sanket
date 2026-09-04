import { evaluateDataset } from '@/lib/recognition/evaluation';

const result = evaluateDataset([]);
console.log(JSON.stringify({
  model: 'sanket-knn-v2',
  note: 'Leave-one-out diagnostic on repository training data; not field accuracy.',
  accuracy: result.accuracy,
  total: result.total,
  correct: result.correct,
  rejectionRate: result.rejectionRate,
  openSet: result.openSet,
  difficultPairs: result.difficultPairs,
  recommendedDistance: result.recommendedDistance,
  recommendedMargin: result.recommendedMargin,
  samplesByClass: result.samplesByClass,
  labels: result.labels,
  confusionMatrix: result.matrix,
}, null, 2));
