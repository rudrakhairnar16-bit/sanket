'use client';
import React from 'react';
import { getSignPath } from '@/data/signs/sign-assets';

interface SignAssetProps {
  signId: string;
  size?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function SignAsset({ signId, size = 80, className = '', showLabel = false, label }: SignAssetProps) {
  const path = getSignPath(signId);

  if (!path) {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`} style={{ width: size, height: size }}>
        <div className="flex items-center justify-center rounded-xl bg-white/5 border border-white/10" style={{ width: size, height: size }}>
          <span style={{ fontSize: size * 0.4 }}>🤟</span>
        </div>
        {showLabel && <span className="text-[10px] text-white/50 text-center">{label || signId}</span>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`} style={{ width: size, height: size }}>
      <img
        src={path}
        alt={label || signId}
        width={size}
        height={size}
        className="rounded-xl"
        style={{ filter: 'invert(1) brightness(2)' }}
      />
      {showLabel && <span className="text-[10px] text-white/50 text-center">{label || signId}</span>}
    </div>
  );
}
