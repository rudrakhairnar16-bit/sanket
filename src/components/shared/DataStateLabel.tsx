"use client";

import React from "react";

export function DataStateLabel() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (!isDemo) return null;

  return (
    <div className="text-center py-2 text-xs text-white/30">
      Showing demonstration data — not connected to live database
    </div>
  );
}
