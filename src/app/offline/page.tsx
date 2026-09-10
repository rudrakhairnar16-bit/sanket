"use client";

import React from "react";

const offlineFeatures = [
  { icon: "📚", title: "ISL Quest (Cached)", description: "Continue learning with cached flashcards and quizzes." },
  { icon: "🤟", title: "Sign Reference", description: "Browse previously downloaded ISL sign library." },
  { icon: "📊", title: "Score History", description: "View your past Sugamya Score and progress data." },
  { icon: "📝", title: "Draft Feedback", description: "Write feedback that will sync when you're back online." },
];

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-6 sm:p-8">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-6">📡</div>
          <h1 className="text-2xl font-bold text-white mb-3">You&apos;re Offline</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            It looks like you&apos;ve lost your internet connection.
            Don&apos;t worry — some Sanket features still work offline.
          </p>
        </div>

        <div className="glass-card mb-6">
          <p className="text-xs text-white/30 uppercase tracking-wider font-semibold mb-4">Available Offline</p>
          <div className="space-y-3">
            {offlineFeatures.map((f) => (
              <div key={f.title} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03]">
                <span className="text-xl shrink-0">{f.icon}</span>
                <div>
                  <p className="text-white/70 text-sm font-medium">{f.title}</p>
                  <p className="text-white/35 text-xs">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card mb-6">
          <p className="text-xs text-white/30 uppercase tracking-wider font-semibold mb-2">Cached Data</p>
          <p className="text-white/40 text-sm">
            Last synced: <span className="text-white/60 font-medium">2 minutes ago</span>
          </p>
          <p className="text-white/40 text-sm mt-1">
            Your progress will automatically sync when connection is restored.
          </p>
        </div>

        <button onClick={handleRetry} className="btn-primary w-full py-3">
          🔄 Try Again
        </button>
      </div>
    </div>
  );
}
