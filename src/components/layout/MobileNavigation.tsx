"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function MobileNavigation() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const tabs = [
    { href: "/dashboard", label: "Home", icon: "🏠" },
    { href: "/assist", label: "Sahayak", icon: "🤝" },
    { href: "/learn", label: "Learn", icon: "📚" },
    { href: "/progress", label: "Progress", icon: "📊" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10 md:hidden" role="navigation" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${isActive ? "text-gold-400" : "text-white/50 hover:text-white/70"}`}
            >
              <span className="text-lg" aria-hidden="true">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
