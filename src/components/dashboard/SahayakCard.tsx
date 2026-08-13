"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COUNTER_KEY = "sanket-assist-count";

export function SahayakCard() {
  const [assistCount, setAssistCount] = useState(0);

  useEffect(() => {
    const count = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10) || 0;
    setAssistCount(count);
  }, []);

  return (
    <div className="glass border-emerald-500/15 p-5 animate-slide-down">
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
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-surface-900 dark:text-white text-sm">
              Sanket Sahayak
            </h3>
            <p className="text-[10px] text-surface-500">
              Help a citizen at the counter — no sign language needed
            </p>
          </div>
        </div>
        <Link href="/assist" className="btn-accent text-xs">
          Open Counter
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface-100 dark:bg-surface-800/50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-surface-900 dark:text-white">
            {assistCount}
          </p>
          <p className="text-[10px] text-surface-500">Citizens assisted</p>
        </div>
        <div className="bg-surface-100 dark:bg-surface-800/50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold text-emerald-500">
            ~30 sec
          </p>
          <p className="text-[10px] text-surface-500">Avg. service time</p>
        </div>
      </div>
    </div>
  );
}