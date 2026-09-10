"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const helpfulLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/learn", label: "ISL Quest", icon: "📚" },
  { href: "/assist", label: "Sanket Sahayak", icon: "🤝" },
  { href: "/problem-statement", label: "Problem Statement", icon: "📋" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-6 sm:p-8">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link href="/">
          <Button size="lg" className="text-base px-8 mb-8">
            ← Back to Home
          </Button>
        </Link>

        <div className="glass-card text-left">
          <p className="text-xs text-white/30 uppercase tracking-wider font-semibold mb-4">Helpful Links</p>
          <div className="space-y-2">
            {helpfulLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-white/60 text-sm group-hover:text-white transition-colors">{link.label}</span>
                <span className="ml-auto text-white/20 group-hover:text-white/40 transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
