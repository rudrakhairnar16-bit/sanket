"use client";

export function StreakBadge({ streak }: { streak: number }) {
  const icon = (() => {
    if (streak >= 30) return <path d="M5 22h14l-7-20-7 20z" />;
    if (streak >= 14)
      return (
        <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
      );
    if (streak >= 7)
      return (
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      );
    if (streak >= 3) return <path d="M18 20V10M12 20V4M6 20v-6" />;
    return (
      <path d="M12 22c-1.5 0-3-.5-4-2-1 0-2-.5-2.5-1.5-.5 0-1-.5-1-1.5s.5-1.5 1-2c0-.5 0-1-.5-1.5-.5-.5-1-1-1.5-1.5-.5-.5-1-1-1-1.5s.5-1 1-1.5c.5-.5 1-1 1.5-1.5.5-.5.5-1 .5-1.5 0-.5.5-1 1-1s1 .5 1 1c0 .5.5 1 1 1.5.5.5 1 1 1.5 1.5.5.5 1 .5 1.5.5.5 0 1-.5 1-1 0-.5.5-1 1-1s1 .5 1 1c0 .5.5 1 1 1.5.5.5 1 1 1 1.5s-.5 1-1 1.5c-.5.5-1 1-1.5 1.5-.5.5-.5 1-.5 1.5 0 .5.5 1 1 1.5.5.5 1 1 1 1.5s-.5 1-1 1c-.5 0-1 .5-1.5 1.5-.5 1-1.5 1.5-3 2-1 1.5-2.5 2-4 2z" />
    );
  })();

  return (
    <div className="flex items-center gap-2.5 glass border-accent/20 rounded-xl px-4 py-2">
      <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      </div>
      <div>
        <p className="text-lg font-bold text-accent-300">{streak}</p>
        <p className="text-[10px] text-accent-500">day streak</p>
      </div>
    </div>
  );
}
