'use client';
import React from 'react';
import { SignAsset } from './SignAsset';
import { municipalSigns } from '@/data/signs/municipal-signs';

interface SignSequenceProps {
  signIds: string[];
  phrase: string;
  onReplay?: () => void;
}

export function SignSequence({ signIds, phrase, onReplay }: SignSequenceProps) {
  return (
    <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
      <p className="text-xs text-teal-400 uppercase tracking-wider mb-3">Show to Citizen</p>
      <p className="text-sm text-white mb-3">{phrase}</p>
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {signIds.map((signId, i) => {
          const sign = municipalSigns.find(s => s.id === signId);
          return (
            <React.Fragment key={signId}>
              <div className="flex flex-col items-center gap-1">
                <SignAsset signId={signId} size={64} />
                <span className="text-[10px] text-white/50">{sign?.name || signId}</span>
              </div>
              {i < signIds.length - 1 && (
                <span className="text-white/20 text-lg">+</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {onReplay && (
        <button onClick={onReplay} className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
          ▶ Replay
        </button>
      )}
    </div>
  );
}
