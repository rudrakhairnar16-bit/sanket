"use client";

import { type GameState } from "@/lib/game-storage";
import { t } from "@/lib/hi";

export function LeaderboardScreen({ game, onBack }: { game: GameState; onBack: () => void }) {
  const allPlayers = [
    { name: "You", xp: game.xp, level: game.level, streak: game.streak },
    { name: "Aisha Sharma", xp: 2450, level: 12, streak: 8 },
    { name: "Rahul Verma", xp: 1820, level: 9, streak: 5 },
    { name: "Priya Patel", xp: 1560, level: 8, streak: 6 },
    { name: "Vikram Singh", xp: 980, level: 5, streak: 3 },
    { name: "Sneha Reddy", xp: 720, level: 4, streak: 2 },
    { name: "Arun Kumar", xp: 450, level: 3, streak: 1 },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="btn-ghost text-xs">← {t("Back")}</button>
        <h2 className="font-bold text-surface-900 dark:text-white text-sm">{t("Leaderboard")}</h2>
      </div>

      <div className="surface-card divide-y divide-surface-100 dark:divide-surface-800" role="list" aria-label={t("Leaderboard rankings")}>
        {allPlayers.map((p, i) => (
          <div key={p.name} className={`flex items-center gap-3 p-3.5 ${p.name === "You" ? "bg-primary-500/5" : ""}`} role="listitem" aria-label={`Rank ${i + 1}: ${p.name}, Level ${p.level}, ${p.xp} XP, ${p.streak} day streak`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
              i === 0 ? "bg-accent/20 text-accent-400" : i === 1 ? "bg-surface-200 dark:bg-surface-700 text-surface-500" : i === 2 ? "bg-accent/10 text-accent-500" : "bg-surface-100 dark:bg-surface-800 text-surface-400"
            }`} aria-hidden="true">{i + 1}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-surface-900 dark:text-white truncate">{p.name}</p>
              <p className="text-[10px] text-surface-500">Level {p.level} • {p.streak}d streak</p>
            </div>
            <p className="font-bold text-surface-900 dark:text-white text-sm" aria-label={`${p.xp} experience points`}>{p.xp} XP</p>
          </div>
        ))}
      </div>
    </div>
  );
}
