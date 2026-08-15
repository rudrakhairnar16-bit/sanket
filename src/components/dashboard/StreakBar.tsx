"use client";

import type { StreakData } from "@/lib/hooks/use-dashboard";

function FireIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  );
}

export function StreakBar({
  currentStreak,
  longestStreak,
  totalCompleted,
}: StreakData) {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay();
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - ((today + 6) % 7));

  return (
    <div
      className="surface-card p-5"
      role="progressbar"
      aria-valuenow={currentStreak}
      aria-valuemin={0}
      aria-valuemax={Math.max(longestStreak, 1)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shadow-glow-accent">
            <FireIcon />
          </div>
          <h3 className="font-display font-semibold text-surface-900 dark:text-white text-sm">
            Your Streak
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-surface-500">
            Best:{" "}
            <span className="font-bold text-accent-600 dark:text-accent-400">{longestStreak}</span>
          </span>
          <span className="text-surface-500">
            Total:{" "}
            <span className="font-bold text-primary-600 dark:text-primary-400">{totalCompleted}</span>
          </span>
        </div>
      </div>

      <div className="relative flex items-center gap-1.5">
        <div className="absolute left-[6%] right-[6%] top-[30%] h-0.5 bg-gradient-to-r from-primary-200 via-accent-200 to-primary-200 dark:from-primary-900 dark:via-accent-900 dark:to-primary-900 rounded-full opacity-40" />
        {weekDays.map((day, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          const dateStr = new Date(
            date.getTime() + 5.5 * 60 * 60 * 1000,
          )
            .toISOString()
            .split("T")[0];
          const isToday =
            dateStr ===
            new Date(Date.now() + 5.5 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0];
          const isPast = date < new Date();
          const isStreakDay = isPast && currentStreak > weekDays.length - 1 - i;
          const heat = Math.max(0.4, Math.min(1, (currentStreak - (weekDays.length - 1 - i)) / 5));

          return (
            <div key={day} className="flex-1 text-center relative z-10">
              <div
                className={`w-full aspect-square max-w-[44px] mx-auto rounded-xl flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                  isToday
                    ? "gradient-primary text-white shadow-glow-primary scale-110 border-transparent animate-glow-pulse"
                    : isStreakDay
                    ? `bg-primary-500 text-white border-transparent`
                    : "bg-surface-100 dark:bg-surface-800 text-surface-400 border border-surface-200/60 dark:border-surface-700/40"
                }`}
                style={
                  isStreakDay && !isToday
                    ? { opacity: 0.35 + heat * 0.65 }
                    : undefined
                }
                title={day}
              >
                {isToday ? (
                  <FireIcon />
                ) : isStreakDay ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-[10px]">&mdash;</span>
                )}
              </div>
              <p
                className={`text-[10px] mt-1 ${
                  isToday
                    ? "text-primary-600 dark:text-primary-400 font-bold"
                    : "text-surface-400"
                }`}
              >
                {day}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}