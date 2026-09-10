"use client";

import React, { useState, useEffect } from "react";

const STEPS = [
  { icon: "👤", label: "Citizen arrives", detail: "Deaf citizen approaches the service counter", color: "white" },
  { icon: "🤝", label: "Sanket Sahayak", detail: "Clerk opens Sanket and selects Property Tax", color: "gold" },
  { icon: "✋", label: "Citizen signs", detail: "Citizen communicates using ISL — camera captures hand signs", color: "white" },
  { icon: "🤖", label: "AI Recognition", detail: "Sign recognized: PAYMENT — Confidence: 93%", color: "teal" },
  { icon: "🔊", label: "Clerk hears", detail: "Clerk sees text AND hears: Citizen is asking about payment", color: "gold" },
  { icon: "💬", label: "Clerk responds", detail: "Please show your payment receipt", color: "teal" },
  { icon: "❌", label: "Low confidence", detail: "Second sign — confidence only 42%. Sanket does NOT guess.", color: "red" },
  { icon: "📞", label: "Interpreter", detail: "Clerk connects to human interpreter for assistance", color: "gold" },
  { icon: "✅", label: "Session complete", detail: "Service delivered. Feedback collected. Score updated.", color: "green" },
];

export function LiveDemoFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= STEPS.length - 1) { setIsPlaying(false); return prev; }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = () => { setActiveStep(0); setIsPlaying(true); };
  const handleReset = () => { setActiveStep(0); setIsPlaying(false); };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-navy-800/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          See the <span className="gradient-text">Complete Flow</span>
        </h2>
        <p className="text-white/50 text-center mb-8">From citizen arrival to service completion — in real time</p>
        
        <div className="flex gap-3 justify-center mb-8">
          <button onClick={handlePlay} className="btn-primary" disabled={isPlaying}>
            {isPlaying ? 'Playing...' : '▶ Play Demo Flow'}
          </button>
          <button onClick={handleReset} className="btn-secondary">Reset</button>
        </div>

        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <div key={i} className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 ${
              i <= activeStep 
                ? 'glass-card opacity-100 translate-x-0' 
                : 'opacity-30 translate-x-4'
            }`}>
              <div className={`text-2xl w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${
                i === activeStep ? 'bg-gold-400/20 animate-pulse' : 'bg-white/5'
              }`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${
                  step.color === 'gold' ? 'text-gold-400' : 
                  step.color === 'teal' ? 'text-teal-400' : 
                  step.color === 'red' ? 'text-red-400' : 
                  step.color === 'green' ? 'text-green-400' : 'text-white'
                }`}>{step.label}</p>
                <p className="text-white/50 text-xs mt-0.5">{step.detail}</p>
              </div>
              <div className="text-xs text-white/20">{i + 1}/{STEPS.length}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
