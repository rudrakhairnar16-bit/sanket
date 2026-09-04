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

interface AuditEntry {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  result: string;
  details?: string;
  timestamp: string;
}

const actionIcons: Record<string, string> = {
  Login: "🔑",
  "Session Started": "🤝",
  "Feedback Submitted": "💬",
  "Settings Changed": "⚙️",
  "Content Updated": "📚",
  "Staff Updated": "👥",
  feedback_submitted: "💬",
};

const categoryBadgeVariant: Record<string, "teal" | "gold" | "blue" | "green" | "red"> = {
  auth: "red",
  session: "teal",
  feedback: "gold",
  settings: "blue",
  content: "green",
};

export default function AuditPage() {
  const { user, loading } = useAuth();
  const { orgName, stateName } = useTenant();
  const router = useRouter();
  const [filterAction, setFilterAction] = useState("all");
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [stats, setStats] = useState({ total: 0, successCount: 0, failedCount: 0, uniqueUsers: 0, actionTypes: [] as string[] });
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !adminRoles.includes(user.role))) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !adminRoles.includes(user.role)) return;
    const params = new URLSearchParams();
    if (filterAction !== "all") params.set("action", filterAction);

    setLoadingLogs(true);
    fetch(`/api/admin/audit?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setLogs(d.logs);
          setStats(d.stats);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingLogs(false));
  }, [user, loading, filterAction]);

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
          <h1 className="text-3xl font-bold text-white mb-1">Audit Log</h1>
          <p className="text-white/50">Scoped to: {scopeLabel}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Events" value={stats.total} icon="📜" />
          <StatCard label="Successful" value={stats.successCount} icon="✅" trend="up" trendValue={stats.total > 0 ? `${Math.round((stats.successCount / stats.total) * 100)}% success` : "0%"} />
          <StatCard label="Failed" value={stats.failedCount} icon="❌" trend={stats.failedCount > 0 ? "down" : "neutral"} trendValue={`${stats.failedCount} failures`} />
          <StatCard label="Unique Users" value={stats.uniqueUsers} icon="👥" />
        </div>

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex gap-2 flex-wrap flex-1">
              <button
                onClick={() => setFilterAction("all")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterAction === "all"
                    ? "bg-gold-400 text-navy-900"
                    : "glass-card text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                All Actions
              </button>
              {stats.actionTypes.map((action) => (
                <button
                  key={action}
                  onClick={() => setFilterAction(action)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterAction === action
                      ? "bg-gold-400 text-navy-900"
                      : "glass-card text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {actionIcons[action] || "📌"} {action}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm">
              Export Log
            </Button>
          </div>
        </Card>

        <Card>
          {loadingLogs ? (
            <LoadingState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Timestamp</th>
                    <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">User</th>
                    <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Action</th>
                    <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Details</th>
                    <th className="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white/50 text-xs">
                        {new Date(log.timestamp).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                            {log.userName?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{log.userName}</p>
                            <p className="text-xs text-white/30">@{log.userId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{actionIcons[log.action] || "📌"}</span>
                          <p className="text-white font-medium text-sm">{log.action}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/60 text-sm max-w-xs">{log.details || log.target}</td>
                      <td className="py-3 px-4">
                        <Badge variant={log.result === "success" ? "green" : "red"}>
                          {log.result}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loadingLogs && logs.length === 0 && (
            <p className="text-center text-white/40 py-8">No audit logs found matching your criteria.</p>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
