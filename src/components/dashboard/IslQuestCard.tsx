"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadGame, getLevelProgress } from "@/lib/game-storage";

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
      ? showData.islBadges.length
      : showData.badges.length
    : 0;

  return (
    <div className="glass border-accent/15 p-5 animate-slide-down">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center shadow-glow-accent">
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
            <h3 className="font-bold text-surface-900 dark:text-white text-sm">
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <div className="bg-surface-100 dark:bg-surface-800/50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">
            {displayLevel}
          </p>
          <p className="text-[10px] text-surface-500">Level</p>
        </div>
        <div className="bg-surface-100 dark:bg-surface-800/50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">
            {displayXp}
          </p>
          <p className="text-[10px] text-surface-500">XP</p>
        </div>
        <div className="bg-surface-100 dark:bg-surface-800/50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">
            {displayStreak}
          </p>
          <p className="text-[10px] text-surface-500">Streak</p>
        </div>
        <div className="bg-surface-100 dark:bg-surface-800/50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">
            {displayBadges}
          </p>
          <p className="text-[10px] text-surface-500">Badges</p>
        </div>
      </div>

      {progress && (
        <div className="mb-3">
          <div className="bg-surface-100 dark:bg-surface-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full gradient-accent rounded-full transition-all"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <p className="text-[10px] text-surface-500 mt-1">
            {progress.current} / {progress.next} XP to level{" "}
            {gameData ? gameData.level + 1 : "?"}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={syncProgress}
          disabled={syncing}
          className="btn-ghost text-xs"
        >
          {syncing ? (
            "Saving..."
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
