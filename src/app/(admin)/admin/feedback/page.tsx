"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTenant } from "@/lib/tenant-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingState } from "@/components/state/LoadingState";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const adminRoles = ["dept_admin", "org_admin", "state_admin", "national_admin", "super_admin"];

interface FeedbackItem {
  _id: string;
  clerkName: string;
  department: string;
  attempted: boolean;
  rating?: number;
  comment?: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const { user, loading } = useAuth();
  const { orgName, stateName } = useTenant();
  const router = useRouter();
  const [filterDept, setFilterDept] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState({ total: 0, positive: 0, negative: 0, rate: 0, avgRating: 0, departments: [] as string[] });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !adminRoles.includes(user.role))) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !adminRoles.includes(user.role)) return;
    const params = new URLSearchParams();
    if (filterDept !== "all") params.set("department", filterDept);
    if (filterRating !== "all") params.set("rating", filterRating);

    setLoadingData(true);
    fetch(`/api/admin/feedback?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setFeedback(d.feedback);
          setStats(d.stats);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [user, loading, filterDept, filterRating]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const attempted = stats.positive;
  const chartData = [
    { name: "Tried ISL", value: attempted, color: "#22c55e" },
    { name: "No ISL", value: stats.negative, color: "#ef4444" },
  ];

  const ratingDistribution = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: feedback.filter((f) => f.rating === r).length,
    percentage: feedback.length > 0 ? Math.round((feedback.filter((f) => f.rating === r).length / feedback.length) * 100) : 0,
  }));

  const scopeLabel = user.role === "state_admin"
    ? `State: ${stateName || "All"}`
    : user.role === "national_admin" || user.role === "super_admin"
    ? "National"
    : `Org: ${orgName || "All"}`;

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Feedback Management</h1>
          <p className="text-white/50">Scoped to: {scopeLabel}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Feedback" value={stats.total} icon="💬" trend="up" trendValue="all time" />
          <StatCard label="Avg Rating" value={`${stats.avgRating}⭐`} icon="⭐" trend="up" trendValue="out of 5" />
          <StatCard label="ISL Attempted" value={`${stats.rate}%`} icon="🤟" trend="up" trendValue={`${attempted} sessions`} />
          <StatCard label="Positive" value={feedback.filter((f) => (f.rating || 0) >= 4).length} icon="👍" trend="up" trendValue="4+ stars" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <h3 className="font-bold text-white mb-4">Feedback Summary</h3>
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.rating}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/60 flex items-center gap-1">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <span key={i} className="text-gold-400 text-xs">★</span>
                      ))}
                      <span className="text-xs text-white/30 ml-1">({item.rating})</span>
                    </span>
                    <span className="text-sm text-white/70">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-400 to-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-white mb-4">ISL Attempt Rate</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {chartData.map((entry, index) => (
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
                  <Legend formatter={(value: string) => <span className="text-white/70 text-xs">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <p className="text-2xl font-bold text-green-400">{stats.rate}%</p>
              <p className="text-xs text-white/40">Attempted ISL</p>
            </div>
          </Card>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="input-field"
            >
              <option value="all">All Departments</option>
              {stats.departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="input-field"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </Card>

        {loadingData ? (
          <LoadingState />
        ) : (
          <div className="space-y-3">
            {feedback.map((f) => (
              <Card key={f._id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                        {f.clerkName?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{f.clerkName}</p>
                        <p className="text-xs text-white/40">{f.department}</p>
                      </div>
                    </div>
                    {f.comment && (
                      <p className="text-sm text-white/60 italic ml-13 pl-0.5">&quot;{f.comment}&quot;</p>
                    )}
                    <p className="text-xs text-white/30 mt-1.5 ml-13">
                      {new Date(f.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-0.5 justify-end mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${star <= (f.rating || 0) ? "text-gold-400" : "text-white/20"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <Badge variant={f.attempted ? "green" : "red"}>
                      {f.attempted ? "Tried ISL" : "No ISL"}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loadingData && feedback.length === 0 && (
          <Card>
            <p className="text-center text-white/40 py-8">No feedback found matching your criteria.</p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
