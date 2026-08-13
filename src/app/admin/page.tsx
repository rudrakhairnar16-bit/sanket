"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { ComplianceChart } from "@/components/admin/ComplianceChart";
import { LeaderboardTable } from "@/components/admin/LeaderboardTable";
import { FeedbackSection } from "@/components/admin/FeedbackSection";
import { ClerkTable } from "@/components/admin/ClerkTable";
import { SugamyaScore } from "@/components/admin/SugamyaScore";

interface DeptCompliance {
  _id: string;
  totalUsers: number;
  totalCompletions: number;
}

interface DashboardData {
  overallCompliance: number;
  totalUsers: number;
  totalCompletions: number;
  escalationsHandled?: number;
  deptCompliance: DeptCompliance[];
  leaderboard: {
    _id: string;
    name: string;
    username: string;
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
    primary: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    blue: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    green: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    purple: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
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
      <div
        className={`w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-3 ${iconColors[color]}`}
      >
        {icons[color]}
      </div>
      <p className="text-2xl font-bold text-surface-900 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-surface-500">{label}</p>
    </div>
  );
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
      (d) => `${d._id},${d.totalUsers},${d.totalCompletions}`,
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
          <button onClick={exportCSV} className="btn-secondary text-xs">
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SugamyaScore
          compliance={data?.overallCompliance ?? 0}
          satisfactionRate={feedback?.satisfactionRate ?? 0}
          totalCompletions={data?.totalCompletions ?? 0}
          escalationsHandled={data?.escalationsHandled ?? 0}
        />
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ComplianceChart data={data?.deptCompliance || []} />
        <LeaderboardTable
          leaderboard={data?.leaderboard || []}
          onRefresh={loadData}
        />
      </div>

      {feedback && <FeedbackSection feedback={feedback} />}

      <ClerkTable />
    </div>
  );
}
