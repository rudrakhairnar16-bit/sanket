"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DeptCompliance {
  _id: string;
  totalUsers: number;
  totalCompletions: number;
}

interface DashboardData {
  overallCompliance: number;
  totalUsers: number;
  totalCompletions: number;
  deptCompliance: DeptCompliance[];
  leaderboard: {
    _id: string;
    name: string;
    department: string;
    currentStreak: number;
    longestStreak: number;
    totalCompleted: number;
    isChampion?: boolean;
  }[];
}

interface FeedbackStats {
  total: number;
  positive: number;
  negative: number;
  satisfactionRate: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [feedback, setFeedback] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);

      const [dashboardRes, feedbackRes] = await Promise.all([
        fetch(`/api/admin/dashboard?${params}`),
        fetch("/api/feedback/stats"),
      ]);

      if (dashboardRes.ok) {
        const json = await dashboardRes.json();
        setData(json);
      }

      if (feedbackRes.ok) {
        const json = await feedbackRes.json();
        setFeedback(json.stats);
      }
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function exportCSV() {
    if (!data) return;
    const headers = ["Department", "Total Users", "Total Completions"];
    const rows = data.deptCompliance.map(
      (d) => `${d._id},${d.totalUsers},${d.totalCompletions}`
    );
    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sanket-compliance-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  const chartData = (data?.deptCompliance || []).map((d) => ({
    name: d._id,
    Completions: d.totalCompletions,
    Users: d.totalUsers,
  }));

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-white">
            Compliance Dashboard
          </h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {user?.role === "superadmin" ? "All departments" : user?.department}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="input-field text-xs"
          />
          <span className="text-xs text-surface-500">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="input-field text-xs"
          />
          <button
            onClick={exportCSV}
            className="btn-secondary text-xs"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Overall Compliance"
          value={`${data?.overallCompliance ?? 0}%`}
          color="primary"
        />
        <StatCard
          label="Total Users"
          value={data?.totalUsers ?? 0}
          color="blue"
        />
        <StatCard
          label="Total Completions"
          value={data?.totalCompletions ?? 0}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="surface-card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-white text-sm mb-4">
            Department Compliance
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip />
                <Bar
                  dataKey="Completions"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <p className="text-surface-500 text-center py-12 text-sm">No data</p>
            )}
        </div>

        <div className="surface-card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-white text-sm mb-4">
            Top Performing Clerks
          </h3>
          <div className="space-y-2">
            {data?.leaderboard && data.leaderboard.length > 0 ? (
              data.leaderboard.map((clerk, i) => (
                <div
                  key={clerk._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      i === 0
                        ? "bg-accent/20 text-accent-400"
                        : i === 1
                        ? "bg-surface-200 dark:bg-surface-700 text-surface-500"
                        : i === 2
                        ? "bg-accent/10 text-accent-500"
                        : "bg-surface-100 dark:bg-surface-800 text-surface-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 dark:text-white text-sm truncate">
                      {clerk.name}
                      {clerk.isChampion && <span className="ml-1 text-xs" title="ISL Champion">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14l-7-20-7 20z"/></svg>
                      </span>}
                    </p>
                    <p className="text-[10px] text-surface-500 truncate">{clerk.department}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/users/${clerk._id}/champion`, { method: "PATCH" });
                          if (res.ok) loadData();
                        } catch {}
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 ${
                        clerk.isChampion
                          ? "bg-accent/20 text-accent-400"
                          : "bg-surface-100 dark:bg-surface-800 text-surface-500 hover:bg-accent/10"
                      }`}
                      title={clerk.isChampion ? "Remove Champion" : "Designate Champion"}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{clerk.isChampion ? <path d="M5 22h14l-7-20-7 20z"/> : <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>}</svg>
                      Champion
                    </button>
                    <div className="text-right">
                      <p className="font-bold text-surface-900 dark:text-white text-sm">{clerk.currentStreak}</p>
                      <p className="text-[10px] text-surface-500">day streak</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-surface-500 text-center py-8 text-sm">No data</p>
            )}
          </div>
        </div>
      </div>

      {feedback && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            label="Citizen Feedback"
            value={feedback.total}
            color="primary"
          />
          <StatCard
            label="Positive Responses"
            value={feedback.positive}
            color="green"
          />
          <StatCard
            label="Satisfaction Rate"
            value={`${feedback.satisfactionRate}%`}
            color="blue"
          />
        </div>
      )}

      <NudgePanel />
    </div>
  );
}

function NudgePanel() {
  const [learners, setLearners] = useState<
    { _id: string; name: string; department: string; currentStreak: number; totalCompleted: number }[]
  >([]);
  const [sending, setSending] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => setLearners(data.users || []))
      .catch(() => {});
  }, []);

  async function sendNudge(clerkId: string, name: string) {
    setSending(clerkId);
    setMsg("");
    try {
      const res = await fetch("/api/nudges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkIds: [clerkId], reason: "missed-lesson" }),
      });
      const data = await res.json();
      setMsg(data.message || "Nudge sent!");
    } catch {
      setMsg("Failed to send nudge");
    } finally {
      setSending(null);
      setTimeout(() => setMsg(""), 3000);
    }
  }

  const lowPerformers = learners.filter((l) => l.currentStreak < 3 && l.totalCompleted < 10);

  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-surface-900 dark:text-white text-sm flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2" ry="2"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="16" y1="15" x2="12" y2="15"/><line x1="12" y1="15" x2="12" y2="21"/></svg>
            WhatsApp Nudge — Engagement Recovery
          </h3>
          <p className="text-[10px] text-surface-500 mt-0.5">
            Send reminders to low-engagement learners
          </p>
        </div>
        {msg && <span className="text-xs text-emerald-400 animate-fade-in">{msg}</span>}
      </div>

      {lowPerformers.length > 0 ? (
        <div className="divide-y divide-surface-100 dark:divide-surface-800">
          {lowPerformers.slice(0, 10).map((clerk) => (
            <div key={clerk._id} className="flex items-center gap-3 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-xs font-bold text-surface-500">
                {clerk.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{clerk.name}</p>
                <p className="text-[10px] text-surface-500">{clerk.department} • {clerk.currentStreak}d streak</p>
              </div>
              <button
                onClick={() => sendNudge(clerk._id, clerk.name)}
                disabled={sending === clerk._id}
                className="btn-primary text-[10px] px-2.5 py-1"
              >
                {sending === clerk._id ? "..." : "Nudge"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-surface-500 text-center py-6 flex items-center justify-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          All learners are engaged! No nudges needed right now.
        </p>
      )}
      <p className="text-[10px] text-surface-500 mt-2">
        * Nudges are logged for tracking. Integrate Twilio/WhatsApp API for live delivery.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "primary" | "blue" | "green" | "purple";
}) {
  const icons = {
    primary: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    blue: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    green: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    purple: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  };

  const colors = {
    primary: "border-primary-500/20",
    blue: "border-blue-500/20",
    green: "border-emerald-500/20",
    purple: "border-purple-500/20",
  };

  const iconColors = {
    primary: "text-primary-400",
    blue: "text-blue-400",
    green: "text-emerald-400",
    purple: "text-purple-400",
  };

  return (
    <div className={`surface-card border ${colors[color]} p-5`}>
      <div className={`w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-3 ${iconColors[color]}`}>
        {icons[color]}
      </div>
      <p className="text-2xl font-bold text-surface-900 dark:text-white">{value}</p>
      <p className="text-xs text-surface-500">{label}</p>
    </div>
  );
}
