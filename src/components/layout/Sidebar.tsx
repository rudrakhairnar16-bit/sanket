"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const clerkLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/assist", label: "Sahayak", icon: "🤝" },
    { href: "/learn", label: "ISL Quest", icon: "📚" },
    { href: "/practice", label: "Practice", icon: "✋" },
    { href: "/progress", label: "Progress", icon: "📊" },
    { href: "/certificates", label: "Certificates", icon: "📜" },
    { href: "/dashboard/profile", label: "Profile", icon: "👤" },
    { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "🏆" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Overview", icon: "📊" },
    { href: "/admin/staff", label: "Staff", icon: "👥" },
    { href: "/admin/departments", label: "Departments", icon: "🏢" },
    { href: "/admin/service-packs", label: "Service Packs", icon: "📦" },
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
    { href: "/admin/feedback", label: "Feedback", icon: "💬" },
    { href: "/admin/reports", label: "Reports", icon: "📄" },
    { href: "/admin/audit", label: "Audit Log", icon: "📋" },
  ];

  const isAdmin = ["dept_admin", "org_admin", "state_admin", "national_admin", "super_admin"].includes(user.role);
  const links = isAdmin ? adminLinks : clerkLinks;

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-4rem)] glass border-r border-white/10 p-4" role="navigation" aria-label="Sidebar navigation">
      <div className="mb-4 px-3">
        <p className="text-xs text-white/40 uppercase tracking-wider font-medium">{isAdmin ? "Admin Panel" : "Quick Nav"}</p>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-gold-400/10 text-gold-400 border border-gold-400/20" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            >
              <span className="text-lg" aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
