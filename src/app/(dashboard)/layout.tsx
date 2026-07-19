"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === "admin" || user.role === "superadmin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <nav className="sticky top-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                <span className="text-lg font-bold text-white">सं</span>
              </div>
              <span className="font-bold text-gray-900 text-lg">Sanket</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname === "/dashboard"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Learn
              </Link>
              <Link
                href="/dashboard/leaderboard"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname === "/dashboard/leaderboard"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Leaderboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    pathname.startsWith("/admin")
                      ? "bg-amber-100 text-amber-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl">
                <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.department}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                Sign Out
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
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
                className="block px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Learn
              </Link>
              <Link
                href="/dashboard/leaderboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Leaderboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 rounded-xl text-sm font-medium text-amber-600 hover:bg-amber-50"
                >
                  Admin
                </Link>
              )}
              <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                <p className="text-sm text-gray-500">{user.name}</p>
                <p className="text-xs text-gray-400">{user.department}</p>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
