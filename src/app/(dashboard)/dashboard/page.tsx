"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { CardSkeleton } from "@/components/Skeleton";
import { DailyLesson } from "@/components/DailyLesson";
import { getTodayIST } from "@/lib/utils";
import SignPractice from "@/components/SignPractice";
import CertificateGenerator from "@/components/CertificateGenerator";
import { loadGame } from "@/lib/game-storage";
import { autoCompleteTasks } from "@/lib/tasks";
import { useDashboardData, useLessonSubmission } from "@/lib/hooks/use-dashboard";
import { StreakBadge } from "@/components/dashboard/StreakBadge";
import { StreakBar } from "@/components/dashboard/StreakBar";
import { TasksCard } from "@/components/dashboard/TasksCard";
import { ResultCard } from "@/components/dashboard/ResultCard";
import { IslQuestCard } from "@/components/dashboard/IslQuestCard";
import { SahayakCard } from "@/components/dashboard/SahayakCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    module,
    streak,
    setStreak,
    completedToday,
    setCompletedToday,
    loading,
    error,
    loadData,
  } = useDashboardData();

  const {
    selectedAnswer,
    result,
    handleSubmit,
    milestoneCert,
    setMilestoneCert,
  } = useLessonSubmission(module);

  const [showPractice, setShowPractice] = useState(false);
  const [practiceDone, setPracticeDone] = useState(false);

  async function onSubmit(correct: boolean, answer?: string) {
    await handleSubmit(correct, setStreak, setCompletedToday, answer);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error && !module) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={loadData} className="btn-primary text-sm">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
            {completedToday ? (
              <span className="text-gradient-primary">Great work today!</span>
            ) : (
              "Today's Lesson"
            )}
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            {getTodayIST()} &bull; {user?.department}
          </p>
        </div>
        {streak && (
          <div className="flex items-center gap-3">
            <StreakBadge streak={streak.currentStreak} />
          </div>
        )}
      </div>

      {streak && streak.totalCompleted === 0 && !completedToday && (
        <div className="stagger-1 rounded-card bg-gradient-to-br from-primary-500/70 via-primary-400/40 to-accent-500/60 p-[1.5px] animate-slide-down">
          <div className="relative overflow-hidden rounded-card bg-surface-900 dark:bg-surface-950 p-5">
            <div className="absolute -right-10 -top-10 w-40 h-40 gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 gradient-accent opacity-10 blur-3xl rounded-full" />
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-btn gradient-primary flex items-center justify-center shrink-0 shadow-glow-primary">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M7 11v1m5-1v1m-7 5a5 5 0 0010 0m-5-9a5 5 0 100-10 5 5 0 000 10z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Welcome to Sanket!
                </h2>
                <p className="text-surface-400 text-sm mt-0.5">
                  Complete your first lesson below to start your ISL learning
                  journey.
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="badge badge-primary">Watch Sign</span>
                  <span className="badge badge-primary">Take Quiz</span>
                  <span className="badge badge-primary">Practice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPractice ? (
        <SignPractice
          moduleTitle={module?.title || ""}
          onComplete={() => {
            setPracticeDone(true);
            setShowPractice(false);
            autoCompleteTasks({
              hasProfile: !!(user?.name && user?.department),
              lessonDone: streak?.totalCompleted
                ? streak.totalCompleted > 0
                : false,
              practiceDone: true,
              questXp: loadGame().xp,
            });
          }}
        />
      ) : completedToday && result ? (
        <div className="stagger-1 animate-scale-in">
          <ResultCard
            correct={result.correct}
            milestone={result.milestone}
            streak={
              streak || {
                currentStreak: 0,
                longestStreak: 0,
                totalCompleted: 0,
              }
            }
            module={
              module || {
                _id: "",
                title: "",
                videoUrl: "",
                question: "",
                options: [],
                correctAnswer: "",
                order: 0,
              }
            }
            selectedAnswer={selectedAnswer || ""}
            onPractice={() => setShowPractice(true)}
            practiceDone={practiceDone}
          />
        </div>
      ) : completedToday && !result ? (
        <div className="stagger-1 text-center py-16 rounded-card bg-white dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700/50 shadow-card">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary animate-glow-pulse">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-surface-900 dark:text-white mb-1">
            Already Completed
          </h2>
          <p className="text-surface-500 text-sm">
            You have finished today&apos;s lesson. Come back tomorrow for the
            next one!
          </p>
        </div>
      ) : module ? (
        <div className="stagger-1 rounded-card bg-gradient-to-br from-primary-500/60 via-primary-300/40 to-accent-500/50 p-[1.5px] shadow-card">
          <div className="rounded-card bg-white dark:bg-surface-900 overflow-hidden">
            <DailyLesson module={module} onComplete={onSubmit} />
          </div>
        </div>
      ) : (
        <div className="stagger-1 text-center py-16 rounded-card bg-white dark:bg-surface-900/80 border border-surface-200 dark:border-surface-700/50 shadow-card">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-surface-400"
            >
              <polyline points="21 12 7 12 3 18 3 21 21 21" />
              <line x1="15" y1="18" x2="15" y2="21" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-surface-900 dark:text-white mb-1">
            No Lessons Available
          </h2>
          <p className="text-surface-500 text-sm">
            Your admin hasn&apos;t added any modules yet. Check back later.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {streak && (
            <div className="stagger-2">
              <StreakBar
                currentStreak={streak.currentStreak}
                longestStreak={streak.longestStreak}
                totalCompleted={streak.totalCompleted}
              />
            </div>
          )}

          <div className="stagger-3">
            <TasksCard />
          </div>
        </div>

        <div className="space-y-6">
          <div className="stagger-2">
            <IslQuestCard />
          </div>
          <div className="stagger-3">
            <SahayakCard />
          </div>
        </div>
      </div>

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
