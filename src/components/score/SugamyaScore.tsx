"use client";

import React from "react";

interface SugamyaScoreProps {
  data: {
    overall: number;
    compliance: number;
    satisfaction: number;
    participation: number;
    safetyNet: number;
  };
  className?: string;
}

function getColor(score: number) {
  if (score >= 80) return { fill: "#4ade80", label: "Excellent", ring: "rgba(74,222,128,0.3)" };
  if (score >= 60) return { fill: "#c9a961", label: "Good", ring: "rgba(201,169,97,0.3)" };
  return { fill: "#f87171", label: "Needs Work", ring: "rgba(248,113,113,0.3)" };
}

function GaugeSVG({ score }: { score: number }) {
  const color = getColor(score);
  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-28 mx-auto">
      <svg viewBox="0 0 200 110" className="w-full h-full">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#c9a961" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
        <path
          d="M 10 100 A 80 80 0 0 1 190 100"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 10 100 A 80 80 0 0 1 190 100"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        <span className="text-3xl font-bold" style={{ color: color.fill }}>
          {score}
        </span>
        <span className="text-xs text-white/50 font-medium">{color.label}</span>
      </div>
    </div>
  );
}

function PillarBar({ label, value, weight, color }: { label: string; value: number; weight: string; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70 font-medium">{label}</span>
        <span className="text-sm font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-white/30">Weight: {weight}</p>
    </div>
  );
}

export function SugamyaScore({ data, className = "" }: SugamyaScoreProps) {
  const pillars = [
    { label: "Compliance", value: data.compliance, weight: "45%", color: "#c9a961" },
    { label: "Satisfaction", value: data.satisfaction, weight: "30%", color: "#2dd4bf" },
    { label: "Participation", value: data.participation, weight: "15%", color: "#60a5fa" },
    { label: "Safety Net", value: data.safetyNet, weight: "10%", color: "#a78bfa" },
  ];

  return (
    <div className={`bento-card ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📊</span>
        <h3 className="text-lg font-bold text-white">Sugamya Score</h3>
      </div>
      <GaugeSVG score={data.overall} />
      <div className="mt-6 space-y-4">
        {pillars.map((p) => (
          <PillarBar key={p.label} {...p} />
        ))}
      </div>
    </div>
  );
}
