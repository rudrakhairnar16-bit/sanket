"use client";

interface LeaderboardEntry {
  _id: string;
  name: string;
  username: string;
  department: string;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  isChampion?: boolean;
}

export function LeaderboardTable({
  leaderboard,
  onRefresh,
}: {
  leaderboard: LeaderboardEntry[];
  onRefresh: () => void;
}) {
  return (
    <div className="surface-card p-5">
      <h3 className="font-semibold text-surface-900 dark:text-white text-sm mb-4">
        Top Performing Clerks
      </h3>
      <div className="space-y-2">
        {leaderboard && leaderboard.length > 0 ? (
          leaderboard.map((clerk, i) => (
            <div
              key={clerk._id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  i === 0
                    ? "bg-accent/20 text-accent-400"
                    : i === 1
                      ? "bg-surface-200 dark:bg-surface-700 text-surface-500"
                      : i === 2
                        ? "bg-accent/10 text-accent-500"
                        : "bg-surface-100 dark:bg-surface-800 text-surface-400"
                }`}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-surface-900 dark:text-white text-sm truncate">
                  {clerk.name}
                  {clerk.isChampion && (
                    <span className="ml-1 text-xs" title="ISL Champion">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 22h14l-7-20-7 20z" />
                      </svg>
                    </span>
                  )}
                </p>
                <p className="text-[10px] text-surface-500 truncate">
                  {clerk.department}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `/api/users/${clerk.username}/champion`,
                        { method: "PATCH" },
                      );
                      if (res.ok) onRefresh();
                    } catch {}
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 ${
                    clerk.isChampion
                      ? "bg-accent/20 text-accent-400"
                      : "bg-surface-100 dark:bg-surface-800 text-surface-500 hover:bg-accent/10"
                  }`}
                  title={
                    clerk.isChampion
                      ? "Remove Champion"
                      : "Designate Champion"
                  }
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {clerk.isChampion ? (
                      <path d="M5 22h14l-7-20-7 20z" />
                    ) : (
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    )}
                  </svg>
                  Champion
                </button>
                <div className="text-right">
                  <p className="font-bold text-surface-900 dark:text-white text-sm">
                    {clerk.currentStreak}
                  </p>
                  <p className="text-[10px] text-surface-500">day streak</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-surface-500 text-center py-8 text-sm">No data</p>
        )}
      </div>
    </div>
  );
}
