"use client";

import React from "react";

export function ProductFlywheel() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          The Complete <span className="gradient-text">Accessibility Loop</span>
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-2xl mx-auto">
          Sanket connects three layers that reinforce each other — creating a continuous improvement cycle for government accessibility.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="glass-card p-8 text-center relative">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gold-400 mb-2">MOMENT</h3>
            <p className="text-white/60 text-sm mb-3">Sanket Sahayak</p>
            <p className="text-white/40">Help the clerk communicate right now. Real-time ISL recognition with confidence-aware results.</p>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-white/20 text-2xl hidden md:block">→</div>
          </div>
          
          <div className="glass-card p-8 text-center relative">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-teal-400 mb-2">HABIT</h3>
            <p className="text-white/60 text-sm mb-3">ISL Quest</p>
            <p className="text-white/40">Build practical sign-language readiness over time. Daily lessons, XP, and adaptive learning.</p>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-white/20 text-2xl hidden md:block">→</div>
          </div>
          
          <div className="glass-card p-8 text-center relative">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gold-400 mb-2">SCORE</h3>
            <p className="text-white/60 text-sm mb-3">Sugamya Score</p>
            <p className="text-white/40">Measure whether accessibility is improving. Institutional analytics that identify skill gaps.</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-white/20 mb-8">
          <div className="w-16 h-px bg-white/20 hidden md:block"></div>
          <span className="text-sm">When AI is uncertain, human interpreters take over</span>
          <div className="w-16 h-px bg-white/20 hidden md:block"></div>
        </div>

        <div className="glass-card p-6 max-w-md mx-auto text-center">
          <div className="text-3xl mb-2">🛡️</div>
          <h3 className="text-lg font-bold text-white mb-1">Human Safety Net</h3>
          <p className="text-white/50 text-sm">Sanket never guesses. When confidence is low, it escalates to trained human interpreters.</p>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></span>
            <span className="text-white/50 text-sm">The loop: Communicate → Learn → Measure → Improve → Repeat</span>
          </div>
        </div>
      </div>
    </section>
  );
}
