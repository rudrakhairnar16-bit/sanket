"use client";

import { useState, useEffect } from "react";

const STEPS = [
  {
    title: "👋 Welcome to Sanket",
    body: "A civic tech platform helping government clerks learn Indian Sign Language (ISL). Let's take a 60-second tour.",
    target: "",
  },
  {
    title: "📚 Daily Lesson",
    body: "Each day starts with one short ISL video and one MCQ. Takes 3 minutes. Streaks build daily habit.",
    target: "Daily Lesson",
  },
  {
    title: "🔥 Streak System",
    body: "Build consecutive-day streaks. Milestone bonuses at 3, 7, 14, 21, 30, 60, 100 days. Certificates unlock at 7+ days.",
    target: "Day Streak",
  },
  {
    title: "🎮 ISL Quest",
    body: "Public learning mode — no login needed. Flashcards, quizzes, webcam practice, dictionary, leaderboard, badges.",
    target: "ISL Quest",
  },
  {
    title: "📊 Admin Dashboard",
    body: "Compliance analytics, department-wise charts, CSV export, QR code feedback, WhatsApp nudges.",
    target: "Admin",
  },
];

export function DemoTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("sanket-tour-seen");
    if (!seen) {
      setTimeout(() => setActive(true), 800);
    } else {
      setDismissed(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("sanket-tour-seen", "1");
    setActive(false);
    setDismissed(true);
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  }

  if (!active || dismissed) return null;

  const s = STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismiss} />

      <div className="relative bg-white dark:bg-surface-800 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-slide-up border border-primary-500/20">
        <div className="flex items-center gap-2 mb-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i === step ? "bg-primary-500" : i < step ? "bg-emerald-500" : "bg-surface-300 dark:bg-surface-600"}`} />
          ))}
        </div>

        <div className="my-5">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">{s.title}</h3>
          <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{s.body}</p>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={dismiss} className="text-xs text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors">
            Skip tour
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="px-4 py-2 text-sm rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all">
                Back
              </button>
            )}
            <button onClick={next} className="px-5 py-2 text-sm rounded-xl gradient-primary text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-primary-500/20">
              {step < STEPS.length - 1 ? "Next" : "Got it!"}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-surface-400 text-center mt-4">
          {step + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}
