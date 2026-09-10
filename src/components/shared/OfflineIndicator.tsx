"use client";

import { useState, useEffect } from "react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => { setIsOnline(true); setShowBanner(true); setTimeout(() => setShowBanner(false), 3000); };
    const handleOffline = () => { setIsOnline(false); setShowBanner(true); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  if (!showBanner && isOnline) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium transition-all duration-300 ${
      isOnline 
        ? 'bg-green-500/20 text-green-400 border-b border-green-500/30' 
        : 'bg-gold-400/20 text-gold-400 border-b border-gold-400/30'
    }`}>
      {isOnline ? '✓ Back online' : '⚠ You are offline — some features may be limited'}
    </div>
  );
}
