"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTenant } from "@/lib/tenant-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/state/LoadingState";
import { ProgressRing } from "@/components/ui/ProgressRing";

const adminRoles = ["dept_admin", "org_admin", "state_admin", "national_admin", "super_admin"];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { orgName, stateName } = useTenant();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    if (!loading && (!user || !adminRoles.includes(user.role))) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !adminRoles.includes(user.role)) return;
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setDashboardData(d.data);
      })
      .catch(() => {});
  }, [user, loading]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const score = dashboardData?.sugamyaScore || {
    overall: 0,
    communicationReadiness: 0,
    clerkLearning: 0,
    assistedInteraction: 0,
    citizenFeedback: 0,
    safetyNet: 0,
    systemAvailability: 0,
  };

  const pillars = [
    { label: "Communication Readiness", value: score.communicationReadiness, weight: "30%", color: "bg-green-400", icon: "📋" },
    { label: "Clerk Learning", value: score.clerkLearning, weight: "20%", color: "bg-blue-400", icon: "📚" },
    { label: "Assisted Interaction", value: score.assistedInteraction, weight: "20%", color: "bg-teal-400", icon: "🤝" },
    { label: "Citizen Feedback", value: score.citizenFeedback, weight: "15%", color: "bg-gold-400", icon: "😊" },
    { label: "Safety Net", value: score.safetyNet, weight: "10%", color: "bg-purple-400", icon: "🛡️" },
    { label: "System Availability", value: score.systemAvailability, weight: "5%", color: "bg-cyan-400", icon: "⚙️" },
  ];

  const scopeLabel = user.role === "state_admin"
    ? `State: ${stateName || "All"}`
    : user.role === "national_admin" || user.role === "super_admin"
    ? "National"
    : `Org: ${orgName || "All"}`;

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-white/50">Scoped to: {scopeLabel}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Staff"
            value={dashboardData?.totalClerks || 0}
            icon="👥"
            trend="up"
            trendValue={`${dashboardData?.activeClerks || 0} active`}
          />
          <StatCard
            label="Total Sessions"
            value={dashboardData?.totalSessions || 0}
            icon="🤝"
            trend="up"
            trendValue={`${dashboardData?.completedSessions || 0} completed`}
          />
          <StatCard
            label="Feedback Count"
            value={`${dashboardData?.totalFeedback || 0}`}
            icon="💬"
            trend="up"
            trendValue={`${dashboardData?.positiveFeedback || 0} positive`}
          />
          <StatCard
            label="Sugamya Score"
            value={`${score.overall}%`}
            icon="⭐"
            trend="up"
            trendValue="overall"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card variant="spatial" className="flex flex-col items-center justify-center text-center py-8">
            <ProgressRing value={score.overall} size={140} strokeWidth={10} />
            <h3 className="text-xl font-bold text-white mt-6">Sugamya Score</h3>
            <p className="text-xs text-white/40 mt-1">Composite accessibility metric</p>
          </Card>

          <Card className="lg:col-span-2">
            <h3 className="font-bold text-white mb-5">Score Breakdown</h3>
            <div className="space-y-4">
              {pillars.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white/60 flex items-center gap-2">
                      <span>{item.icon}</span>
                      {item.label}
                      <span className="text-xs text-white/30">({item.weight})</span>
                    </span>
                    <span className="text-sm font-semibold text-white">{item.value}%</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="spatial" hover onClick={() => router.push("/admin/analytics")}>
            <div className="text-center py-4">
              <span className="text-3xl mb-2 block">📊</span>
              <h3 className="font-bold text-white text-sm">Analytics</h3>
              <p className="text-xs text-white/40 mt-1">View insights</p>
            </div>
          </Card>
          <Card variant="spatial" hover onClick={() => router.push("/admin/staff")}>
            <div className="text-center py-4">
              <span className="text-3xl mb-2 block">👥</span>
              <h3 className="font-bold text-white text-sm">Staff</h3>
              <p className="text-xs text-white/40 mt-1">Manage team</p>
            </div>
          </Card>
          <Card variant="spatial" hover onClick={() => router.push("/admin/reports")}>
            <div className="text-center py-4">
              <span className="text-3xl mb-2 block">📄</span>
              <h3 className="font-bold text-white text-sm">Reports</h3>
              <p className="text-xs text-white/40 mt-1">Export data</p>
            </div>
          </Card>
          <Card variant="spatial" hover onClick={() => router.push("/admin/signs")}>
            <div className="text-center py-4">
              <span className="text-3xl mb-2 block">🤟</span>
              <h3 className="font-bold text-white text-sm">Signs</h3>
              <p className="text-xs text-white/40 mt-1">ISL library</p>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
