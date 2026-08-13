"use client";

import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";

interface Learner {
  _id: string;
  name: string;
  department: string;
  currentStreak: number;
  totalCompleted: number;
}

export function ClerkTable() {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [sending, setSending] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => setLearners(data.users || []))
      .catch((e) => logger.error("Leaderboard fetch failed:", e));
  }, []);

  async function sendNudge(clerkId: string, name: string) {
    setSending(clerkId);
    setMsg("");
    try {
      const res = await fetch("/api/nudges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkIds: [clerkId],
          reason: "missed-lesson",
        }),
      });
      const data = await res.json();
      setMsg(data.message || "Nudge sent!");
    } catch {
      setMsg("Failed to send nudge");
    } finally {
      setSending(null);
      setTimeout(() => setMsg(""), 3000);
    }
  }

  const lowPerformers = learners.filter(
    (l) => l.currentStreak < 3 && l.totalCompleted < 10,
  );

  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-surface-900 dark:text-white text-sm flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="14" rx="2" ry="2" />
              <line x1="8" y1="9" x2="16" y2="9" />
              <line x1="16" y1="15" x2="12" y2="15" />
              <line x1="12" y1="15" x2="12" y2="21" />
            </svg>
            WhatsApp Nudge — Engagement Recovery
          </h3>
          <p className="text-[10px] text-surface-500 mt-0.5">
            Send reminders to low-engagement learners
          </p>
        </div>
        {msg && (
          <span className="text-xs text-emerald-400 animate-fade-in">
            {msg}
          </span>
        )}
      </div>

      {lowPerformers.length > 0 ? (
        <div className="divide-y divide-surface-100 dark:divide-surface-800">
          {lowPerformers.slice(0, 10).map((clerk) => (
            <div
              key={clerk._id}
              className="flex items-center gap-3 py-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-xs font-bold text-surface-500">
                {clerk.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                  {clerk.name}
                </p>
                <p className="text-[10px] text-surface-500">
                  {clerk.department} &bull; {clerk.currentStreak}d streak
                </p>
              </div>
              <button
                onClick={() => sendNudge(clerk._id, clerk.name)}
                disabled={sending === clerk._id}
                className="btn-primary text-[10px] px-2.5 py-1"
              >
                {sending === clerk._id ? "..." : "Log Nudge"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-surface-500 text-center py-6 flex items-center justify-center gap-1.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          All learners are engaged! No nudges needed right now.
        </p>
      )}
      <p className="text-[10px] text-surface-500 mt-2">
        Nudge logged for tracking. WhatsApp API integration pending for pilot
        deployment.
      </p>
    </div>
  );
}
