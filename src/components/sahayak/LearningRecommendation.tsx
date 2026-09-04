'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface LearningRecommendationProps {
  area: string;
  score: number;
  recommendedModule: string;
  reason: string;
  onStartLearning: () => void;
}

export function LearningRecommendation({ area, score, recommendedModule, reason, onStartLearning }: LearningRecommendationProps) {
  return (
    <Card className="border-blue-500/30 bg-blue-500/5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl shrink-0">📚</div>
        <div className="flex-1">
          <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Recommended Learning</p>
          <p className="text-sm font-medium text-white mb-1">{recommendedModule}</p>
          <p className="text-xs text-white/50 mb-2">{reason}</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-white/40">{area}</span>
            <Badge variant={score < 50 ? 'red' : score < 75 ? 'gold' : 'green'}>
              {score}% ready
            </Badge>
          </div>
          <Button size="sm" onClick={onStartLearning}>Start Learning</Button>
        </div>
      </div>
    </Card>
  );
}
