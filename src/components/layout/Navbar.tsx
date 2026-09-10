"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/10" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">Sanket 2.0</span>
            <span className="hidden sm:inline text-white/40 text-sm">संकेत</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
                <Link href="/assist" className="btn-ghost text-sm">Sahayak</Link>
                <Link href="/learn" className="btn-ghost text-sm">Learn</Link>
                {(user.role === "dept_admin" || user.role === "super_admin" || user.role === "org_admin") && (
                  <Link href="/admin" className="btn-ghost text-sm">Admin</Link>
                )}
                <div className="ml-2 flex items-center gap-2">
                  <span className="text-sm text-white/60">{user.name}</span>
                  <button onClick={logout} className="btn-ghost text-sm text-red-400 hover:text-red-300">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link href="/learn" className="btn-ghost text-sm">Learn</Link>
                <Link href="/assist" className="btn-ghost text-sm">Sahayak</Link>
                <Link href="/login" className="btn-primary text-sm !py-2 !px-4">Login</Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Link href={user ? "/dashboard" : "/login"} className="btn-primary text-sm !py-2 !px-4">
              {user ? "Dashboard" : "Login"}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
