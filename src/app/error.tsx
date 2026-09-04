"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-6 sm:p-8">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-3">Something Went Wrong</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            An unexpected error occurred while loading this page.
          </p>
        </div>

        {error.message && (
          <div className="glass-card mb-6">
            <p className="text-xs text-white/30 uppercase tracking-wider font-semibold mb-2">Error Details</p>
            <p className="text-white/50 text-sm font-mono break-all">{error.message}</p>
            {error.digest && (
              <p className="text-white/25 text-xs mt-2 font-mono">Digest: {error.digest}</p>
            )}
          </div>
        )}

        <button onClick={reset} className="btn-primary w-full py-3">
          🔄 Try Again
        </button>

        <div className="mt-4 text-center">
          <a href="/" className="text-sm text-white/30 hover:text-white/60 transition-colors">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}
