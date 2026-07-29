"use client";

import { useNotifications } from "@/lib/use-notifications";
import { useEffect } from "react";
import { setNotify } from "@/lib/notify";

export function NotificationBell() {
  const { permission, requestPermission, notify, pendingCount } = useNotifications();

  useEffect(() => {
    setNotify(notify);
    return () => setNotify(() => {});
  }, [notify]);

  if (permission === "granted" && pendingCount === 0) return null;

  return (
    <button
      onClick={requestPermission}
      className="relative btn-ghost text-[10px] px-2 py-0.5"
      aria-label={permission === "default" ? "Enable notifications" : `${pendingCount} pending notifications`}
      title={permission === "default" ? "Enable desktop notifications" : `${pendingCount} notification${pendingCount !== 1 ? "s" : ""} pending`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
      {(pendingCount > 0 || permission === "default") && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
}
