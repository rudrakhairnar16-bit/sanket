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
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  const chartData = (data?.deptCompliance || []).map((d) => ({
    name: d._id,
    Completions: d.totalCompletions,
    Users: d.totalUsers,
  }));

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Compliance Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === "superadmin" ? "All departments" : user?.department}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-primary-500 outline-none"
          />
          <span className="text-gray-400 dark:text-gray-500">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-sm focus:border-primary-500 outline-none"
          />
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-all"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Overall Compliance"
          value={`${data?.overallCompliance ?? 0}%`}
          icon="📈"
          color="primary"
        />
        <StatCard
          label="Total Users"
          value={data?.totalUsers ?? 0}
          icon="👥"
          color="blue"
        />
        <StatCard
          label="Total Completions"
          value={data?.totalCompletions ?? 0}
          icon="✅"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
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
            <p className="text-gray-400 dark:text-gray-500 text-center py-12">No data</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Clerks
          </h3>
          <div className="space-y-3">
            {data?.leaderboard && data.leaderboard.length > 0 ? (
              data.leaderboard.map((clerk, i) => (
                <div
                  key={clerk._id}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                      i === 0
                        ? "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300"
                        : i === 1
                        ? "bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-300"
                        : i === 2
                        ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {clerk.name}
                      {clerk.isChampion && <span className="ml-1 text-xs" title="ISL Champion">👑</span>}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{clerk.department}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/users/${clerk._id}/champion`, { method: "PATCH" });
                          if (res.ok) loadData();
                        } catch {}
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                        clerk.isChampion
                          ? "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                      }`}
                      title={clerk.isChampion ? "Remove Champion" : "Designate Champion"}
                    >
                      {clerk.isChampion ? "👑" : "☆"} Champion
                    </button>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{clerk.currentStreak}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">day streak</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-center py-8">No data</p>
            )}
          </div>
        </div>
      </div>

      {feedback && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Citizen Feedback"
            value={feedback.total}
            icon="💬"
            color="primary"
          />
          <StatCard
            label="Positive Responses"
            value={feedback.positive}
            icon="👍"
            color="green"
          />
          <StatCard
            label="Satisfaction Rate"
            value={`${feedback.satisfactionRate}%`}
            icon="⭐"
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
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            📱 WhatsApp Nudge — Engagement Recovery
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Send reminders to low-engagement learners
          </p>
        </div>
        {msg && <span className="text-sm text-green-600 dark:text-green-400 animate-fade-in">{msg}</span>}
      </div>

      {lowPerformers.length > 0 ? (
        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          {lowPerformers.slice(0, 10).map((clerk) => (
            <div key={clerk._id} className="flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-300">
                {clerk.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{clerk.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{clerk.department} • {clerk.currentStreak}d streak</p>
              </div>
              <button
                onClick={() => sendNudge(clerk._id, clerk.name)}
                disabled={sending === clerk._id}
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-all"
              >
                {sending === clerk._id ? "..." : "📲 Nudge"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
          ✅ All learners are engaged! No nudges needed right now.
        </p>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        * Nudges are logged for tracking. Integrate Twilio/WhatsApp API for live delivery.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: "primary" | "blue" | "green" | "purple";
}) {
  const colors = {
    primary: "from-primary-50 to-indigo-50 dark:from-primary-950/50 dark:to-indigo-950/50 border-primary-200 dark:border-primary-800",
    blue: "from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800",
    green: "from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800",
    purple: "from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 border-purple-200 dark:border-purple-800",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} border rounded-3xl p-6`}
    >
      <span className="text-3xl block mb-2">{icon}</span>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
