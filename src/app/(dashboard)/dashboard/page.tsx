"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getTodayIST } from "@/lib/utils";
import SignPractice from "@/components/SignPractice";
import CertificateGenerator from "@/components/CertificateGenerator";
import { loadGame, getLevelProgress } from "@/lib/game-storage";

interface ModuleData {
  _id: string;
  title: string;
  videoUrl: string;
  question: string;
  options: string[];
  correctAnswer: string;
  order: number;
  isReview?: boolean;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
}

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [module, setModule] = useState<ModuleData | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [completedToday, setCompletedToday] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    correct: boolean;
    milestone: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPractice, setShowPractice] = useState(false);
  const [practiceDone, setPracticeDone] = useState(false);
  const [milestoneCert, setMilestoneCert] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [moduleRes, streakRes, reviewRes] = await Promise.all([
        fetch("/api/modules"),
        fetch("/api/completions"),
        fetch("/api/completions/review"),
      ]);

      if (reviewRes.ok) {
        const reviewData = await reviewRes.json();
        if (reviewData.review) {
          setModule({ ...reviewData.review.module, isReview: true });
        }
      }

      let streakData: any = null;
      if (streakRes.ok) {
        streakData = await streakRes.json();
        setCompletedToday(streakData.completedToday);
        setStreak({
          currentStreak: streakData.currentStreak || 0,
          longestStreak: streakData.longestStreak || 0,
          totalCompleted: streakData.totalCompleted || 0,
        });
      }

      if (!module && moduleRes.ok) {
        const data = await moduleRes.json();
        if (data.modules?.length > 0) {
          if (streakData && streakData.totalCompleted === 0) {
            const firstModule = data.modules.find((m: ModuleData) => m.order === 1) || data.modules[0];
            setModule(firstModule);
          } else {
            const today = getTodayIST();
            const dayIndex =
              (parseInt(today.replace(/-/g, ""), 10) % data.modules.length) + 1;
            const mod =
              data.modules.find((m: ModuleData) => m.order === dayIndex) ||
              data.modules[0];
            setModule(mod);
          }
        }
      }
    } catch {
      setError("Failed to load today's lesson");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!selectedAnswer || !module || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: module._id,
          answer: selectedAnswer,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          correct: data.correct,
          milestone: data.milestone,
        });
        setStreak({
          currentStreak: data.currentStreak,
          longestStreak: data.longestStreak,
          totalCompleted: data.totalCompleted,
        });
        setCompletedToday(true);
        if (data.milestone) {
          setTimeout(() => setMilestoneCert(data.milestone), 1000);
        }
        refreshUser();
      } else {
        setError(data.error || "Submission failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
        <p className="text-gray-500 animate-pulse">Loading today's lesson...</p>
      </div>
    );
  }

  if (error && !module) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-6xl">😞</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={loadData}
          className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {completedToday ? "Great work today! 🎉" : "Today's Lesson"}
          </h1>
          <p className="text-gray-500 mt-1">
            {getTodayIST()} • {user?.department}
          </p>
        </div>
        {streak && (
          <div className="flex items-center gap-3">
            <StreakBadge streak={streak.currentStreak} />
          </div>
        )}
      </div>

      {streak && streak.totalCompleted === 0 && !completedToday && (
        <div className="bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-200 rounded-3xl p-6 animate-slide-down">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary-900">Welcome to Sanket!</h2>
              <p className="text-primary-700 text-sm mt-1">
                Complete your first lesson below to start your ISL learning journey.
              </p>
              <div className="flex gap-3 mt-3">
                <span className="text-xs px-3 py-1 rounded-full bg-white/70 text-primary-600 font-medium">
                  📹 Watch Sign
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/70 text-primary-600 font-medium">
                  ✅ Take Quiz
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/70 text-primary-600 font-medium">
                  📸 Practice
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {streak && (
        <StreakBar
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
          totalCompleted={streak.totalCompleted}
        />
      )}

      <IslQuestCard />

      {showPractice ? (
        <SignPractice
          moduleTitle={module?.title || ""}
          onComplete={() => {
            setPracticeDone(true);
            setShowPractice(false);
          }}
        />
      ) : completedToday && result ? (
        <div className="animate-scale-in">
          <ResultCard
            correct={result.correct}
            milestone={result.milestone}
            streak={streak || { currentStreak: 0, longestStreak: 0, totalCompleted: 0 }}
            module={module || { _id: "", title: "", videoUrl: "", question: "", options: [], correctAnswer: "", order: 0 }}
            selectedAnswer={selectedAnswer || ""}
            onPractice={() => setShowPractice(true)}
            practiceDone={practiceDone}
          />
        </div>
      ) : completedToday && !result ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Already Completed
          </h2>
          <p className="text-gray-500">
            You have finished today&#39;s lesson. Come back tomorrow for the
            next one!
          </p>
        </div>
      ) : module ? (
        <>
          {module.isReview && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-3xl p-4 flex items-center gap-3 animate-slide-down">
              <span className="text-2xl">🔄</span>
              <div>
                <p className="font-semibold text-amber-800 text-sm">
                  Spaced Repetition Review
                </p>
                <p className="text-amber-600 text-xs">
                  You got this wrong before. Try again to reinforce your learning!
                </p>
              </div>
            </div>
          )}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary-900 to-indigo-900 flex items-center justify-center relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform cursor-pointer">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-white/60 text-sm mb-1">{module.title}</p>
                  <p className="text-white/40 text-xs">ISLRTC</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-medium text-sm">ISL Lesson — Content from ISLRTC, Govt. of India</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {module.question}
            </h2>

            <div className="space-y-3">
              {module.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedAnswer(option);
                    setError("");
                  }}
                  aria-pressed={selectedAnswer === option}
                  aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    selectedAnswer === option
                      ? "border-primary-500 bg-primary-50 text-primary-700 shadow-md"
                      : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                        selectedAnswer === option
                          ? "bg-primary-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-4 bg-red-50 text-red-600 text-sm p-4 rounded-2xl animate-slide-down">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || submitting}
              className="w-full mt-6 gradient-primary text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Answer"
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Lessons Available
          </h2>
          <p className="text-gray-500">
            Your admin hasn&#39;t added any modules yet. Check back later.
          </p>
        </div>
      )}

      {milestoneCert && (
        <CertificateGenerator
          name={user?.name || "Learner"}
          department={user?.department || ""}
          streak={milestoneCert}
          onClose={() => setMilestoneCert(null)}
        />
      )}
    </div>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  const getEmoji = () => {
    if (streak >= 30) return "🏆";
    if (streak >= 14) return "🔥";
    if (streak >= 7) return "⭐";
    if (streak >= 3) return "💪";
    return "🌱";
  };

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-4 py-2.5">
      <span className="text-2xl">{getEmoji()}</span>
      <div>
        <p className="text-lg font-bold text-amber-700">{streak}</p>
        <p className="text-xs text-amber-500">day streak</p>
      </div>
    </div>
  );
}

function StreakBar({
  currentStreak,
  longestStreak,
  totalCompleted,
}: StreakData) {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay();
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - ((today + 6) % 7));

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Your Streak</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">
            Best:{" "}
            <span className="font-bold text-amber-600">{longestStreak}</span>
          </span>
          <span className="text-gray-500">
            Total:{" "}
            <span className="font-bold text-primary-600">
              {totalCompleted}
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {weekDays.map((day, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          const dateStr = new Date(
            date.getTime() + 5.5 * 60 * 60 * 1000
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
                className={`w-full aspect-square max-w-[40px] mx-auto rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  isToday
                    ? "gradient-primary text-white shadow-lg shadow-primary-500/30 scale-110"
                    : isPast && currentStreak > weekDays.length - i
                    ? "bg-primary-100 text-primary-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isToday ? "🔥" : isPast && currentStreak > weekDays.length - i ? "✅" : "—"}
              </div>
              <p
                className={`text-xs mt-1 ${
                  isToday ? "text-primary-600 font-bold" : "text-gray-400"
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

function ResultCard({
  correct,
  milestone,
  streak,
  module: mod,
  selectedAnswer,
  onPractice,
  practiceDone,
}: {
  correct: boolean;
  milestone: number | null;
  streak: StreakData;
  module: ModuleData;
  selectedAnswer: string;
  onPractice: () => void;
  practiceDone: boolean;
}) {
  return (
    <div className="space-y-6">
      <div
        className={`rounded-3xl p-8 text-center ${
          correct
            ? "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
            : "bg-gradient-to-br from-red-50 to-rose-50 border border-red-200"
        }`}
      >
        <div className="text-6xl mb-4">{correct ? "🎉" : "😅"}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {correct ? "Correct!" : "Not quite right"}
        </h2>
        <p className="text-gray-500">
          {correct
            ? `You've earned a ${streak.currentStreak}-day streak!`
            : `The correct answer was: ${mod.correctAnswer}`}
        </p>
        {!correct && (
          <p className="text-sm text-gray-400 mt-2">
            You selected: {selectedAnswer}
          </p>
        )}
      </div>

      {correct && !practiceDone && (
        <div className="animate-slide-up">
          <div className="bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-200 rounded-3xl p-6 text-center">
            <span className="text-4xl block mb-2">📸</span>
            <h3 className="text-lg font-bold text-primary-800 mb-1">
              Practice with your camera
            </h3>
            <p className="text-primary-600 text-sm mb-4">
              Show the sign to your webcam and get real-time feedback
            </p>
            <button
              onClick={onPractice}
              className="px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-primary-500/25"
            >
              Open Camera Practice
            </button>
          </div>
        </div>
      )}

      {practiceDone && (
        <div className="bg-green-50 border border-green-200 rounded-3xl p-4 text-center animate-scale-in">
          <span className="text-2xl block mb-1">✅</span>
          <p className="text-green-700 font-medium text-sm">
            Sign practice completed!
          </p>
        </div>
      )}

      {milestone && (
        <div className="animate-scale-in">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-amber-800 mb-2">
              {milestone}-Day Milestone!
            </h3>
            <p className="text-amber-600 mb-4">
              You&#39;ve completed {milestone} days of learning ISL.
              Consistency is key!
            </p>
            <div
              className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium shadow-lg text-center"
            >
              Download Certificate
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Your Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Current Streak"
            value={streak.currentStreak}
            icon="🔥"
          />
          <StatCard
            label="Longest Streak"
            value={streak.longestStreak}
            icon="🏆"
          />
          <StatCard
            label="Total Lessons"
            value={streak.totalCompleted}
            icon="📚"
          />
        </div>
      </div>
    </div>
  );
}

function IslQuestCard() {
  const [gameData, setGameData] = useState<ReturnType<typeof loadGame> | null>(null);
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
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setServerData(data))
      .catch(() => {});
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
        setSyncMsg("Progress saved! ✅");
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
  const displayXp = showData ? ("islXp" in showData ? showData.islXp : showData.xp) : 0;
  const displayLevel = showData ? ("islLevel" in showData ? showData.islLevel : showData.level) : 1;
  const displayStreak = showData ? ("islStreak" in showData ? showData.islStreak : showData.streak) : 0;
  const displayBadges = showData ? ("islBadges" in showData ? showData.islBadges.length : showData.badges.length) : 0;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-3xl p-5 animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
            <span className="text-lg">🎮</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">ISL Quest</h3>
            <p className="text-xs text-gray-500">Your gamified ISL learning journey</p>
          </div>
        </div>
        <Link
          href="/learn"
          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-xl text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          Play Now
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-3">
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-gray-900">{displayLevel}</p>
          <p className="text-xs text-gray-500">Level</p>
        </div>
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-gray-900">{displayXp}</p>
          <p className="text-xs text-gray-500">XP</p>
        </div>
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-gray-900">{displayStreak}</p>
          <p className="text-xs text-gray-500">Streak</p>
        </div>
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-gray-900">{displayBadges}</p>
          <p className="text-xs text-gray-500">Badges</p>
        </div>
      </div>

      {progress && (
        <div className="mb-3">
          <div className="bg-white/70 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {progress.current} / {progress.next} XP to level {progress.current}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={syncProgress}
          disabled={syncing}
          className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-50 transition-all disabled:opacity-50"
        >
          {syncing ? "Saving..." : "💾 Save Progress"}
        </button>
        {syncMsg && (
          <span className="text-xs text-gray-500 animate-fade-in">{syncMsg}</span>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 text-center">
      <span className="text-2xl block mb-1">{icon}</span>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
