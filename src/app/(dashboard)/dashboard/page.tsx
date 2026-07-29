"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getTodayIST } from "@/lib/utils";
import SignPractice from "@/components/SignPractice";
import CertificateGenerator from "@/components/CertificateGenerator";
import { loadGame, getLevelProgress } from "@/lib/game-storage";
import { getTasks, completeTask, autoCompleteTasks, TASKS_UPDATED_EVENT } from "@/lib/tasks";

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

  useEffect(() => {
    if (!user) return;
    const game = loadGame();
    autoCompleteTasks({
      hasProfile: !!(user.name && user.department),
      lessonDone: streak?.totalCompleted ? streak.totalCompleted > 0 : false,
      questXp: game.xp,
    });
  }, [user, streak]);

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
        autoCompleteTasks({
          hasProfile: !!(user?.name && user?.department),
          lessonDone: true,
          questXp: loadGame().xp,
        });
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
        <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
        <p className="text-surface-400 text-sm animate-pulse">Loading today's lesson...</p>
      </div>
    );
  }

  if (error && !module) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={loadData} className="btn-primary text-sm">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {completedToday ? "Great work today!" : "Today's Lesson"}
          </h1>
          <p className="text-surface-500 text-sm mt-0.5">
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
        <div className="glass p-5 border-primary-500/10 animate-slide-down">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-btn gradient-primary flex items-center justify-center shrink-0 shadow-glow-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M7 11v1m5-1v1m-7 5a5 5 0 0010 0m-5-9a5 5 0 100-10 5 5 0 000 10z"/></svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Welcome to Sanket!</h2>
              <p className="text-surface-400 text-sm mt-0.5">
                Complete your first lesson below to start your ISL learning journey.
              </p>
              <div className="flex gap-2 mt-3">
                <span className="badge badge-primary">Watch Sign</span>
                <span className="badge badge-primary">Take Quiz</span>
                <span className="badge badge-primary">Practice</span>
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

      <TasksCard />

      {showPractice ? (
        <SignPractice
          moduleTitle={module?.title || ""}
          onComplete={() => {
            setPracticeDone(true);
            setShowPractice(false);
            autoCompleteTasks({
              hasProfile: !!(user?.name && user?.department),
              lessonDone: streak?.totalCompleted ? streak.totalCompleted > 0 : false,
              practiceDone: true,
              questXp: loadGame().xp,
            });
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
            Already Completed
          </h2>
          <p className="text-surface-500 text-sm">
            You have finished today&#39;s lesson. Come back tomorrow for the next one!
          </p>
        </div>
      ) : module ? (
        <>
          {module.isReview && (
            <div className="glass p-4 flex items-center gap-3 border-accent/20 animate-slide-down">
              <div className="w-9 h-9 rounded-btn bg-accent/20 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
              </div>
              <div>
                <p className="font-semibold text-amber-300 text-sm">
                  Spaced Repetition Review
                </p>
                <p className="text-amber-400/70 text-xs">
                  You got this wrong before. Try again to reinforce your learning!
                </p>
              </div>
            </div>
          )}
          <div className="surface-card overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary-900 to-indigo-900 flex items-center justify-center relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform cursor-pointer">
                    <svg className="w-8 h-8 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <p className="text-white/60 text-xs mb-0.5">{module.title}</p>
                  <p className="text-white/40 text-[10px]">ISLRTC</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-medium text-xs">ISL Lesson — Content from ISLRTC, Govt. of India</p>
              </div>
            </div>
          </div>

          <div className="surface-card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-5">
              {module.question}
            </h2>

            <div className="space-y-2.5">
              {module.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedAnswer(option);
                    setError("");
                  }}
                  aria-pressed={selectedAnswer === option}
                  aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedAnswer === option
                      ? "border-primary-500 bg-primary-500/10 text-primary-300 shadow-glow-primary"
                      : "border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 text-surface-700 dark:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        selectedAnswer === option
                          ? "bg-primary-500 text-white"
                          : "bg-surface-200 dark:bg-surface-700 text-surface-500"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium text-sm">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-3 bg-red-500/10 text-red-400 text-sm p-3.5 rounded-xl border border-red-500/20 animate-slide-down">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || submitting}
              className="btn-primary w-full mt-5"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-400"><polyline points="21 12 7 12 3 18 3 21 21 21"/><line x1="15" y1="18" x2="15" y2="21"/></svg>
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
            No Lessons Available
          </h2>
          <p className="text-surface-500 text-sm">
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
  const icon = (() => {
    if (streak >= 30) return <path d="M5 22h14l-7-20-7 20z"/>;
    if (streak >= 14) return <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>;
    if (streak >= 7) return <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>;
    if (streak >= 3) return <path d="M18 20V10M12 20V4M6 20v-6"/>;
    return <path d="M12 22c-1.5 0-3-.5-4-2-1 0-2-.5-2.5-1.5-.5 0-1-.5-1-1.5s.5-1.5 1-2c0-.5 0-1-.5-1.5-.5-.5-1-1-1.5-1.5-.5-.5-1-1-1-1.5s.5-1 1-1.5c.5-.5 1-1 1.5-1.5.5-.5.5-1 .5-1.5 0-.5.5-1 1-1s1 .5 1 1c0 .5.5 1 1 1.5.5.5 1 1 1.5 1.5.5.5 1 .5 1.5.5.5 0 1-.5 1-1 0-.5.5-1 1-1s1 .5 1 1c0 .5.5 1 1 1.5.5.5 1 1 1 1.5s-.5 1-1 1.5c-.5.5-1 1-1.5 1.5-.5.5-.5 1-.5 1.5 0 .5.5 1 1 1.5.5.5 1 1 1 1.5s-.5 1-1 1c-.5 0-1 .5-1.5 1.5-.5 1-1.5 1.5-3 2-1 1.5-2.5 2-4 2z"/>;
  })();

  return (
    <div className="flex items-center gap-2.5 glass border-accent/20 rounded-xl px-4 py-2">
      <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <div className="surface-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-surface-900 dark:text-white text-sm">Your Streak</h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-surface-500">
            Best: <span className="font-bold text-accent-400">{longestStreak}</span>
          </span>
          <span className="text-surface-500">
            Total: <span className="font-bold text-primary-400">{totalCompleted}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
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
                className={`w-full aspect-square max-w-[36px] mx-auto rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  isToday
                    ? "gradient-primary text-white shadow-glow-primary scale-110"
                    : isPast && currentStreak > weekDays.length - i
                    ? "bg-primary-500/20 text-primary-400"
                    : "bg-surface-100 dark:bg-surface-800 text-surface-400"
                }`}
              >
                {isToday ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>
                ) : isPast && currentStreak > weekDays.length - i ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <span className="text-[10px]">&mdash;</span>
                )}
              </div>
              <p
                className={`text-[10px] mt-1 ${
                  isToday ? "text-primary-400 font-bold" : "text-surface-400"
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
    <div className="space-y-5">
      <div
        className={`p-6 text-center ${
          correct
            ? "glass border-emerald-500/20"
            : "glass border-red-500/20"
        }`}
      >
        <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
          correct ? "gradient-primary shadow-glow-primary" : "bg-red-500/20"
        }`}>
          {correct ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/></svg>
          )}
        </div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
          {correct ? "Correct!" : "Not quite right"}
        </h2>
        <p className="text-surface-500 text-sm">
          {correct
            ? `You've earned a ${streak.currentStreak}-day streak!`
            : `The correct answer was: ${mod.correctAnswer}`}
        </p>
        {!correct && (
          <p className="text-xs text-surface-400 mt-1">
            You selected: {selectedAnswer}
          </p>
        )}
      </div>

      {correct && !practiceDone && (
        <div className="animate-slide-up">
          <div className="glass border-primary-500/10 p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <h3 className="text-base font-bold text-surface-900 dark:text-white mb-0.5">
              Practice with your camera
            </h3>
            <p className="text-surface-500 text-xs mb-3">
              Show the sign to your webcam and get real-time feedback
            </p>
            <button
              onClick={onPractice}
              className="btn-primary text-sm"
            >
              Open Camera Practice
            </button>
          </div>
        </div>
      )}

      {practiceDone && (
        <div className="glass border-emerald-500/20 p-4 text-center animate-scale-in">
          <div className="w-9 h-9 mx-auto mb-1.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="text-emerald-400 font-medium text-xs">
            Sign practice completed!
          </p>
        </div>
      )}

      {milestone && (
        <div className="animate-scale-in">
          <div className="glass border-accent/20 p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full gradient-accent flex items-center justify-center shadow-glow-accent">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14l-7-20-7 20z"/></svg>
            </div>
            <h3 className="text-lg font-bold text-accent-300 mb-0.5">
              {milestone}-Day Milestone!
            </h3>
            <p className="text-accent-500 text-sm mb-3">
              You&#39;ve completed {milestone} days of learning ISL. Consistency is key!
            </p>
            <div className="btn-accent text-sm inline-block">
              Download Certificate
            </div>
          </div>
        </div>
      )}

      <div className="surface-card p-5">
        <h3 className="font-semibold text-surface-900 dark:text-white text-sm mb-3">Your Stats</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Current Streak"
            value={streak.currentStreak}
          />
          <StatCard
            label="Longest Streak"
            value={streak.longestStreak}
          />
          <StatCard
            label="Total Lessons"
            value={streak.totalCompleted}
          />
        </div>
      </div>
    </div>
  );
}

function TasksCard() {
  const [state, setState] = useState<ReturnType<typeof getTasks> | null>(null);
  const [justDone, setJustDone] = useState<string | null>(null);

  useEffect(() => {
    setState(getTasks());
    const handler = () => setState(getTasks());
    window.addEventListener(TASKS_UPDATED_EVENT, handler);
    return () => window.removeEventListener(TASKS_UPDATED_EVENT, handler);
  }, []);

  function handleComplete(id: string) {
    completeTask(id);
    setState(getTasks());
    setJustDone(id);
    setTimeout(() => setJustDone(null), 1500);
  }

  if (!state) return null;

  const pct =
    state.total > 0 ? Math.round((state.completedCount / state.total) * 100) : 0;

  return (
    <div className="surface-card p-5 animate-slide-down">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
          </div>
          <div>
            <h3 className="font-bold text-surface-900 dark:text-white text-sm">Your Tasks</h3>
            <p className="text-[10px] text-surface-500">
              {state.mandatory
                ? "Onboarding — complete all to finish setup"
                : "Ongoing — keep your learning momentum"}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${
            state.mandatory
              ? "bg-red-500/15 text-red-400"
              : "bg-emerald-500/15 text-emerald-400"
          }`}
        >
          {state.mandatory ? "Mandatory" : "Recommended"}
        </span>
      </div>

      <div className="bg-surface-100 dark:bg-surface-800 rounded-full h-1.5 overflow-hidden mb-3">
        <div
          className="h-full gradient-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-1.5">
        {state.tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              task.done
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                task.done ? "bg-emerald-500 text-white" : "bg-surface-200 dark:bg-surface-700"
              }`}
            >
              {task.done ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-500"><path d="M12 5v14M5 12h14"/></svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium text-xs ${
                  task.done
                    ? "text-surface-500 line-through"
                    : "text-surface-900 dark:text-white"
                }`}
              >
                {task.title}
              </p>
              <p className="text-[10px] text-surface-500 truncate">
                {task.description}
              </p>
            </div>
            {!task.done && (
              <button
                onClick={() => handleComplete(task.id)}
                className="btn-primary text-[10px] px-2.5 py-1"
              >
                {justDone === task.id ? "Done!" : "Mark done"}
              </button>
            )}
            {task.done && task.link && (
              <Link
                href={task.link}
                className="text-[10px] text-primary-400 hover:underline shrink-0"
              >
                Open
              </Link>
            )}
          </div>
        ))}
      </div>

      {state.mandatory && state.completedCount === state.total && (
        <div className="mt-3 glass border-emerald-500/20 p-4 text-center">
          <div className="w-9 h-9 mx-auto mb-1.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="text-emerald-400 font-semibold text-xs">
            Onboarding complete! You&apos;re all set.
          </p>
        </div>
      )}
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
  const displayXp = showData ? ("islXp" in showData ? showData.islXp : showData.xp) : 0;
  const displayLevel = showData ? ("islLevel" in showData ? showData.islLevel : showData.level) : 1;
  const displayStreak = showData ? ("islStreak" in showData ? showData.islStreak : showData.streak) : 0;
  const displayBadges = showData ? ("islBadges" in showData ? showData.islBadges.length : showData.badges.length) : 0;

  return (
    <div className="glass border-accent/15 p-5 animate-slide-down">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center shadow-glow-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68a4 4 0 00-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 003 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 019.828 16h4.344a2 2 0 011.414.586L17 18c.5.5 1 1 2 1a3 3 0 003-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0017.32 5z"/></svg>
          </div>
          <div>
            <h3 className="font-bold text-surface-900 dark:text-white text-sm">ISL Quest</h3>
            <p className="text-[10px] text-surface-500">Your gamified ISL learning journey</p>
          </div>
        </div>
        <Link
          href="/learn"
          className="btn-accent text-xs"
        >
          Play Now
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-surface-100 dark:bg-surface-800/50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">{displayLevel}</p>
          <p className="text-[10px] text-surface-500">Level</p>
        </div>
        <div className="bg-surface-100 dark:bg-surface-800/50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">{displayXp}</p>
          <p className="text-[10px] text-surface-500">XP</p>
        </div>
        <div className="bg-surface-100 dark:bg-surface-800/50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">{displayStreak}</p>
          <p className="text-[10px] text-surface-500">Streak</p>
        </div>
        <div className="bg-surface-100 dark:bg-surface-800/50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">{displayBadges}</p>
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
            {progress.current} / {progress.next} XP to level {progress.current}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={syncProgress}
          disabled={syncing}
          className="btn-ghost text-xs"
        >
          {syncing ? "Saving..." : (
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save Progress
            </span>
          )}
        </button>
        {syncMsg && (
          <span className="text-[10px] text-surface-500 animate-fade-in">{syncMsg}</span>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-3.5 text-center">
      <p className="text-xl font-bold text-surface-900 dark:text-white">{value}</p>
      <p className="text-[10px] text-surface-500">{label}</p>
    </div>
  );
}
