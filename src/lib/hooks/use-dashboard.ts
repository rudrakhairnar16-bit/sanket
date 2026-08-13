"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { loadGame } from "@/lib/game-storage";
import { autoCompleteTasks } from "@/lib/tasks";
import { getTodayIST } from "@/lib/utils";

export interface ModuleData {
  _id: string;
  title: string;
  videoUrl: string;
  question: string;
  options: string[];
  correctAnswer: string;
  order: number;
  isReview?: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [module, setModule] = useState<ModuleData | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [completedToday, setCompletedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            const firstModule =
              data.modules.find((m: ModuleData) => m.order === 1) ||
              data.modules[0];
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

  return {
    module,
    setModule,
    streak,
    setStreak,
    completedToday,
    setCompletedToday,
    loading,
    error,
    loadData,
  };
}

export function useLessonSubmission(module: ModuleData | null) {
  const { user, refreshUser } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    correct: boolean;
    milestone: number | null;
  } | null>(null);
  const [error, setError] = useState("");
  const [milestoneCert, setMilestoneCert] = useState<number | null>(null);

  async function handleSubmit(
    correct: boolean,
    setStreak: (s: StreakData) => void,
    setCompletedToday: (v: boolean) => void,
  ) {
    if (!module) return;
    try {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: module._id,
          answer: selectedAnswer || module.correctAnswer,
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
    }
  }

  return {
    selectedAnswer,
    setSelectedAnswer,
    submitting,
    result,
    setResult,
    error,
    handleSubmit,
    milestoneCert,
    setMilestoneCert,
  };
}
