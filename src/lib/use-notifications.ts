"use client";

import { useState, useCallback, useEffect } from "react";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!("Notification" in window)) return;
    setPermission(Notification.permission);
    const check = setInterval(() => {
      if (Notification.permission !== permission) {
        setPermission(Notification.permission);
      }
    }, 5000);
    return () => clearInterval(check);
  }, [permission]);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return "denied" as NotificationPermission;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const notify = useCallback((title: string, options?: NotificationOptions) => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") {
      setPendingCount((c) => c + 1);
      return;
    }
    try {
      const n = new Notification(title, {
        icon: "/icon-192.png",
        ...options,
      });
      setTimeout(() => n.close(), 6000);
    } catch {}
  }, []);

  const clearPending = useCallback(() => setPendingCount(0), []);

  return { permission, requestPermission, notify, pendingCount, clearPending };
}
