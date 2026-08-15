"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const COUNTER_KEY = "sanket-assist-count";

function CountUp({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;    let current = 0;
    const step = Math.max(1, Math.round(value / 30));
    const timer = setInterval(() => {
      current = Math.min(value, current + step);
      setDisplay(current);
      if (current >= value) clearInterval(timer);
    }, 24);
    return () => clearInterval(timer);
  }, [value]);

  return <span className={className}>{display}</span>;
}

export function SahayakCard() {
  const [assistCount, setAssistCount] = useState(0);

  useEffect(() => {
    const count = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10) || 0;
    setAssistCount(count);
  }, []);

  return (
    <div className="rounded-card bg-white dark:bg-surface-900/80 border border-success-500/15 p-5 shadow-card animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-success flex items-center justify-center shadow-glow-success">
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
            <h3 className="font-display font-bold text-surface-900 dark:text-white text-sm">
              Sanket Sahayak
            </h3>
            <p className="text-[10px] text-surface-500">
              Help a citizen at the counter — no sign language needed
            </p>
          </div>
        </div>
        <Link href="/assist" className="btn-success text-xs">
          Open Counter
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3 text-center bg-gradient-to-br from-success-500/10 to-transparent border border-success-500/20">
          <CountUp
            value={assistCount}
            className="text-lg font-bold font-display text-success-600 dark:text-success-400 animate-number-pop"
          />
          <p className="text-[10px] text-surface-500 mt-0.5">Citizens assisted</p>
        </div>
        <div className="rounded-xl p-3 text-center bg-gradient-to-br from-primary-500/10 to-transparent border border-primary-500/20">
          <p className="text-lg font-bold font-display text-primary-600 dark:text-primary-400">
            ~30 sec
          </p>
          <p className="text-[10px] text-surface-500 mt-0.5">Avg. service time</p>
        </div>
      </div>
    </div>
  );
}