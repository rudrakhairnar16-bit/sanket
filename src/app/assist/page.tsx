"use client";

import AssistMode from "@/components/AssistMode";

export default function AssistPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Sanket Sahayak <span className="text-primary-400">संकेत सहायक</span>
            </h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              One desk. No language barrier. Help a citizen in 30 seconds.
            </p>
          </div>
        </div>
        <AssistMode />
      </div>
    </div>
  );
}
