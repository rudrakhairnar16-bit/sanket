"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTenant } from "@/lib/tenant-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingState } from "@/components/state/LoadingState";

const adminRoles = ["dept_admin", "org_admin", "state_admin", "national_admin", "super_admin"];

const reportTypes = [
  {
    id: "monthly",
    title: "Monthly Accessibility Report",
    titleHi: "मासिक पहुँच रिपोर्ट",
    description: "Comprehensive monthly Sugamya Score breakdown, session metrics, and accessibility compliance status.",
    icon: "📊",
    format: "PDF",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "performance",
    title: "Staff Performance Report",
    titleHi: "कर्मचारी प्रदर्शन रिपोर्ट",
    description: "Individual clerk performance metrics, XP progression, streaks, and ISL proficiency levels.",
    icon: "👥",
    format: "PDF",
    color: "from-teal-500 to-emerald-500",
  },
  {
    id: "sessions",
    title: "Session Summary Report",
    titleHi: "सत्र सारांश रिपोर्ट",
    description: "Detailed session analytics including outcomes, confidence levels, escalation rates, and service distribution.",
    icon: "🤝",
    format: "CSV",
    color: "from-gold-400 to-amber-500",
  },
  {
    id: "feedback",
    title: "Citizen Feedback Report",
    titleHi: "नागरिक प्रतिक्रिया रिपोर्ट",
    description: "Feedback analysis with ratings, sentiment, ISL attempt rates, and improvement trends.",
    icon: "💬",
    format: "PDF",
    color: "from-purple-500 to-violet-500",
  },
];

export default function ReportsPage() {
  const { user, loading } = useAuth();
  const { orgName, stateName } = useTenant();
  const router = useRouter();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !adminRoles.includes(user.role))) router.push("/login");
  }, [user, loading, router]);

  const fetchReport = async (type: string) => {
    setLoadingReport(true);
    try {
      const res = await fetch(`/api/admin/reports?type=${type}`);
      const data = await res.json();
      if (data.success) setReportData(data.report);
    } catch {}
    setLoadingReport(false);
  };

  const handleDownload = (reportId: string) => {
    setDownloading(reportId);
    fetchReport(reportId);
    setTimeout(() => {
      setDownloading(null);
    }, 1500);
  };

  if (loading) return <LoadingState />;
  if (!user) return null;

  const scopeLabel = user.role === "state_admin"
    ? `State: ${stateName || "All"}`
    : user.role === "national_admin" || user.role === "super_admin"
    ? "National"
    : `Org: ${orgName || "All"}`;

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Reports</h1>
          <p className="text-white/50">Scoped to: {scopeLabel}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Report Types" value={reportTypes.length} icon="📄" />
          <StatCard label="Generated" value={reportData ? "1" : "0"} icon="✅" trend="up" trendValue="this session" />
        </div>

        {reportData && (
          <Card className="mb-8">
            <h3 className="font-bold text-white mb-4">Latest Report: {reportData.type}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/40">Total Staff</p>
                <p className="text-lg font-bold text-white">{reportData.summary?.totalClerks || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/40">Total Sessions</p>
                <p className="text-lg font-bold text-teal-400">{reportData.summary?.totalSessions || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/40">Feedback</p>
                <p className="text-lg font-bold text-gold-400">{reportData.summary?.totalFeedback || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/40">Avg Rating</p>
                <p className="text-lg font-bold text-blue-400">{reportData.summary?.avgRating || 0}⭐</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => (
            <Card key={report.id} variant="spatial" hover className="group">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${report.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {report.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{report.title}</h3>
                  <p className="text-xs text-white/40">{report.titleHi}</p>
                </div>
                <Badge variant="blue">{report.format}</Badge>
              </div>

              <p className="text-sm text-white/50 mb-4">{report.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <span>Generated on demand</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  loading={downloading === report.id}
                  onClick={() => handleDownload(report.id)}
                >
                  {downloading === report.id ? "Generating..." : "Download"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
