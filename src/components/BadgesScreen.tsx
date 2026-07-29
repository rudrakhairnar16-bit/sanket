"use client";

import { BADGES, type GameState } from "@/lib/game-storage";
import { t } from "@/lib/hi";

export function BadgesScreen({ game, onBack }: { game: GameState; onBack: () => void }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="btn-ghost text-xs mb-5">← {t("Back")}</button>
      <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">{t("Achievements")}</h2>
      <p className="text-surface-500 text-xs mb-5">{game.badges.length} / {BADGES.length} {t("unlocked")}</p>
      <div className="grid grid-cols-2 gap-3" role="list" aria-label={t("Achievements list")}>
        {BADGES.map((badge) => {
          const unlocked = game.badges.includes(badge.id);
          return (
            <div key={badge.id} className={`surface-card p-4 text-center ${unlocked ? "border-accent/20" : "opacity-40"}`} role="listitem" aria-label={`${badge.name}: ${badge.requirement}${unlocked ? " - " + t("Unlocked") : ""}`}>
              <span className="text-3xl block mb-1" role="img" aria-label={badge.name}>{badge.icon}</span>
              <p className={`font-medium text-xs ${unlocked ? "text-surface-900 dark:text-white" : "text-surface-500"}`}>{badge.name}</p>
              <p className="text-[10px] text-surface-500">{badge.requirement}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
