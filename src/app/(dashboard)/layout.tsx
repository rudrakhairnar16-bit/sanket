"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadGame, saveGame, type GameState } from "@/lib/game-storage";
import { DemoTour } from "@/components/DemoTour";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const game = loadGame();
    setDark(game.darkMode);
    if (game.darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark");
    const game = loadGame();
    const updated: GameState = { ...game, darkMode: next };
    saveGame(updated);
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-surface-950 dark:to-surface-900">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-surface-500 dark:text-surface-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === "admin" || user.role === "superadmin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/40 to-surface-50 dark:from-surface-950 dark:via-primary-950/30 dark:to-surface-950">
      <nav className="sticky top-0 z-50 glass border-b border-white/20 dark:border-gray-800/50 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="relative w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary transition-transform hover:scale-105 active:scale-95">
                <span className="text-lg font-bold text-white">सं</span>
              </Link>
              <div className="leading-tight">
                <span className="font-display font-bold text-surface-900 dark:text-white text-lg">Sanket</span>
                <p className="text-[10px] text-primary-500 dark:text-primary-400 font-medium uppercase tracking-wider">Learn ISL</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1 bg-white/40 dark:bg-white/5 rounded-btn p-1 border border-surface-200/60 dark:border-white/5">
              <Link
                href="/dashboard"
                className={`px-4 py-1.5 rounded-[10px] text-sm font-medium transition-all ${
                  pathname === "/dashboard"
                    ? "bg-primary-500 text-white shadow-btn"
                    : "text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5"
                }`}
              >
                Learn
              </Link>
              <Link
                href="/dashboard/leaderboard"
                className={`px-4 py-1.5 rounded-[10px] text-sm font-medium transition-all ${
                  pathname === "/dashboard/leaderboard"
                    ? "bg-primary-500 text-white shadow-btn"
                    : "text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5"
                }`}
              >
                Leaderboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`px-4 py-1.5 rounded-[10px] text-sm font-medium transition-all ${
                    pathname.startsWith("/admin")
                      ? "bg-accent-500 text-surface-900 shadow-btn"
                      : "text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 hover:bg-accent-50 dark:hover:bg-accent-900/20"
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDark}
                className="relative w-9 h-9 flex items-center justify-center text-surface-500 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-btn transition-all"
                title={dark ? "Light mode" : "Dark mode"}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              >
                <span className={`transition-all duration-300 ${dark ? "scale-100 rotate-0" : "scale-0 -rotate-90 absolute"}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </span>
                <span className={`transition-all duration-300 ${!dark ? "scale-100 rotate-0" : "scale-0 rotate-90 absolute"}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </span>
              </button>
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2.5 px-2.5 py-1.5 bg-white/50 dark:bg-white/5 border border-surface-200/60 dark:border-white/5 rounded-btn hover:shadow-card transition-all"
                title="My Profile"
              >
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-glow-primary">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-surface-900 dark:text-white leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-surface-500 dark:text-surface-400">{user.department}</p>
                </div>
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-surface-500 dark:text-surface-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-btn transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-btn"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-3 animate-slide-down">
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                Learn
              </Link>
              <Link
                href="/dashboard/leaderboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                Leaderboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                My Profile
              </Link>
              <div className="border-t border-surface-200 dark:border-surface-700 mt-2 pt-2 px-4">
                <p className="text-sm font-medium text-surface-800 dark:text-surface-100">{user.name}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{user.department}</p>
              </div>
            </div>
          )}
        </div>
        <div className="h-0.5 gradient-primary opacity-70" />
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <DemoTour />
    </div>
  );
}
