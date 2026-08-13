"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTasks, completeTask, TASKS_UPDATED_EVENT } from "@/lib/tasks";

export function TasksCard() {
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
    state.total > 0
      ? Math.round((state.completedCount / state.total) * 100)
      : 0;

  return (
    <div className="surface-card p-5 animate-slide-down">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow-primary">
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
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-surface-900 dark:text-white text-sm">
              Your Tasks
            </h3>
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
                task.done
                  ? "bg-emerald-500 text-white"
                  : "bg-surface-200 dark:bg-surface-700"
              }`}
            >
              {task.done ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-surface-500"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-emerald-400 font-semibold text-xs">
            Onboarding complete! You&apos;re all set.
          </p>
        </div>
      )}
    </div>
  );
}
