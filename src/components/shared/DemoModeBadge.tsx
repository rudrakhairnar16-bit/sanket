"use client";

import React from "react";

export function DemoModeBadge() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (!isDemo) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-xs font-bold uppercase tracking-wider animate-pulse">
        Demo Mode
      </div>
    </div>
  );
}
