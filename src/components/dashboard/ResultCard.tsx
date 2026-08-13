"use client";

import type { StreakData, ModuleData } from "@/lib/hooks/use-dashboard";

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-3.5 text-center">
      <p className="text-xl font-bold text-surface-900 dark:text-white">
        {value}
      </p>
      <p className="text-[10px] text-surface-500">{label}</p>
    </div>
  );
}

export function ResultCard({
  correct,
  milestone,
  streak,
  module: mod,
  selectedAnswer,
  onPractice,
  practiceDone,
}: {
  correct: boolean;
  milestone: number | null;
  streak: StreakData;
  module: ModuleData;
  selectedAnswer: string;
  onPractice: () => void;
  practiceDone: boolean;
}) {
  return (
    <div className="space-y-5">
      <div
        className={`p-6 text-center ${
          correct
            ? "glass border-emerald-500/20"
            : "glass border-red-500/20"
        }`}
        aria-live="polite"
      >
        <div
          className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
            correct
              ? "gradient-primary shadow-glow-primary"
              : "bg-red-500/20"
          }`}
        >
          {correct ? (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f87171"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01" />
            </svg>
          )}
        </div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
          {correct ? "Correct!" : "Not quite right"}
        </h2>
        <p className="text-surface-500 text-sm">
          {correct
            ? `You've earned a ${streak.currentStreak}-day streak!`
            : `The correct answer was: ${mod.correctAnswer}`}
        </p>
        {!correct && (
          <p className="text-xs text-surface-400 mt-1">
            You selected: {selectedAnswer}
          </p>
        )}
      </div>

      {correct && !practiceDone && (
        <div className="animate-slide-up">
          <div className="glass border-primary-500/10 p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-surface-900 dark:text-white mb-0.5">
              Practice with your camera
            </h3>
            <p className="text-surface-500 text-xs mb-3">
              Show the sign to your webcam and get real-time feedback
            </p>
            <button onClick={onPractice} className="btn-primary text-sm">
              Open Camera Practice
            </button>
          </div>
        </div>
      )}

      {practiceDone && (
        <div className="glass border-emerald-500/20 p-4 text-center animate-scale-in">
          <div className="w-9 h-9 mx-auto mb-1.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-emerald-400 font-medium text-xs">
            Sign practice completed!
          </p>
        </div>
      )}

      {milestone && (
        <div className="animate-scale-in">
          <div className="glass border-accent/20 p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full gradient-accent flex items-center justify-center shadow-glow-accent">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 22h14l-7-20-7 20z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-accent-300 mb-0.5">
              {milestone}-Day Milestone!
            </h3>
            <p className="text-accent-500 text-sm mb-3">
              You&#39;ve completed {milestone} days of learning ISL. Consistency
              is key!
            </p>
            <div className="btn-accent text-sm inline-block">
              Download Certificate
            </div>
          </div>
        </div>
      )}

      <div className="surface-card p-5" aria-live="polite">
        <h3 className="font-semibold text-surface-900 dark:text-white text-sm mb-3">
          Your Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="Current Streak" value={streak.currentStreak} />
          <StatCard label="Longest Streak" value={streak.longestStreak} />
          <StatCard label="Total Lessons" value={streak.totalCompleted} />
        </div>
      </div>
    </div>
  );
}
