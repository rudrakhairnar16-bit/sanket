"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadGame, getLevelProgress } from "@/lib/game-storage";

const BADGE_META: Record<string, { emoji: string; label: string }> = {
  "level-5": { emoji: "⭐", label: "Level 5" },
  "level-10": { emoji: "🌟", label: "Level 10" },
  "level-20": { emoji: "💫", label: "Level 20" },
  "streak-3": { emoji: "🔥", label: "3-Day Streak" },
  "streak-7": { emoji: "⚡", label: "7-Day Streak" },
  "streak-30": { emoji: "🏆", label: "30-Day Streak" },
  "first-sign": { emoji: "🤟", label: "First Sign" },
  "all-signs": { emoji: "🎓", label: "All Signs" },
  "perfect-quiz": { emoji: "🎯", label: "Perfect Quiz" },
  "webcam-pro": { emoji: "📸", label: "Webcam Pro" },
};

function StatBox({
  label,
  value,
  icon,
  grad,
  glow,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  grad: string;
  glow: string;
}) {
  return (
    <div className="rounded-xl p-2.5 text-center bg-gradient-to-br border border-surface-200/50 dark:border-surface-700/40 transition-all duration-200 hover:-translate-y-0.5">
      <div className={`w-8 h-8 mx-auto mb-1 rounded-lg ${grad} flex items-center justify-center ${glow}`}>
        {icon}
      </div>
      <p className="text-lg font-bold font-display text-surface-900 dark:text-white leading-none">
        {value}
      </p>
      <p className="text-[10px] text-surface-500 mt-0.5">{label}</p>
    </div>
  );
}

export function IslQuestCard() {
  const [gameData, setGameData] = useState<
    ReturnType<typeof loadGame> | null
  >(null);
  const [serverData, setServerData] = useState<{
    islXp: number;
    islLevel: number;
    islStreak: number;
    islBadges: string[];
  } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  useEffect(() => {
    setGameData(loadGame());
    fetch("/api/game-sync")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setServerData(data))
      .catch((e) => console.error("Game sync fetch failed:", e));
  }, []);

  const localGame = gameData && gameData.xp > 0 ? gameData : null;
  const progress = localGame ? getLevelProgress(localGame.xp) : null;

  async function syncProgress() {
    const game = loadGame();
    if (!game || game.xp === 0) {
      setSyncMsg("Play ISL Quest first to have progress to save!");
      setTimeout(() => setSyncMsg(""), 3000);
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch("/api/game-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xp: game.xp,
          level: game.level,
          streak: game.streak,
          badges: game.badges,
          completedSigns: game.completedSigns,
        }),
      });
      if (res.ok) {
        setSyncMsg("Progress saved!");
        setServerData({
          islXp: game.xp,
          islLevel: game.level,
          islStreak: game.streak,
          islBadges: game.badges,
        });
      } else {
        setSyncMsg("Failed to save. Try again.");
      }
    } catch {
      setSyncMsg("Failed to save. Check connection.");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(""), 3000);
    }
  }

  const showData = serverData || localGame;
  const displayXp = showData
    ? "islXp" in showData
      ? showData.islXp
      : showData.xp
    : 0;
  const displayLevel = showData
    ? "islLevel" in showData
      ? showData.islLevel
      : showData.level
    : 1;
  const displayStreak = showData
    ? "islStreak" in showData
      ? showData.islStreak
      : showData.streak
    : 0;
  const displayBadges = showData
    ? "islBadges" in showData
      ? showData.islBadges
      : showData.badges
    : [];

  const iconProps = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "white",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <div className="rounded-card bg-white dark:bg-surface-900/80 border border-accent-500/15 p-5 shadow-card animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="6" y1="11" x2="10" y2="11" />
              <line x1="8" y1="9" x2="8" y2="13" />
              <line x1="15" y1="12" x2="15.01" y2="12" />
              <line x1="18" y1="10" x2="18.01" y2="10" />
              <path d="M17.32 5H6.68a4 4 0 00-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 003 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 019.828 16h4.344a2 2 0 011.414.586L17 18c.5.5 1 1 2 1a3 3 0 003-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0017.32 5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-bold text-surface-900 dark:text-white text-sm">
              ISL Quest
            </h3>
            <p className="text-[10px] text-surface-500">
              Your gamified ISL learning journey
            </p>
          </div>
        </div>
        <Link href="/learn" className="btn-accent text-xs">
          Play Now
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <StatBox
          label="Level"
          value={displayLevel}
          grad="gradient-primary"
          glow="shadow-glow-primary"
          icon={<svg {...iconProps}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" /></svg>}
        />
        <StatBox
          label="XP"
          value={displayXp}
          grad="gradient-accent"
          glow="shadow-glow-accent"
          icon={<svg {...iconProps}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>}
        />
        <StatBox
          label="Streak"
          value={displayStreak}
          grad="from-orange-500 to-red-500"
          glow="shadow-glow-danger"
          icon={<svg {...iconProps}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" /></svg>}
        />
        <StatBox
          label="Badges"
          value={displayBadges.length}
          grad="from-violet-500 to-purple-600"
          glow="shadow-glow-primary"
          icon={<svg {...iconProps}><path d="M6 9a6 6 0 1112 0 6 6 0 01-12 0zM6 9v9a1 1 0 001 1h10a1 1 0 001-1V9" /></svg>}
        />
      </div>

      {displayBadges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {displayBadges.slice(0, 6).map((badge) => {
            const meta = BADGE_META[badge];
            if (!meta) return null;
            return (
              <span
                key={badge}
                title={meta.label}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-accent-500/10 border border-accent-500/20 text-[10px] font-medium text-accent-600 dark:text-accent-400"
              >
                <span>{meta.emoji}</span>
                <span className="hidden sm:inline">{meta.label}</span>
              </span>
            );
          })}
        </div>
      )}

      {progress && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-surface-500">
              {progress.current} / {progress.next} XP to level {gameData ? gameData.level + 1 : "?"}
            </span>
            <span className="text-[10px] font-bold text-accent-600 dark:text-accent-400 tabular-nums">
              {progress.progress}%
            </span>
          </div>
          <div className="bg-surface-100 dark:bg-surface-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full gradient-accent rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={syncProgress}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-btn border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all disabled:opacity-60"
        >
          {syncing ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Progress
            </span>
          )}
        </button>
        {syncMsg && (
          <span className="text-[10px] text-surface-500 animate-fade-in">
            {syncMsg}
          </span>
        )}
      </div>
    </div>
  );
}