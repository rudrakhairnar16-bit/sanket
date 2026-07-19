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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Compliance Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            {user?.role === "superadmin" ? "All departments" : user?.department}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-primary-500 outline-none"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-primary-500 outline-none"
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
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Department Compliance
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="Completions"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No data</p>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Top Performing Clerks
          </h3>
          <div className="space-y-3">
            {data?.leaderboard && data.leaderboard.length > 0 ? (
              data.leaderboard.map((clerk, i) => (
                <div
                  key={clerk._id}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                      i === 0
                        ? "bg-amber-100 text-amber-600"
                        : i === 1
                        ? "bg-slate-100 text-slate-500"
                        : i === 2
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {clerk.name}
                    </p>
                    <p className="text-xs text-gray-400">{clerk.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">
                      {clerk.currentStreak}
                    </p>
                    <p className="text-xs text-gray-400">day streak</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No data</p>
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
    primary: "from-primary-50 to-indigo-50 border-primary-200",
    blue: "from-blue-50 to-cyan-50 border-blue-200",
    green: "from-green-50 to-emerald-50 border-green-200",
    purple: "from-purple-50 to-violet-50 border-purple-200",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} border rounded-3xl p-6`}
    >
      <span className="text-3xl block mb-2">{icon}</span>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
