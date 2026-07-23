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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  const progress = getLevelProgress(game.xp);
  const accuracy = getAccuracy(game);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
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
    <div className={`max-w-4xl mx-auto px-4 py-6 ${animateIn}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm text-primary-400 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 transition-all"
          >
            ← {t("Login")}
          </Link>
          <button
            onClick={toggleLang}
            className="px-2 py-1 text-xs rounded-lg border border-primary-200 dark:border-primary-700
          text-primary-500 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 transition-all"
          >
            {lang === "en" ? "हिंदी" : lang === "hi" ? "मराठी" : "EN"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="px-2 py-1 text-xs rounded-lg border border-primary-200 dark:border-primary-700
          text-primary-500 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 transition-all"
          >
            {game.darkMode ? "☀️" : "🌙"}
          </button>
          <Link
            href="/dashboard"
            className="text-sm text-primary-400 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 transition-all"
          >
            {t("Clerk Dashboard")} →
          </Link>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-primary-400 uppercase tracking-wide">ISL Quest</p>
            <h1 className="text-2xl font-bold text-primary-900 mt-0.5">
              Learn Indian Sign Language
            </h1>
            <p className="text-sm text-primary-500 mt-0.5">{today}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">Lv.{game.level}</div>
            <p className="text-xs text-primary-400">{game.xp} XP</p>
          </div>
        </div>

        <div className="bg-white/60 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-primary-500 font-medium">
              Level {game.level} → {game.level + 1}
            </span>
            <span className="text-xs text-primary-400">
              {progress.current} / {progress.next} XP
            </span>
          </div>
          <div className="w-full bg-primary-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress.progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <StatBox icon="🔥" value={game.streak} label="Day Streak" />
          <StatBox icon="🎯" value={`${accuracy}%`} label="Accuracy" />
          <StatBox icon="🏆" value={game.badges.length} label="Badges" />
          <StatBox icon="✅" value={game.completedSigns.length} label="Learned" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <ModeCard
          icon="🃏"
          title="Flashcards"
          description="Flip cards to learn signs and their meanings"
          color="from-primary-500 to-primary-700"
          onClick={() => onNavigate("flashcards")}
        />
        <ModeCard
          icon="🧠"
          title="Quiz Challenge"
          description="Test your knowledge with quick quizzes"
          color="from-emerald-500 to-teal-600"
          onClick={() => onNavigate("quiz")}
        />
        <ModeCard
          icon="📸"
          title="Webcam Practice"
          description="Use your camera to practice real signs"
          color="from-orange-500 to-orange-700"
          onClick={() => onNavigate("practice")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => onNavigate("dictionary")}
          className="glass rounded-2xl p-4 text-center hover:shadow-md transition-all"
        >
          <span className="text-2xl block mb-1">📖</span>
          <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
            {t("ISL Dictionary") || "ISL Dictionary"}
          </span>
        </button>
        <button
          onClick={() => onNavigate("leaderboard")}
          className="glass rounded-2xl p-4 text-center hover:shadow-md transition-all"
        >
          <span className="text-2xl block mb-1">🏆</span>
          <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
            {t("Leaderboard")}
          </span>
        </button>
      </div>

      <Link
        href="/curriculum"
        className="flex items-center gap-3 glass rounded-2xl p-4 mb-2 hover:shadow-md transition-all group"
      >
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-white">📋</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-primary-900 dark:text-white text-sm group-hover:text-primary-600 transition-colors">
            12-Week ISL Curriculum
          </p>
          <p className="text-xs text-primary-500 dark:text-primary-400">
            Structured learning path for public servants
          </p>
        </div>
        <span className="text-primary-300 dark:text-primary-700 text-lg">→</span>
      </Link>
      <Link
        href="/roadmap"
        className="flex items-center gap-3 glass rounded-2xl p-4 mb-2 hover:shadow-md transition-all group"
      >
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-white">🗺️</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-primary-900 dark:text-white text-sm group-hover:text-primary-600 transition-colors">
            Scalability Roadmap
          </p>
          <p className="text-xs text-primary-500 dark:text-primary-400">
            Pilot → City → State → National rollout plan
          </p>
        </div>
        <span className="text-primary-300 dark:text-primary-700 text-lg">→</span>
      </Link>
      <Link
        href="/policy"
        className="flex items-center gap-3 glass rounded-2xl p-4 mb-4 hover:shadow-md transition-all group"
      >
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-white">📄</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-primary-900 dark:text-white text-sm group-hover:text-primary-600 transition-colors">
            Policy Whitepaper
          </p>
          <p className="text-xs text-primary-500 dark:text-primary-400">
            Municipal adoption blueprint aligned with RPwD Act 2016
          </p>
        </div>
        <span className="text-primary-300 dark:text-primary-700 text-lg">→</span>
      </Link>
      <Link
        href="/interpreter"
        className="flex items-center gap-3 glass rounded-2xl p-4 mb-4 hover:shadow-md transition-all group border-2 border-primary-200 dark:border-primary-800"
      >
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0 animate-pulse">
          <span className="text-lg font-bold text-white">🤟</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-primary-900 dark:text-white text-sm group-hover:text-primary-600 transition-colors">
            Live ISL Interpreter
          </p>
          <p className="text-xs text-primary-500 dark:text-primary-400">
            Real-time sign-to-text &amp; two-way communication
          </p>
        </div>
        <span className="text-primary-300 dark:text-primary-700 text-lg">→</span>
      </Link>

      <button
        onClick={() => onNavigate("badges")}
        className="w-full glass rounded-2xl p-4 text-center hover:shadow-md transition-all"
      >
        <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
          {t("View All Badges")} ({game.badges.length}/{BADGES.length})
        </span>
      </button>

      <div className="mt-4 p-4 bg-white/40 rounded-2xl text-center">
        <p className="text-xs text-primary-400">
          Content sourced from ISLRTC, Ministry of Social Justice & Empowerment, Govt. of India
        </p>
      </div>
    </div>
  );
}

function StatBox({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="bg-white dark:bg-primary-950 rounded-2xl p-3 text-center">
      <span className="text-xl block mb-0.5">{icon}</span>
      <p className="text-lg font-bold text-primary-900 dark:text-white">{value}</p>
      <p className="text-xs text-primary-400 dark:text-primary-400">{t(label) || label}</p>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl p-6 text-white text-left hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />
      <div className="relative">
        <span className="text-4xl block mb-3">{icon}</span>
        <h3 className="text-lg font-bold mb-1">{t(title) || title}</h3>
        <p className="text-sm text-white/80">{t(description) || description}</p>
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
        <div className="bg-white dark:bg-primary-950 rounded-3xl shadow-sm border border-primary-100
          dark:border-primary-800 p-8 text-center">
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">
            {t("All Categories Done!")}
          </h2>
          <p className="text-primary-500 dark:text-primary-400 mb-6">
            {t("You reviewed")} {knownCount} {t("signs. Keep practicing daily!")}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all"
          >
            {t("Back to Home")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-sm text-primary-400 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-all"
        >
          ← {t("Exit")}
        </button>
        <span className="text-xs text-primary-400 dark:text-primary-400">
          {t(category.name)} • {signIndex + 1}/{signs.length}
        </span>
      </div>

      <div
        className="cursor-pointer perspective-[1000px] mb-6"
        onClick={() => setFlipped(!flipped)}
        style={{ perspective: "1000px" }}
      >
        <div
          className={`relative w-full transition-transform duration-500`}
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "320px",
          }}
        >
          <div
            className="absolute inset-0 bg-white dark:bg-primary-950 rounded-3xl shadow-lg border border-primary-100
           dark:border-primary-800 p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-7xl mb-4">{currentSign.icon}</span>
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">
              {currentSign.name}
            </h2>
            <p className="text-primary-400 dark:text-primary-400 text-sm">{t("Tap to reveal meaning")}</p>
          </div>

          <div
            className="bg-white dark:bg-primary-950 rounded-3xl shadow-lg border border-primary-200 dark:border-primary-800 p-8 flex flex-col items-center justify-center text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              minHeight: "320px",
            }}
          >
            <span className="text-6xl mb-4">💡</span>
            <h2 className="text-2xl font-bold text-primary-700 dark:text-primary-300 mb-2">
              {currentSign.meaning}
            </h2>
            {currentSign.hint && (
              <p className="text-primary-500 dark:text-primary-400 text-sm mt-2">
                💬 {currentSign.hint}
              </p>
            )}
            {currentSign.webcamSupported && (
              <span className="mt-3 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                📸 {t("Webcam practice available")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={skipSign}
          className="flex-1 px-6 py-3 bg-white dark:bg-primary-950 border border-primary-200
          dark:border-primary-700 text-primary-600 dark:text-primary-300 rounded-xl font-medium hover:bg-primary-50
          dark:hover:bg-primary-900 transition-all"
        >
          {t("Skip")}
        </button>
        <button
          onClick={markKnown}
          className="flex-1 px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
        >
          ✓ {t("I Know This")}
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {signs.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === signIndex
                ? "bg-primary-500 w-4"
                : i < signIndex
                ? "bg-green-400"
                : "bg-primary-200"
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-primary-400 text-center mt-4">
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
        <div className="bg-white dark:bg-primary-950 rounded-3xl shadow-lg border border-primary-100
          dark:border-primary-800 p-8 text-center">
          {pct >= 80 ? (
            <span className="text-7xl block mb-4">🏆</span>
          ) : pct >= 50 ? (
            <span className="text-6xl block mb-4">💪</span>
          ) : (
            <span className="text-6xl block mb-4">📚</span>
          )}
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">
            {t(pct >= 80 ? "Outstanding!" : pct >= 50 ? "Good Effort!" : "Keep Practicing!")}
          </h2>
          <p className="text-primary-500 dark:text-primary-400 mb-6">
            {t("You scored")} {correctCount}/{total} {t("across")} {CATEGORIES.length} {t("categories")}
          </p>
          <p className="text-3xl font-bold text-primary-600 mb-6">
            {pct}% Accuracy
          </p>
          <p className="text-sm text-primary-400 mb-6">+{score} XP earned</p>
          <button
            onClick={onBack}
            className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
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
        <p className="text-primary-500 mb-4">Not enough signs in this category.</p>
        <button onClick={onBack} className="text-primary-600 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-sm text-primary-400 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-all"
        >
          ← {t("Exit")}
        </button>
        <span className="text-xs text-primary-400 dark:text-primary-400">
          {t(category.name)} • Q{questionIndex + 1}/{quizData.length}
        </span>
      </div>

      <div className="bg-white dark:bg-primary-950 rounded-3xl shadow-lg border border-primary-100
           dark:border-primary-800 p-6 sm:p-8 mb-4">
        <div className="text-center mb-6">
          <span className="text-6xl block mb-3">{q.sign.icon}</span>
          <h2 className="text-xl font-bold text-primary-900 dark:text-white">
            {t("What does this sign mean?")}
          </h2>
          <p className="text-sm text-primary-400 dark:text-primary-400 mt-1">
            {t("Sign")}: {q.sign.name}
          </p>
        </div>

        <div className="space-y-3">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={!!selected}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                selected === option
                  ? option === q.sign.meaning
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-red-500 bg-red-50 shadow-md"
                  : selected
                  ? option === q.sign.meaning
                    ? "border-green-400 bg-green-50"
                    : "border-primary-100 bg-primary-50 opacity-60"
                  : "border-primary-100 bg-primary-50 hover:border-primary-200 hover:bg-primary-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                    selected === option
                      ? option === q.sign.meaning
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-primary-200 text-primary-500"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-medium dark:text-white">{option}</span>
                {selected && option === q.sign.meaning && (
                  <span className="ml-auto text-green-600 dark:text-green-400 text-sm font-medium">✓</span>
                )}
                {selected === option && option !== q.sign.meaning && (
                  <span className="ml-auto text-red-600 dark:text-red-400 text-sm font-medium">✗</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="animate-slide-up">
          <div
            className={`rounded-2xl p-4 mb-4 text-center ${
              isCorrect
                ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
            }`}
          >
            <p
              className={`font-medium ${
                isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
              }`}
            >
              {isCorrect
                ? "✅ " + t("Correct") + "! +20 XP"
                : `✗ ${t("The answer was")}: ${q.sign.meaning}`}
            </p>
            <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">{q.sign.hint}</p>
            {q.sign.webcamSupported && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">📸 {t("Try with webcam!")}</p>
            )}
          </div>
          <button
            onClick={nextQuestion}
            className="w-full gradient-primary text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg"
          >
            {questionIndex + 1 >= quizData.length &&
            categoryIndex + 1 >= CATEGORIES.length
              ? t("See Final Results")
              : t("Next Question")}
          </button>
        </div>
      )}

      <div className="flex justify-center gap-1.5 mt-4">
        {quizData.slice(0, 5).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === questionIndex
                ? "bg-primary-500 w-4"
                : i < questionIndex
                ? "bg-green-400"
                : "bg-primary-200"
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-primary-400 text-center mt-3">
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
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { stopAll(); onBack(); }}
          className="text-sm text-primary-400 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-all"
        >
          ← {t("Exit")}
        </button>
        {status !== "idle" && (
          <button
            onClick={stopAll}
            className="text-sm text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-200 transition-all"
          >
            {t("Restart")}
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-primary-950 rounded-3xl shadow-lg border border-primary-100
           dark:border-primary-800 p-6 mb-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-primary-900 dark:text-white">{t("Webcam Practice")}</h2>
          <p className="text-sm text-primary-500 dark:text-primary-400">
            {t("Show the sign to your camera")}
          </p>
          <button
            onClick={() => { setTrainMode((v) => !v); setTrainSignId(null); }}
            className={`mt-3 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              trainMode
                ? "bg-orange-500 text-white"
                : "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800"
            }`}
          >
            🎯 {trainMode ? "Training ON" : "Train Model"}
          </button>
        </div>

        {trainMode && (
          <div className="mb-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-300">
                🎯 Train Sign Model
              </p>
              <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300">
                {classifier.getSignCount()} signs • {trainCount} captures
              </span>
            </div>
            <p className="text-xs text-primary-500 dark:text-primary-400 mb-2">
              {trainSignId
                ? <>Capturing <strong className="text-orange-600 dark:text-orange-300">{ALL_SIGNS.find((s) => s.id === trainSignId)?.name}</strong> — hold the sign to camera ~1.5s…</>
                : "Select a sign to train:"}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
              Need {classifier.getMinSamplesPerSign()}+ samples per sign before recognition works
            </p>
            <div className="flex flex-wrap gap-2">
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
                    className={`px-3 py-2 rounded-xl text-xs transition-all border flex flex-col items-center gap-1 ${
                      trainSignId === sign.id
                        ? "bg-orange-500 text-white border-orange-400"
                        : isReady
                        ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 text-emerald-700 dark:text-emerald-300"
                        : "bg-white dark:bg-primary-950 hover:bg-primary-50 dark:hover:bg-primary-900 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-300"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {sign.icon} {sign.name}
                      {isReady && <span className="text-xs">✓</span>}
                    </div>
                    <div className="w-24 h-1.5 bg-primary-100 dark:bg-primary-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isReady ? "bg-emerald-500" : "bg-orange-500"
                        }`}
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px]">
                      {count}/{minSamples}
                    </span>
                  </button>
                );
              })}
            </div>
            {trainCount > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const json = classifier.serialize();
                    const blob = new Blob([json], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "sanket-knn-model.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 rounded-xl text-xs transition-all hover:bg-emerald-200 dark:hover:bg-emerald-900/60"
                >
                  📤 Export Model
                </button>
                <label className="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 rounded-xl text-xs cursor-pointer transition-all hover:bg-primary-200 dark:hover:bg-primary-900/60 flex items-center gap-1">
                  📥 Import Model
                  <input
                    type="file"
                    accept=".json"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        try {
                          classifier.deserialize(ev.target?.result as string);
                          localStorage.setItem("sanket-knn-samples", classifier.serialize());
                          setHasSamples(classifier.getSignCount() > 0);
                          setTrainCount(classifier.getSampleCount());
                        } catch {
                          alert("Invalid model file");
                        }
                      };
                      reader.readAsText(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  onClick={() => {
                    classifier.reset();
                    localStorage.removeItem("sanket-knn-samples");
                    setHasSamples(false);
                    setTrainCount(0);
                    setTrainSignId(null);
                  }}
                  className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded-xl text-xs transition-all hover:bg-red-200 dark:hover:bg-red-900/60"
                >
                  Reset All Training
                </button>
              </div>
            )}
          </div>
        )}

        {status === "idle" && (
          <div className="text-center py-8">
            <span className="text-6xl block mb-4">📸</span>
            <p className="text-primary-500 dark:text-primary-400 mb-2">{t("Choose a sign to practice:")}</p>
            <select
              value={selectedSign}
              onChange={(e) => setSelectedSign(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 dark:border-primary-700 mb-4 bg-white dark:bg-primary-950 dark:text-white"
            >
              {WEBCAM_SIGNS.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {signInfo && (
              <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900 rounded-2xl">
                <span className="text-3xl block mb-2">{signInfo.icon}</span>
                <p className="text-sm text-primary-600 dark:text-primary-300">{signInfo.hint}</p>
              </div>
            )}
            <button
              onClick={startCamera}
              className="px-8 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
            >
              {t("Start Camera")}
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-8">
            <span className="text-6xl block mb-4">😞</span>
            <p className="text-red-600 dark:text-red-400 font-medium mb-2">{errorMsg}</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
            >
              {t("Try Again")}
            </button>
          </div>
        )}

        {(status === "loading" || status === "ready" || status === "practicing") && (
          <div className="relative aspect-video bg-primary-900 rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full scale-x-[-1]"
            />

            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary-900/80">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-3" />
                  <p className="text-white/80 text-sm">{t("Starting camera...")}</p>
                </div>
              </div>
            )}

            {status === "practicing" && (
              <div className="absolute top-3 left-3 right-3 flex justify-between">
                <span className="px-3 py-1.5 bg-black/50 text-white text-xs rounded-xl backdrop-blur">
                  {handCount > 0 ? `${handCount} hand${handCount > 1 ? "s" : ""}` : "No hand"}
                </span>
                <span className="px-3 py-1.5 bg-black/50 text-white text-xs rounded-xl backdrop-blur">
                  Target: {selectedSign}
                </span>
              </div>
            )}
          </div>
        )}

        {status === "practicing" && (
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-primary-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full gradient-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(accuracy, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-primary-600 w-12 text-right">
                {accuracy}%
              </span>
            </div>
            <p className="text-sm text-primary-500 mt-2 text-center">
              {trainMode ? "Training mode — samples are captured live" : signInfo?.hint}
            </p>
            {!trainMode && hasSamples && (
              <p className="text-sm text-center mt-1">
                <span className="text-xs text-primary-400">Detected: </span>
                <span className="font-semibold text-orange-600 dark:text-orange-300">
                  {detectedName ?? "—"}
                </span>
              </p>
            )}
            {!trainMode && !hasSamples && (
              <p className="text-xs text-center text-orange-500 dark:text-orange-400 mt-1">
                No trained signs yet — tap “Train Model” to teach a sign.
              </p>
            )}
          </div>
        )}

        {status === "success" && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center animate-scale-in">
            <span className="text-5xl block mb-3">🎉</span>
            <p className="text-green-700 dark:text-green-300 font-bold text-lg mb-1">
              {t("Sign Recognized!")}
            </p>
            <p className="text-green-600 dark:text-green-400 text-sm mb-3">
              {t("You signed")} {selectedSign} {t("correctly!")} +50 XP
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={stopAll}
                className="px-6 py-2.5 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all"
              >
                {t("Practice Again")}
              </button>
              <button
                onClick={() => { stopAll(); onBack(); }}
                className="px-6 py-2.5 bg-white dark:bg-primary-950 border border-primary-200
          dark:border-primary-700 text-primary-600 dark:text-primary-300 rounded-xl font-medium hover:bg-primary-50
          dark:hover:bg-primary-900 transition-all"
              >
                {t("Done")}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-primary-400 dark:text-primary-400 text-center">
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
      <button
        onClick={onBack}
        className="text-sm text-primary-400 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 mb-6 flex items-center gap-1 transition-all"
      >
        ← {t("Back to Home") || "Back"}
      </button>

      <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">
        📖 {t("ISL Dictionary") || "ISL Dictionary"}
      </h2>
      <p className="text-primary-500 dark:text-primary-400 text-sm mb-6">
        {ALL_SIGNS.length} {t("signs") || "signs"} across {CATEGORIES.length} categories
      </p>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("Search signs...")}
          className="flex-1 px-4 py-3 rounded-xl border border-primary-200 dark:border-primary-700 bg-white dark:bg-primary-950 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 rounded-xl border border-primary-200 dark:border-primary-700 bg-white dark:bg-primary-950 dark:text-white outline-none"
        >
          <option value="all">{t("All Categories")}</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {t(c.name)}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length > 0 ? filtered.map((sign) => (
          <div
            key={sign.id}
          className="bg-white dark:bg-primary-950 rounded-2xl p-4 flex items-center gap-4 border
           border-primary-100 dark:border-primary-800"
          >
            <span className="text-3xl w-12 text-center">{sign.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-primary-900 dark:text-white">{sign.name}</p>
              <p className="text-sm text-primary-500 dark:text-primary-400">{sign.meaning}</p>
            </div>
<span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-500
           dark:text-primary-400">
              {t(sign.category)}
            </span>
            {sign.webcamSupported && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                📸
              </span>
            )}
          </div>
        )) : (
          <div className="text-center py-12 text-primary-400 dark:text-primary-400">
            <span className="text-4xl block mb-3">🔍</span>
            <p>{t("No results found")}</p>
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
      <button
        onClick={onBack}
        className="text-sm text-primary-400 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 mb-6 flex items-center gap-1 transition-all"
      >
        ← {t("Back to Home") || "Back"}
      </button>

      <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">
        🏆 {t("Leaderboard")}
      </h2>
      <p className="text-primary-500 dark:text-primary-400 text-sm mb-6">
        {t("Top ISL learners") || "Top ISL learners"}
      </p>

      <div className="bg-white dark:bg-primary-950 rounded-3xl shadow-sm border border-primary-100
           dark:border-primary-800 overflow-hidden">
        {allPlayers.map((player, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-4 ${
              player.name === "You"
                ? "bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500"
                : "border-b border-primary-50 dark:border-primary-800"
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
              i === 0 ? "bg-orange-100 dark:bg-orange-900 text-orange-600" :
              i === 1 ? "bg-primary-100 dark:bg-primary-900 text-primary-600" :
              i === 2 ? "bg-orange-100 dark:bg-orange-900 text-orange-600" :
              "bg-primary-50 dark:bg-primary-900 text-primary-500"
            }`}>
              {i + 1}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${
                player.name === "You" ? "text-primary-700 dark:text-primary-300" : "text-primary-900 dark:text-white"
              }`}>
                {player.name}
              </p>
              <p className="text-xs text-primary-400">
                {t("Level")} {player.level} • {player.streak}-day {t("streak") || "streak"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary-900 dark:text-white">{player.xp}</p>
              <p className="text-xs text-primary-400">{t("XP")}</p>
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
      <button
        onClick={onBack}
        className="text-sm text-primary-400 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 mb-6 flex items-center gap-1 transition-all"
      >
        ← {t("Back")}
      </button>

      <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-2">{t("Achievements")}</h2>
      <p className="text-primary-500 dark:text-primary-400 text-sm mb-6">
        {game.badges.length} {t("of")} {BADGES.length} {t("unlocked")}
      </p>

      <div className="space-y-3">
        {BADGES.map((badge) => {
          const unlocked = game.badges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`rounded-2xl p-4 flex items-center gap-4 transition-all ${
                unlocked
                  ? "bg-white dark:bg-primary-950 border border-orange-200 dark:border-orange-700 shadow-sm"
                  : "bg-primary-50 dark:bg-primary-950/50 border border-primary-100 dark:border-primary-800 opacity-60"
              }`}
            >
              <span className={`text-3xl ${unlocked ? "" : "grayscale"}`}>
                {badge.icon}
              </span>
              <div>
                <p
                  className={`font-semibold ${
                    unlocked ? "text-primary-900 dark:text-white" : "text-primary-400 dark:text-primary-400"
                  }`}
                >
                  {badge.name}
                </p>
                <p className="text-xs text-primary-500 dark:text-primary-400">{badge.requirement}</p>
              </div>
              {unlocked && (
                <span className="ml-auto text-green-500 text-xl">✅</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


