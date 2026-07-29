"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ALL_SIGNS,
  CATEGORIES,
  WEBCAM_SIGNS,
  getSignsByCategory,
  getQuizForCategory,
  type ISLSign,
} from "@/lib/isl-data";
import {
  loadGame,
  saveGame,
  addXP,
  updateStreak,
  completeSign,
  recordAnswer,
  checkPerfectQuiz,
  checkWebcamMilestone,
  getLevelProgress,
  getAccuracy,
  BADGES,
  type GameState,
} from "@/lib/game-storage";
import { setLang, loadLang, t } from "@/lib/hi";
import { playCorrect, playIncorrect, playLevelUp } from "@/lib/sound";
import { classifier, type Landmark } from "@/lib/knn-classifier";

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
          >
            ← {t("Login")}
          </Link>
          <button
            onClick={toggleLang}
            className="btn-ghost text-[10px] px-2 py-0.5"
          >
            {lang === "en" ? "हिंदी" : lang === "hi" ? "मराठी" : "EN"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="btn-ghost text-[10px] px-2 py-0.5"
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
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
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
            {t("ISL Dictionary") || "ISL Dictionary"}
          </span>
        </button>
        <button
          onClick={() => onNavigate("leaderboard")}
          className="surface-card p-3.5 text-center hover:shadow-btn transition-all flex items-center justify-center gap-2"
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

function FlashcardScreen({
  game,
  onUpdate,
  onBack,
}: {
  game: GameState;
  onUpdate: (updater: (prev: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [signIndex, setSignIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  const category = CATEGORIES[categoryIndex];
  const signs = getSignsByCategory(category.id);
  const currentSign = signs[signIndex];

  function markKnown() {
    if (!currentSign) return;
    onUpdate((prev) => {
      let state = addXP(prev, 15);
      state = completeSign(state, currentSign.id);
      state = recordAnswer(state, true);
      return state;
    });
    setKnownCount((c) => c + 1);

    setTimeout(() => {
      if (signIndex + 1 < signs.length) {
        setSignIndex((i) => i + 1);
        setFlipped(false);
      } else if (categoryIndex + 1 < CATEGORIES.length) {
        setCategoryIndex((i) => i + 1);
        setSignIndex(0);
        setFlipped(false);
      } else {
        onUpdate((prev) => {
          let state = addXP(prev, 50);
          state = updateStreak(state);
          return state;
        });
        onBack();
      }
    }, 400);
  }

  function skipSign() {
    if (signIndex + 1 < signs.length) {
      setSignIndex((i) => i + 1);
      setFlipped(false);
    } else if (categoryIndex + 1 < CATEGORIES.length) {
      setCategoryIndex((i) => i + 1);
      setSignIndex(0);
      setFlipped(false);
    } else {
      onBack();
    }
  }

  const allDone =
    signIndex + 1 > signs.length &&
    categoryIndex + 1 >= CATEGORIES.length;

  if (!currentSign || allDone) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
        <div className="surface-card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
            {t("All Categories Done!")}
          </h2>
          <p className="text-surface-500 text-sm mb-5">
            {t("You reviewed")} {knownCount} {t("signs. Keep practicing daily!")}
          </p>
          <button
            onClick={onBack}
            className="btn-primary"
          >
            {t("Back to Home")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="btn-ghost text-xs"
        >
          ← {t("Exit")}
        </button>
        <span className="text-[10px] text-surface-500">
          {t(category.name)} • {signIndex + 1}/{signs.length}
        </span>
      </div>

      <div
        className="cursor-pointer perspective-[1000px] mb-5"
        onClick={() => setFlipped(!flipped)}
        style={{ perspective: "1000px" }}
      >
        <div
          className={`relative w-full transition-transform duration-500`}
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "300px",
          }}
        >
          <div
            className="absolute inset-0 surface-card p-6 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-6xl mb-3">{currentSign.icon}</span>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
              {currentSign.name}
            </h2>
            <p className="text-surface-500 text-xs">{t("Tap to reveal meaning")}</p>
          </div>

          <div
            className="surface-card p-6 flex flex-col items-center justify-center text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              minHeight: "300px",
            }}
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/20 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <h2 className="text-xl font-bold text-accent-300 mb-1">
              {currentSign.meaning}
            </h2>
            {currentSign.hint && (
              <p className="text-surface-500 text-xs mt-1">
                {currentSign.hint}
              </p>
            )}
            {currentSign.webcamSupported && (
              <span className="mt-2 px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 text-[10px] rounded-lg font-medium">
                {t("Webcam practice available")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={skipSign}
          className="btn-secondary flex-1 text-xs"
        >
          {t("Skip")}
        </button>
        <button
          onClick={markKnown}
          className="btn-primary flex-1 text-xs"
        >
          ✓ {t("I Know This")}
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1">
        {signs.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === signIndex
                ? "bg-primary-500 w-3"
                : i < signIndex
                ? "bg-emerald-500"
                : "bg-surface-300 dark:bg-surface-700"
            }`}
          />
        ))}
      </div>

      <p className="text-[10px] text-surface-500 text-center mt-3">
        +15 XP per sign • Tap card to flip
      </p>
    </div>
  );
}

function QuizScreen({
  game,
  onUpdate,
  onBack,
}: {
  game: GameState;
  onUpdate: (updater: (prev: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const lastAnswerRef = useRef<boolean | null>(null);

  const category = CATEGORIES[categoryIndex];
  const quizData = getQuizForCategory(category.id);
  const q = quizData[questionIndex];
  const isCorrect = selected === q?.sign.meaning;

  function handleAnswer(option: string) {
    if (selected) return;
    setSelected(option);
    const correct = option === q.sign.meaning;
    lastAnswerRef.current = correct;
    if (correct) {
      setCorrectCount((c) => c + 1);
      playCorrect();
    } else {
      playIncorrect();
    }
  }

  function nextQuestion() {
    const correct = lastAnswerRef.current === true;

    onUpdate((prev) => {
      let state = recordAnswer(prev, correct);
      state = addXP(state, correct ? 20 : 5);
      state = completeSign(state, q.sign.id);
      return state;
    });

    if (correct) setScore((s) => s + 20);

    setSelected(null);
    lastAnswerRef.current = null;

    if (questionIndex + 1 >= quizData.length) {
      if (categoryIndex + 1 < CATEGORIES.length) {
        setCategoryIndex((i) => i + 1);
        setQuestionIndex(0);
      } else {
        const pct = ((correctCount + (correct ? 1 : 0)) / quizData.length) * 100;
        if (pct === 100) {
          onUpdate((prev) => checkPerfectQuiz(prev));
        }
        onUpdate((prev) => {
          let state = addXP(prev, 30);
          state = updateStreak(state);
          return state;
        });
        setShowResult(true);
        setFinished(true);
      }
    } else {
      setQuestionIndex((i) => i + 1);
    }
  }

  if (finished) {
    const total = ALL_SIGNS.length;
    const pct = Math.round((correctCount / total) * 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
        <div className="surface-card p-8 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-glow ${
            pct >= 80 ? "gradient-primary" : pct >= 50 ? "gradient-accent" : "bg-surface-100 dark:bg-surface-800"
          }`}>
            {pct >= 80 ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : pct >= 50 ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-500"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
            )}
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
            {t(pct >= 80 ? "Outstanding!" : pct >= 50 ? "Good Effort!" : "Keep Practicing!")}
          </h2>
          <p className="text-surface-500 text-sm mb-4">
            {t("You scored")} {correctCount}/{total} {t("across")} {CATEGORIES.length} {t("categories")}
          </p>
          <p className="text-2xl font-bold text-primary-400 mb-2">
            {pct}% Accuracy
          </p>
          <p className="text-xs text-surface-500 mb-5">+{score} XP earned</p>
          <button
            onClick={onBack}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in text-center">
        <p className="text-surface-500 text-sm mb-3">Not enough signs in this category.</p>
        <button onClick={onBack} className="btn-ghost text-xs">
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="btn-ghost text-xs"
        >
          ← {t("Exit")}
        </button>
        <span className="text-[10px] text-surface-500">
          {t(category.name)} • Q{questionIndex + 1}/{quizData.length}
        </span>
      </div>

      <div className="surface-card p-5 mb-3">
        <div className="text-center mb-5">
          <span className="text-5xl block mb-2">{q.sign.icon}</span>
          <h2 className="text-base font-bold text-surface-900 dark:text-white">
            {t("What does this sign mean?")}
          </h2>
          <p className="text-xs text-surface-500 mt-0.5">
            {t("Sign")}: {q.sign.name}
          </p>
        </div>

        <div className="space-y-2">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={!!selected}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                selected === option
                  ? option === q.sign.meaning
                    ? "border-emerald-500 bg-emerald-500/10 shadow-glow"
                    : "border-red-500 bg-red-500/10"
                  : selected
                  ? option === q.sign.meaning
                    ? "border-emerald-400 bg-emerald-500/5"
                    : "border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 opacity-50"
                  : "border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 hover:border-surface-300 dark:hover:border-surface-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    selected === option
                      ? option === q.sign.meaning
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-surface-200 dark:bg-surface-700 text-surface-500"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-medium text-sm text-surface-700 dark:text-surface-300">{option}</span>
                {selected && option === q.sign.meaning && (
                  <span className="ml-auto text-emerald-400 text-xs font-medium">✓</span>
                )}
                {selected === option && option !== q.sign.meaning && (
                  <span className="ml-auto text-red-400 text-xs font-medium">✗</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="animate-slide-up space-y-3">
          <div
            className={`rounded-xl p-3.5 text-center ${
              isCorrect
                ? "glass border-emerald-500/20"
                : "glass border-red-500/20"
            }`}
          >
            <p className={`font-medium text-sm ${
              isCorrect ? "text-emerald-400" : "text-red-400"
            }`}>
              {isCorrect
                ? "✓ " + t("Correct") + "! +20 XP"
                : `✗ ${t("The answer was")}: ${q.sign.meaning}`}
            </p>
            <p className="text-[10px] text-surface-500 mt-0.5">{q.sign.hint}</p>
            {q.sign.webcamSupported && (
              <p className="text-[10px] text-emerald-400 mt-0.5">{t("Try with webcam!")}</p>
            )}
          </div>
          <button
            onClick={nextQuestion}
            className="btn-primary w-full text-sm"
          >
            {questionIndex + 1 >= quizData.length &&
            categoryIndex + 1 >= CATEGORIES.length
              ? t("See Final Results")
              : t("Next Question")}
          </button>
        </div>
      )}

      <div className="flex justify-center gap-1 mt-3">
        {quizData.slice(0, 5).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === questionIndex
                ? "bg-primary-500 w-3"
                : i < questionIndex
                ? "bg-emerald-500"
                : "bg-surface-300 dark:bg-surface-700"
            }`}
          />
        ))}
      </div>

      <p className="text-[10px] text-surface-500 text-center mt-2">
        Score: {score} XP • {correctCount}/{questionIndex + (selected ? 1 : 0)} correct
      </p>
    </div>
  );
}

function PracticeScreen({
  game,
  onUpdate,
  onBack,
}: {
  game: GameState;
  onUpdate: (updater: (prev: GameState) => GameState) => void;
  onBack: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "practicing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [handCount, setHandCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [practiceCount, setPracticeCount] = useState(0);
  const [selectedSign, setSelectedSign] = useState<string>(WEBCAM_SIGNS[0]);
  const [trainMode, setTrainMode] = useState(false);
  const [trainSignId, setTrainSignId] = useState<string | null>(null);
  const [trainCount, setTrainCount] = useState(0);
  const [hasSamples, setHasSamples] = useState(false);
  const [detectedName, setDetectedName] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const correctFrames = useRef(0);
  const totalFrames = useRef(0);
  const lastTimestamp = useRef(0);
  const trainBufferRef = useRef<Landmark[][]>([]);
  const trainActiveRef = useRef(false);
  const trainModeRef = useRef(false);
  const trainSignIdRef = useRef<string | null>(null);

  const webcamSignList = ALL_SIGNS.filter((s) => s.webcamSupported);

  useEffect(() => {
    const saved = localStorage.getItem("isl-webcam-count");
    if (saved) setPracticeCount(parseInt(saved, 10));
    const knn = localStorage.getItem("sanket-knn-samples");
    if (knn && knn.length > 20) {
      classifier.deserialize(knn);
      setHasSamples(classifier.getSignCount() > 0);
    } else {
      // Load baseline model if no user model exists
      fetch("/models/sanket-knn-baseline.json")
        .then((res) => res.text())
        .then((json) => {
          if (json && json.length > 2) {
            classifier.deserialize(json);
            localStorage.setItem("sanket-knn-samples", json);
            setHasSamples(classifier.getSignCount() > 0);
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    trainModeRef.current = trainMode;
    trainSignIdRef.current = trainSignId;
    if (!trainMode || !trainSignId) {
      trainActiveRef.current = false;
      trainBufferRef.current = [];
    }
  }, [trainMode, trainSignId]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  async function startCamera() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus("ready");
      setTimeout(() => startDetection(), 500);
    } catch (err) {
      setErrorMsg("Camera access denied. Please allow camera permissions.");
      setStatus("error");
    }
  }

  async function startDetection() {
    try {
      const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
      setStatus("practicing");
      lastTimestamp.current = 0;
      processFrame(landmarker);
    } catch {
      setErrorMsg("Failed to load AI model. Check your internet connection.");
      setStatus("error");
    }
  }

  function processFrame(landmarker: any) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(() => processFrame(landmarker));
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      animFrameRef.current = requestAnimationFrame(() => processFrame(landmarker));
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const now = performance.now();
    if (now - lastTimestamp.current > 100) {
      lastTimestamp.current = now;
      const result = landmarker.detectForVideo(video, now);

      if (result.landmarks && result.landmarks.length > 0) {
        setHandCount(result.landmarks.length);

        result.landmarks.forEach((hand: any, i: number) => {
          ctx.strokeStyle = i === 0 ? "#2563eb" : "#1e3a8a";
          ctx.lineWidth = 2;
          const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
            [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15],
            [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
          ];
          for (const [a, b] of connections) {
            ctx.beginPath();
            ctx.moveTo(hand[a].x * canvas.width, hand[a].y * canvas.height);
            ctx.lineTo(hand[b].x * canvas.width, hand[b].y * canvas.height);
            ctx.stroke();
          }
          ctx.fillStyle = i === 0 ? "#2563eb" : "#1e3a8a";
          for (const lm of hand) {
            ctx.beginPath();
            ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
            ctx.fill();
          }
        });

        if (trainModeRef.current && trainSignIdRef.current) {
          for (const hand of result.landmarks) {
            trainBufferRef.current.push(hand as Landmark[]);
          }
          if (!trainActiveRef.current && trainBufferRef.current.length > 0) {
            trainActiveRef.current = true;
            const captureId = trainSignIdRef.current;
            setTimeout(() => {
              if (trainBufferRef.current.length > 15) {
                classifier.addMultipleSamples(captureId, trainBufferRef.current);
                localStorage.setItem("sanket-knn-samples", classifier.serialize());
                setHasSamples(classifier.getSignCount() > 0);
                setTrainCount((c) => c + 1);
              }
              trainBufferRef.current = [];
              trainActiveRef.current = false;
            }, 1500);
          }
        } else if (hasSamples && classifier.getSampleCount() > 0) {
          let best = { signId: null as string | null, confidence: 0 };
          for (const hand of result.landmarks) {
            const r = classifier.classify(hand as Landmark[]);
            if (r.confidence > best.confidence) best = r;
          }
          if (best.signId) {
            const matched = ALL_SIGNS.find((s) => s.id === best.signId);
            setDetectedName(matched ? matched.name : null);
          } else {
            setDetectedName(null);
          }

          totalFrames.current += 1;
          if (best.signId === selectedSignId() && best.confidence > 0.6) {
            correctFrames.current += 1;
          } else if (totalFrames.current > 10) {
            correctFrames.current = Math.max(0, correctFrames.current - 1);
          }

          const acc = totalFrames.current > 0
            ? Math.round((correctFrames.current / totalFrames.current) * 100)
            : 0;
          setAccuracy(acc);
        } else {
          setAccuracy(0);
        }

        const acc = totalFrames.current > 0
          ? Math.round((correctFrames.current / totalFrames.current) * 100)
          : 0;

        if (acc > 60 && totalFrames.current > 20) {
          setStatus("success");
          const newCount = practiceCount + 1;
          setPracticeCount(newCount);
          localStorage.setItem("isl-webcam-count", String(newCount));

          onUpdate((prev) => {
            let state = addXP(prev, 50);
            state = updateStreak(state);
            state = checkWebcamMilestone(state, newCount);
            return state;
          });
          cancelAnimationFrame(animFrameRef.current);
          landmarker.close();
          return;
        }
      } else {
        setHandCount(0);
      }
    }

    animFrameRef.current = requestAnimationFrame(() => processFrame(landmarker));
  }

  function stopAll() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    cancelAnimationFrame(animFrameRef.current);
    correctFrames.current = 0;
    totalFrames.current = 0;
    trainBufferRef.current = [];
    trainActiveRef.current = false;
    setDetectedName(null);
    setAccuracy(0);
    setStatus("idle");
    setErrorMsg("");
  }

  const signInfo = ALL_SIGNS.find((s) => s.name === selectedSign);
  const selectedSignId = () => signInfo?.id ?? null;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => { stopAll(); onBack(); }}
          className="btn-ghost text-xs"
        >
          ← {t("Exit")}
        </button>
        {status !== "idle" && (
          <button
            onClick={stopAll}
            className="text-xs text-red-400 hover:text-red-300 transition-all"
          >
            {t("Restart")}
          </button>
        )}
      </div>

      <div className="surface-card p-5 mb-3">
        <div className="text-center mb-3">
          <h2 className="text-base font-bold text-surface-900 dark:text-white">{t("Webcam Practice")}</h2>
          <p className="text-xs text-surface-500">
            {t("Show the sign to your camera")}
          </p>
          <button
            onClick={() => { setTrainMode((v) => !v); setTrainSignId(null); }}
            className={`mt-2 btn-sm text-xs ${trainMode ? "btn-accent" : "btn-ghost"}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            {trainMode ? "Training ON" : "Train Model"}
          </button>
        </div>

        {trainMode && (
          <div className="mb-3 glass border-accent/20 p-4">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
              <p className="text-xs font-semibold text-accent-300">Train Sign Model</p>
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-accent/10 text-accent-400">
                {classifier.getSignCount()} signs • {trainCount} captures
              </span>
            </div>
            <p className="text-[10px] text-surface-500 mb-1">
              {trainSignId
                ? <>Capturing <strong className="text-accent-400">{ALL_SIGNS.find((s) => s.id === trainSignId)?.name}</strong> — hold the sign ~1.5s…</>
                : "Select a sign to train:"}
            </p>
            <p className="text-[10px] text-amber-400 mb-2">
              Need {classifier.getMinSamplesPerSign()}+ samples per sign before recognition works
            </p>
            <div className="flex flex-wrap gap-1.5">
              {webcamSignList.map((sign) => {
                const samplesPerSign = classifier.getSamplesPerSign();
                const count = samplesPerSign[sign.id] || 0;
                const minSamples = classifier.getMinSamplesPerSign();
                const progress = Math.min(count / minSamples, 1);
                const isReady = count >= minSamples;
                return (
                  <button
                    key={sign.id}
                    onClick={() => setTrainSignId(sign.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] transition-all border flex flex-col items-center gap-0.5 ${
                      trainSignId === sign.id
                        ? "bg-accent text-white border-accent"
                        : isReady
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800"
                    }`}
                  >
                    <span>{sign.icon} {sign.name}</span>
                    <div className="w-20 h-1 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${isReady ? "bg-emerald-500" : "bg-accent"}`} style={{ width: `${progress * 100}%` }} />
                    </div>
                    <span className="text-[8px]">{count}/{minSamples}</span>
                  </button>
                );
              })}
            </div>
            {trainCount > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button onClick={() => { const json = classifier.serialize(); const blob = new Blob([json], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "sanket-knn-model.json"; a.click(); URL.revokeObjectURL(url); }} className="btn-ghost text-[10px]">
                  Export Model
                </button>
                <label className="btn-ghost text-[10px] cursor-pointer">
                  Import Model
                  <input type="file" accept=".json" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => { try { classifier.deserialize(ev.target?.result as string); localStorage.setItem("sanket-knn-samples", classifier.serialize()); setHasSamples(classifier.getSignCount() > 0); setTrainCount(classifier.getSampleCount()); } catch { alert("Invalid model file"); } }; reader.readAsText(file); e.target.value = ""; }} />
                </label>
                <button onClick={() => { classifier.reset(); localStorage.removeItem("sanket-knn-samples"); setHasSamples(false); setTrainCount(0); setTrainSignId(null); }} className="text-[10px] px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                  Reset All
                </button>
              </div>
            )}
          </div>
        )}

        {status === "idle" && (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <p className="text-xs text-surface-500 mb-2">{t("Choose a sign to practice:")}</p>
            <select value={selectedSign} onChange={(e) => setSelectedSign(e.target.value)} className="input-field w-full mb-3">
              {WEBCAM_SIGNS.map((name) => (<option key={name} value={name}>{name}</option>))}
            </select>
            {signInfo && (
              <div className="mb-3 p-3 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <span className="text-2xl block mb-1">{signInfo.icon}</span>
                <p className="text-xs text-surface-600 dark:text-surface-400">{signInfo.hint}</p>
              </div>
            )}
            <button onClick={startCamera} className="btn-primary text-sm">{t("Start Camera")}</button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/></svg>
            </div>
            <p className="text-red-400 text-sm font-medium mb-2">{errorMsg}</p>
            <button onClick={startCamera} className="btn-primary text-sm">{t("Try Again")}</button>
          </div>
        )}

        {(status === "loading" || status === "ready" || status === "practicing") && (
          <div className="relative aspect-video bg-primary-900 rounded-xl overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full scale-x-[-1]" />
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary-900/80">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin mx-auto mb-2" />
                  <p className="text-white/70 text-xs">{t("Starting camera...")}</p>
                </div>
              </div>
            )}
            {status === "practicing" && (
              <div className="absolute top-2 left-2 right-2 flex justify-between">
                <span className="px-2 py-1 bg-black/50 text-white text-[10px] rounded-lg backdrop-blur-sm">{handCount > 0 ? `${handCount} hand${handCount > 1 ? "s" : ""}` : "No hand"}</span>
                <span className="px-2 py-1 bg-black/50 text-white text-[10px] rounded-lg backdrop-blur-sm">{selectedSign}</span>
              </div>
            )}
          </div>
        )}

        {status === "practicing" && (
          <div className="mt-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-1.5 overflow-hidden">
                <div className="h-full gradient-primary rounded-full transition-all duration-300" style={{ width: `${Math.min(accuracy, 100)}%` }} />
              </div>
              <span className="text-xs font-medium text-primary-400 w-10 text-right">{accuracy}%</span>
            </div>
            <p className="text-[10px] text-surface-500 mt-1.5 text-center">
              {trainMode ? "Training mode — samples are captured live" : signInfo?.hint}
            </p>
            {!trainMode && hasSamples && (
              <p className="text-[10px] text-center mt-1">
                <span className="text-surface-500">Detected: </span>
                <span className="font-semibold text-accent-400">{detectedName ?? "—"}</span>
              </p>
            )}
            {!trainMode && !hasSamples && (
              <p className="text-[10px] text-center text-amber-400 mt-1">No trained signs yet — tap "Train Model" to teach a sign.</p>
            )}
          </div>
        )}

        {status === "success" && (
          <div className="mt-3 glass border-emerald-500/20 p-5 text-center animate-scale-in">
            <div className="w-14 h-14 mx-auto mb-2 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p className="text-surface-900 dark:text-white font-bold text-sm mb-0.5">{t("Sign Recognized!")}</p>
            <p className="text-surface-500 text-xs mb-3">{t("You signed")} {selectedSign} {t("correctly!")} +50 XP</p>
            <div className="flex gap-2 justify-center">
              <button onClick={stopAll} className="btn-primary text-xs">{t("Practice Again")}</button>
              <button onClick={() => { stopAll(); onBack(); }} className="btn-secondary text-xs">{t("Done")}</button>
            </div>
          </div>
        )}
      </div>

      <p className="text-[10px] text-surface-500 text-center">
        {t("Practice count")}: {practiceCount} • +50 XP {t("per successful practice")}
      </p>
    </div>
  );
}

function DictionaryScreen({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const query = search.toLowerCase();

  const filtered = ALL_SIGNS.filter((s) => {
    const matchCategory = category === "all" || s.category === category;
    const matchSearch = s.name.toLowerCase().includes(query) || s.meaning.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="btn-ghost text-xs mb-5">
        ← {t("Back to Home") || "Back"}
      </button>

      <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
        {t("ISL Dictionary") || "ISL Dictionary"}
      </h2>
      <p className="text-surface-500 text-xs mb-5">
        {ALL_SIGNS.length} {t("signs") || "signs"} across {CATEGORIES.length} categories
      </p>

      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("Search signs...")}
          className="input-field flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
        >
          <option value="all">{t("All Categories")}</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {t(c.name)}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        {filtered.length > 0 ? filtered.map((sign) => (
          <div key={sign.id} className="surface-card p-3.5 flex items-center gap-3">
            <span className="text-2xl w-10 text-center">{sign.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-surface-900 dark:text-white text-sm">{sign.name}</p>
              <p className="text-xs text-surface-500">{sign.meaning}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-500">
              {t(sign.category)}
            </span>
            {sign.webcamSupported && (
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </span>
            )}
          </div>
        )) : (
          <div className="text-center py-10 text-surface-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p className="text-xs">{t("No results found")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LeaderboardScreen({ game, onBack }: { game: GameState; onBack: () => void }) {
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
      <button onClick={onBack} className="btn-ghost text-xs mb-5">
        ← {t("Back to Home") || "Back"}
      </button>

      <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
        {t("Leaderboard")}
      </h2>
      <p className="text-surface-500 text-xs mb-5">
        {t("Top ISL learners") || "Top ISL learners"}
      </p>

      <div className="surface-card overflow-hidden">
        {allPlayers.map((player, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3.5 ${
              player.name === "You"
                ? "bg-primary-500/10 border-l-2 border-primary-500"
                : "border-b border-surface-100 dark:border-surface-800"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
              i === 0 ? "bg-accent/20 text-accent-400" :
              i === 1 ? "bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400" :
              i === 2 ? "bg-accent/10 text-accent-500" :
              "bg-surface-100 dark:bg-surface-800 text-surface-500"
            }`}>
              {i + 1}
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${
                player.name === "You" ? "text-primary-400" : "text-surface-900 dark:text-white"
              }`}>
                {player.name}
              </p>
              <p className="text-[10px] text-surface-500">
                {t("Level")} {player.level} • {player.streak}-day {t("streak") || "streak"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-surface-900 dark:text-white text-sm">{player.xp}</p>
              <p className="text-[10px] text-surface-500">{t("XP")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BadgesScreen({
  game,
  onBack,
}: {
  game: GameState;
  onBack: () => void;
}) {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="btn-ghost text-xs mb-5">
        ← {t("Back")}
      </button>

      <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">{t("Achievements")}</h2>
      <p className="text-surface-500 text-xs mb-5">
        {game.badges.length} {t("of")} {BADGES.length} {t("unlocked")}
      </p>

      <div className="space-y-2">
        {BADGES.map((badge) => {
          const unlocked = game.badges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`rounded-xl p-3.5 flex items-center gap-3 transition-all ${
                unlocked
                  ? "surface-card"
                  : "bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800 opacity-50"
              }`}
            >
              <span className={`text-2xl ${unlocked ? "" : "grayscale"}`}>
                {badge.icon}
              </span>
              <div>
                <p className={`font-semibold text-sm ${
                  unlocked ? "text-surface-900 dark:text-white" : "text-surface-500"
                }`}>
                  {badge.name}
                </p>
                <p className="text-[10px] text-surface-500">{badge.requirement}</p>
              </div>
              {unlocked && (
                <span className="ml-auto text-emerald-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


