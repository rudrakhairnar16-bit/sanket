"use client";

import { useEffect, useRef, useState } from "react";
import type { StreakData, ModuleData } from "@/lib/hooks/use-dashboard";

function CountUp({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let current = 0;
    const step = Math.max(1, Math.round(value / 30));
    const timer = setInterval(() => {
      current = Math.min(value, current + step);
      setDisplay(current);
      if (current >= value) clearInterval(timer);
    }, 24);
    return () => clearInterval(timer);
  }, [value]);

  return <span className={className}>{display}</span>;
}

function FlameIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4h10v3a5 5 0 01-10 0V4z" />
      <path d="M7 5H4v2a4 4 0 003.8 4M17 5h3v2a4 4 0 01-3.8 4" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: "primary" | "accent" | "success";
}) {
  const styles = {
    primary: "from-primary-500/10 to-primary-500/5 text-primary-600 dark:text-primary-400",
    accent: "from-accent-500/10 to-accent-500/5 text-accent-600 dark:text-accent-400",
    success: "from-success-500/10 to-success-500/5 text-success-600 dark:text-success-400",
  }[accent];

  return (
    <div className="relative rounded-xl p-3.5 text-center bg-gradient-to-br border border-surface-200/60 dark:border-surface-700/40 overflow-hidden">
      <div className={`w-8 h-8 mx-auto mb-1.5 rounded-lg flex items-center justify-center ${styles}`}>
        {icon}
      </div>
      <CountUp value={value} className="text-xl font-bold font-display text-surface-900 dark:text-white animate-number-pop" />
      <p className="text-[10px] text-surface-500 mt-0.5">{label}</p>
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
        className={`p-6 sm:p-8 text-center rounded-card border ${
          correct
            ? "bg-gradient-to-br from-success-500/10 via-transparent to-primary-500/5 border-success-500/25"
            : "bg-gradient-to-br from-danger-500/10 via-transparent to-danger-500/5 border-danger-500/25"
        }`}
        aria-live="polite"
      >
        <div
          className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            correct
              ? "gradient-success shadow-glow-success animate-pop-in"
              : "bg-danger-500/20 ring-4 ring-danger-500/10 animate-pop-in"
          }`}
        >
          {correct ? (
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="32"
              height="32"
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
        <h2 className="font-display text-2xl font-bold text-surface-900 dark:text-white mb-1.5">
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
          <div className="rounded-card border border-primary-500/15 bg-white dark:bg-surface-900/80 p-5 text-center shadow-card">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary animate-glow-pulse">
              <svg
                width="24"
                height="24"
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
            <h3 className="font-display text-base font-bold text-surface-900 dark:text-white mb-0.5">
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
        <div className="rounded-card border border-success-500/25 bg-success-500/5 p-4 text-center animate-pop-in">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-success-500/20 flex items-center justify-center">
            <svg
              width="18"
              height="18"
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
          <p className="text-success-500 font-medium text-xs">
            Sign practice completed!
          </p>
        </div>
      )}

      {milestone && (
        <div className="animate-pop-in">
          <div className="rounded-card border border-accent-500/25 bg-gradient-to-br from-accent-500/10 via-white to-accent-500/5 dark:from-accent-500/15 dark:via-surface-900 dark:to-surface-900 p-6 text-center shadow-card">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full gradient-accent flex items-center justify-center shadow-glow-accent animate-glow-pulse">
              <svg
                width="32"
                height="32"
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
            <h3 className="font-display text-xl font-bold text-accent-600 dark:text-accent-400 mb-0.5">
              {milestone}-Day Milestone!
            </h3>
            <p className="text-accent-600/70 dark:text-accent-500 text-sm mb-3">
              You&#39;ve completed {milestone} days of learning ISL. Consistency
              is key!
            </p>
            <div className="btn-accent text-sm inline-block">
              Download Certificate
            </div>
          </div>
        </div>
      )}

      <div className="rounded-card bg-white dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700/50 p-5 shadow-card" aria-live="polite">
        <h3 className="font-display font-semibold text-surface-900 dark:text-white text-sm mb-3">
          Your Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="Current Streak"
            value={streak.currentStreak}
            accent="accent"
            icon={<FlameIcon />}
          />
          <StatCard
            label="Longest Streak"
            value={streak.longestStreak}
            accent="primary"
            icon={<TrophyIcon />}
          />
          <StatCard
            label="Total Lessons"
            value={streak.totalCompleted}
            accent="success"
            icon={<BookIcon />}
          />
        </div>
      </div>
    </div>
  );
}