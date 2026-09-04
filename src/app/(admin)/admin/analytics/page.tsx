"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTenant } from "@/lib/tenant-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingState } from "@/components/state/LoadingState";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const adminRoles = ["dept_admin", "org_admin", "state_admin", "national_admin", "super_admin"];

interface AnalyticsData {
  totalSessions: number;
  completedSessions: number;
  escalatedSessions: number;
  avgConfidence: number;
  sessionsByDay: { _id: string; sessions: number; completed: number; escalated: number }[];
  serviceDistribution: { name: string; count: number }[];
  clerkPerformance: { name: string; sessions: number; xp: number; level: number; streak: number }[];
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const { orgName, stateName } = useTenant();
  const router = useRouter();
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !adminRoles.includes(user.role))) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !adminRoles.includes(user.role)) return;
    setLoadingData(true);
    fetch(`/api/admin/analytics?range=${dateRange}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data);
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [user, loading, dateRange]);

  const sessionData = useMemo(() => {
    if (data?.sessionsByDay && data.sessionsByDay.length > 0) {
      return data.sessionsByDay.map((d) => ({
        date: new Date(d._id).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        sessions: d.sessions,
        completed: d.completed,
        escalated: d.escalated,
      }));
    }
    return [];
  }, [data]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const scopeLabel = user.role === "state_admin"
    ? `State: ${stateName || "All"}`
    : user.role === "national_admin" || user.role === "super_admin"
    ? "National"
    : `Org: ${orgName || "All"}`;

  const statusConfig: Record<string, { variant: "green" | "red" | "gold" | "teal"; label: string }> = {
    up: { variant: "green", label: "↑" },
    down: { variant: "red", label: "↓" },
    stable: { variant: "teal", label: "→" },
  };

  return (
    <AppShell>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Analytics Dashboard</h1>
            <p className="text-white/50">Scoped to: {scopeLabel}</p>
          </div>
          <div className="flex gap-2">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  dateRange === range
                    ? "bg-gold-400 text-navy-900"
                    : "glass-card text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>

        {loadingData ? (
          <LoadingState />
        ) : data ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Sessions" value={data.totalSessions} icon="🤝" />
              <StatCard label="Completed" value={data.completedSessions} icon="✅" trend="up" trendValue={data.totalSessions > 0 ? `${Math.round((data.completedSessions / data.totalSessions) * 100)}%` : "0%"} />
              <StatCard label="Escalated" value={data.escalatedSessions} icon="📞" />
              <StatCard label="Avg Confidence" value={`${Math.round(data.avgConfidence * 100)}%`} icon="🎯" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <h3 className="font-bold text-white mb-4">Sessions Over Time</h3>
                <div className="h-64">
                  {sessionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sessionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                        <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15,23,42,0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="sessions" stroke="#14b8a6" strokeWidth={2} dot={false} name="Total" />
                        <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} dot={false} name="Completed" />
                        <Line type="monotone" dataKey="escalated" stroke="#f59e0b" strokeWidth={2} dot={false} name="Escalated" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-white/30 text-center pt-20">No session data available</p>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-white mb-4">Session Outcomes</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Completed", value: data.completedSessions, color: "#22c55e" },
                          { name: "Escalated", value: data.escalatedSessions, color: "#f59e0b" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {[
                          { name: "Completed", value: data.completedSessions, color: "#22c55e" },
                          { name: "Escalated", value: data.escalatedSessions, color: "#f59e0b" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15,23,42,0.95)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />
                      <Legend
                        formatter={(value: string) => <span className="text-white/70 text-xs">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <h3 className="font-bold text-white mb-4">Service Distribution</h3>
                <div className="h-64">
                  {data.serviceDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.serviceDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} width={120} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15,23,42,0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                        />
                        <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="#14b8a6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-white/30 text-center pt-20">No service data available</p>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/60">Total Sessions</span>
                    </div>
                    <span className="text-xl font-bold text-white">{data.totalSessions}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/60">Completion Rate</span>
                    </div>
                    <span className="text-xl font-bold text-green-400">
                      {data.totalSessions > 0 ? Math.round((data.completedSessions / data.totalSessions) * 100) : 0}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/60">Escalation Rate</span>
                    </div>
                    <span className="text-xl font-bold text-yellow-400">
                      {data.totalSessions > 0 ? Math.round((data.escalatedSessions / data.totalSessions) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {data.clerkPerformance.length > 0 && (
              <Card>
                <h3 className="font-bold text-white mb-4">Clerk Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/40 font-medium">Clerk</th>
                        <th className="text-left py-3 px-4 text-white/40 font-medium">Sessions</th>
                        <th className="text-left py-3 px-4 text-white/40 font-medium">Streak</th>
                        <th className="text-left py-3 px-4 text-white/40 font-medium">XP</th>
                        <th className="text-left py-3 px-4 text-white/40 font-medium">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.clerkPerformance.map((clerk, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4 text-white font-medium">{clerk.name}</td>
                          <td className="py-3 px-4 text-white/60">{clerk.sessions}</td>
                          <td className="py-3 px-4 text-orange-400 font-semibold">{clerk.streak}d</td>
                          <td className="py-3 px-4 text-gold-400 font-semibold">{clerk.xp}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-400 text-xs font-semibold">
                              Lv.{clerk.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <p className="text-center text-white/40 py-8">No analytics data available.</p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
