"use client";

import React from "react";
import type { ConfidenceState } from "@/types";

interface ConfidenceIndicatorProps {
  state: ConfidenceState;
  confidence?: number;
  label?: string;
}

export function ConfidenceIndicator({ state, confidence, label }: ConfidenceIndicatorProps) {
  const stateConfig: Record<ConfidenceState, { color: string; bg: string; text: string; icon: string }> = {
    UNKNOWN: { color: "text-white/40", bg: "bg-white/10", text: "No reliable recognition", icon: "❓" },
    PROCESSING: { color: "text-blue-400", bg: "bg-blue-500/20", text: "Processing...", icon: "⏳" },
    LOW: { color: "text-red-400", bg: "bg-red-500/20", text: "Couldn't confidently recognize", icon: "⚠️" },
    MEDIUM: { color: "text-yellow-400", bg: "bg-yellow-500/20", text: "Possible match", icon: "🤔" },
    HIGH: { color: "text-green-400", bg: "bg-green-500/20", text: "Likely match", icon: "✅" },
    CONFIRMED: { color: "text-gold-400", bg: "bg-gold-400/20", text: "Confirmed", icon: "✓" },
  };

  const config = stateConfig[state];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.color} text-sm font-medium`} role="status" aria-label={`Confidence: ${config.text}${confidence ? ` ${Math.round(confidence * 100)}%` : ""}`}>
      <span aria-hidden="true">{config.icon}</span>
      <span>{label || config.text}</span>
      {confidence !== undefined && state !== "UNKNOWN" && state !== "PROCESSING" && (
        <span className="text-xs opacity-70">{Math.round(confidence * 100)}%</span>
      )}
    </div>
  );
}
