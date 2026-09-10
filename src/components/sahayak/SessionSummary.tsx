'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SessionSummaryProps {
  duration: string;
  recognitionCount: number;
  highConfidenceCount: number;
  confirmedCount: number;
  interpreterUsed: boolean;
  servicePackName: string;
  onFeedback: (rating: 'yes' | 'partially' | 'no') => void;
  onContinue: () => void;
  onGoToLearning: () => void;
}

export function SessionSummary({
  duration,
  recognitionCount,
  highConfidenceCount,
  confirmedCount,
  interpreterUsed,
  servicePackName,
  onFeedback,
  onContinue,
  onGoToLearning,
}: SessionSummaryProps) {
  return (
    <Card className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-xl font-bold text-white mb-1">Session Completed</h2>
        <p className="text-sm text-white/50">{servicePackName}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="text-lg font-bold text-gold-400">{duration}</p>
          <p className="text-[10px] text-white/40">Duration</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="text-lg font-bold text-white">{recognitionCount}</p>
          <p className="text-[10px] text-white/40">Recognitions</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="text-lg font-bold text-green-400">{highConfidenceCount}</p>
          <p className="text-[10px] text-white/40">High Confidence</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="text-lg font-bold text-blue-400">{confirmedCount}</p>
          <p className="text-[10px] text-white/40">Confirmed</p>
        </div>
      </div>

      {interpreterUsed && (
        <div className="mb-4 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
          <p className="text-xs text-teal-400">Interpreter was used during this session</p>
        </div>
      )}

      <div className="mb-6">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Was communication successful?</p>
        <div className="flex gap-2">
          <Button onClick={() => onFeedback('yes')} className="flex-1">Yes</Button>
          <Button variant="secondary" onClick={() => onFeedback('partially')} className="flex-1">Partially</Button>
          <Button variant="danger" onClick={() => onFeedback('no')} className="flex-1">No</Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={onContinue} className="flex-1">New Session</Button>
        <Button onClick={onGoToLearning} className="flex-1">Practice ISL</Button>
      </div>
    </Card>
  );
}
