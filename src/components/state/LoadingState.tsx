import React from "react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20" role="status" aria-live="polite">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 border-2 border-gold-400/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-gold-400 rounded-full animate-spin" />
      </div>
      <p className="text-white/50 text-sm">{message}</p>
    </div>
  );
}
