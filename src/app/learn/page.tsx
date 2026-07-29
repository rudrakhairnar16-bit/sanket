"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/isl-data";
import {
  loadGame,
  saveGame,
  getLevelProgress,
  getAccuracy,
  BADGES,
  type GameState,
} from "@/lib/game-storage";
import { setLang, loadLang, t } from "@/lib/hi";
import { playLevelUp } from "@/lib/sound";
import { FlashcardScreen } from "@/components/FlashcardScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { PracticeScreen } from "@/components/PracticeScreen";
import { DictionaryScreen } from "@/components/DictionaryScreen";
import { LeaderboardScreen } from "@/components/LeaderboardScreen";
import { BadgesScreen } from "@/components/BadgesScreen";

type Screen = "home" | "flashcards" | "quiz" | "practice" | "badges" | "dictionary" | "leaderboard";

export default function LearnPage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [game, setGame] = useState<GameState | null>(null);
  const [animateIn, setAnimateIn] = useState("animate-fade-in");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    setGame(saved);
    setLang(loadLang());
    if (saved.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    fetch("/api/auth/me")
      .then((r) => {
        if (r.ok) {
          setIsLoggedIn(true);
          return fetch("/api/game-sync");
        }
        return null;
      })
      .then((res) => res?.json())
      .then((server) => {
        if (server && server.islXp > saved.xp) {
          const merged = {
            ...saved,
            xp: server.islXp,
            level: server.islLevel || saved.level,
            streak: Math.max(server.islStreak, saved.streak),
            badges: Array.from(new Set([...saved.badges, ...(server.islBadges || [])])),
          };
          saveGame(merged);
          setGame(merged);
        }
      })
      .catch(() => {});
  }, []);

  function syncToServer(state: GameState) {
    if (!isLoggedIn) return;
    fetch("/api/game-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        badges: state.badges,
        completedSigns: state.completedSigns,
      }),
    }).catch(() => {});
  }

  function transitionTo(newScreen: Screen) {
    setAnimateIn("animate-fade-in");
    setScreen(newScreen);
  }

  function updateGame(updater: (prev: GameState) => GameState) {
    setGame((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveGame(next);
      syncToServer(next);
      return next;
    });
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  const progress = getLevelProgress(game.xp);
  const accuracy = getAccuracy(game);

  return (
    <div>
      {screen === "home" && (
        <HomeScreen
          game={game}
          progress={progress}
          accuracy={accuracy}
          onNavigate={transitionTo}
          animateIn={animateIn}
        />
      )}
      {screen === "flashcards" && (
        <FlashcardScreen
          game={game}
          onUpdate={updateGame}
          onBack={() => transitionTo("home")}
        />
      )}
      {screen === "quiz" && (
        <QuizScreen
          game={game}
          onUpdate={updateGame}
          onBack={() => transitionTo("home")}
        />
      )}
      {screen === "practice" && (
        <PracticeScreen
          game={game}
          onUpdate={updateGame}
          onBack={() => transitionTo("home")}
        />
      )}
      {screen === "badges" && (
        <BadgesScreen
          game={game}
          onBack={() => transitionTo("home")}
        />
      )}
      {screen === "dictionary" && (
        <DictionaryScreen onBack={() => transitionTo("home")} />
      )}
      {screen === "leaderboard" && (
        <LeaderboardScreen game={game} onBack={() => transitionTo("home")} />
      )}
    </div>
  );
}

function HomeScreen({
  game,
  progress,
  accuracy,
  onNavigate,
  animateIn,
}: {
  game: GameState;
  progress: { current: number; next: number; progress: number };
  accuracy: number;
  onNavigate: (screen: Screen) => void;
  animateIn: string;
}) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const [lang, setLangState] = useState<"en" | "hi" | "mr">("en");

  useEffect(() => {
    setLangState(loadLang());
  }, []);

  function toggleLang() {
    const next = lang === "en" ? "hi" : lang === "hi" ? "mr" : "en";
    setLangState(next);
    setLang(next);
  }

  function toggleDark() {
    const isDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark");
    const updated = { ...game, darkMode: isDark };
    saveGame(updated);
    onNavigate("home");
  }

  return (
    <div className={`max-w-2xl mx-auto px-4 py-6 ${animateIn}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-xs text-surface-400 hover:text-surface-300 transition-all"
            aria-label={t("Login")}
          >
            ← {t("Login")}
          </Link>
          <button
            onClick={toggleLang}
            className="btn-ghost text-[10px] px-2 py-0.5"
            aria-label={`Switch language to ${lang === "en" ? "Hindi" : lang === "hi" ? "Marathi" : "English"}`}
          >
            {lang === "en" ? "हिंदी" : lang === "hi" ? "मराठी" : "EN"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="btn-ghost text-[10px] px-2 py-0.5"
            aria-label={game.darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {game.darkMode ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            )}
          </button>
          <Link
            href="/dashboard"
            className="text-xs text-surface-400 hover:text-surface-300 transition-all"
          >
            {t("Clerk Dashboard")} →
          </Link>
        </div>
      </div>

      <div className="surface-card p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] text-primary-400 uppercase tracking-wider">ISL Quest</p>
            <h1 className="text-xl font-bold text-surface-900 dark:text-white mt-0.5">
              Learn Indian Sign Language
            </h1>
            <p className="text-xs text-surface-500 mt-0.5">{today}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-400">Lv.{game.level}</div>
            <p className="text-[10px] text-surface-500">{game.xp} XP</p>
          </div>
        </div>

        <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-surface-500 font-medium">
              Level {game.level} → {game.level + 1}
            </span>
            <span className="text-[10px] text-surface-500">
              {progress.current} / {progress.next} XP
            </span>
          </div>
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress.progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <StatBox value={game.streak} label="Day Streak" />
          <StatBox value={`${accuracy}%`} label="Accuracy" />
          <StatBox value={game.badges.length} label="Badges" />
          <StatBox value={game.completedSigns.length} label="Learned" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5" role="group" aria-label={t("Learning modes")}>
        <ModeCard
          title="Flashcards"
          description="Flip cards to learn signs and their meanings"
          color="from-primary-600 to-primary-800"
          onClick={() => onNavigate("flashcards")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </ModeCard>
        <ModeCard
          title="Quiz Challenge"
          description="Test your knowledge with quick quizzes"
          color="from-emerald-600 to-teal-700"
          onClick={() => onNavigate("quiz")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </ModeCard>
        <ModeCard
          title="Webcam Practice"
          description="Use your camera to practice real signs"
          color="from-orange-600 to-orange-800"
          onClick={() => onNavigate("practice")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </ModeCard>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => onNavigate("dictionary")}
            className="surface-card p-3.5 text-center hover:shadow-btn transition-all flex items-center justify-center gap-2"
            aria-label={t("ISL Dictionary") || "ISL Dictionary"}
          >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
            {t("ISL Dictionary") || "ISL Dictionary"}
          </span>
        </button>
        <button
          onClick={() => onNavigate("leaderboard")}
          className="surface-card p-3.5 text-center hover:shadow-btn transition-all flex items-center justify-center gap-2"
          aria-label={t("Leaderboard")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>
          <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
            {t("Leaderboard")}
          </span>
        </button>
      </div>

      <Link
        href="/curriculum"
        className="flex items-center gap-3 surface-card p-3.5 mb-1.5 hover:shadow-btn transition-all group"
        aria-label="12-Week ISL Curriculum"
      >
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-glow-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-surface-900 dark:text-white text-xs group-hover:text-primary-400 transition-colors">
            12-Week ISL Curriculum
          </p>
          <p className="text-[10px] text-surface-500">
            Structured learning path for public servants
          </p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-400"><polyline points="9 18 15 12 9 6"/></svg>
      </Link>
      <Link
        href="/roadmap"
        className="flex items-center gap-3 surface-card p-3.5 mb-1.5 hover:shadow-btn transition-all group"
      >
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-glow-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-surface-900 dark:text-white text-xs group-hover:text-primary-400 transition-colors">
            Scalability Roadmap
          </p>
          <p className="text-[10px] text-surface-500">
            Pilot → City → State → National rollout plan
          </p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-400"><polyline points="9 18 15 12 9 6"/></svg>
      </Link>
      <Link
        href="/policy"
        className="flex items-center gap-3 surface-card p-3.5 mb-1.5 hover:shadow-btn transition-all group"
      >
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-glow-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-surface-900 dark:text-white text-xs group-hover:text-primary-400 transition-colors">
            Policy Whitepaper
          </p>
          <p className="text-[10px] text-surface-500">
            Municipal adoption blueprint aligned with RPwD Act 2016
          </p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-400"><polyline points="9 18 15 12 9 6"/></svg>
      </Link>
      <Link
        href="/interpreter"
        className="flex items-center gap-3 surface-card p-3.5 mb-3 hover:shadow-btn transition-all group border border-primary-500/20"
      >
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-glow-primary animate-pulse">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-surface-900 dark:text-white text-xs group-hover:text-primary-400 transition-colors">
            Live ISL Interpreter
          </p>
          <p className="text-[10px] text-surface-500">
            Real-time sign-to-text &amp; two-way communication
          </p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-400"><polyline points="9 18 15 12 9 6"/></svg>
      </Link>

        <button
          onClick={() => onNavigate("badges")}
          className="w-full surface-card p-3.5 text-center hover:shadow-btn transition-all flex items-center justify-center gap-2"
          aria-label={`${t("View All Badges")} (${game.badges.length}/${BADGES.length})`}
        >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
        <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
          {t("View All Badges")} ({game.badges.length}/{BADGES.length})
        </span>
      </button>

      <div className="mt-4 p-3 rounded-xl text-center bg-surface-50 dark:bg-surface-800/50">
        <p className="text-[10px] text-surface-500">
          Content sourced from ISLRTC, Ministry of Social Justice & Empowerment, Govt. of India
        </p>
      </div>
    </div>
  );
}

function StatBox({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-2.5 text-center">
      <p className="text-base font-bold text-surface-900 dark:text-white">{value}</p>
      <p className="text-[10px] text-surface-500">{t(label) || label}</p>
    </div>
  );
}

function ModeCard({
  title,
  description,
  color,
  onClick,
  children,
}: {
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl p-5 text-white text-left hover:shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />
      <div className="relative">
        <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center mb-3">
          {children}
        </div>
        <h3 className="text-sm font-bold mb-0.5">{t(title) || title}</h3>
        <p className="text-xs text-white/70">{t(description) || description}</p>
      </div>
    </button>
  );
}




