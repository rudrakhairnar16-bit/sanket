"use client";

import type { StreakData } from "@/lib/hooks/use-dashboard";

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
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-surface-900 dark:text-white text-sm">
          Your Streak
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-surface-500">
            Best:{" "}
            <span className="font-bold text-accent-400">{longestStreak}</span>
          </span>
          <span className="text-surface-500">
            Total:{" "}
            <span className="font-bold text-primary-400">{totalCompleted}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
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

          return (
            <div key={day} className="flex-1 text-center">
              <div
                className={`w-full aspect-square max-w-[36px] mx-auto rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  isToday
                    ? "gradient-primary text-white shadow-glow-primary scale-110"
                    : isPast && currentStreak > weekDays.length - i
                      ? "bg-primary-500/20 text-primary-400"
                      : "bg-surface-100 dark:bg-surface-800 text-surface-400"
                }`}
              >
                {isToday ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                  </svg>
                ) : isPast && currentStreak > weekDays.length - i ? (
                  <svg
                    width="12"
                    height="12"
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
                    ? "text-primary-400 font-bold"
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
