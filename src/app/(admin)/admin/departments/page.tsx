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

const deptIcons: Record<string, string> = {
  "Water Services": "💧",
  "Citizen Certificates": "📜",
  "Property Services": "🏠",
  "General Services": "🏛️",
};

const deptColors: Record<string, string> = {
  "Water Services": "from-blue-500 to-cyan-500",
  "Citizen Certificates": "from-gold-400 to-amber-500",
  "Property Services": "from-teal-500 to-emerald-500",
  "General Services": "from-purple-500 to-violet-500",
};

interface Department {
  id: string;
  name: string;
  staffCount: number;
  activeStaff: number;
  totalXp: number;
  avgLevel: number;
  feedbackCount: number;
  positiveFeedback: number;
  avgRating: number;
  satisfaction: number;
}

export default function DepartmentsPage() {
  const { user, loading } = useAuth();
  const { orgName, stateName } = useTenant();
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !adminRoles.includes(user.role))) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !adminRoles.includes(user.role)) return;
    setLoadingDepts(true);
    fetch("/api/admin/departments")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setDepartments(d.departments);
      })
      .catch(() => setDepartments([]))
      .finally(() => setLoadingDepts(false));
  }, [user, loading]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const totalDepts = departments.length;
  const totalSessions = departments.reduce((a, d) => a + d.staffCount, 0);
  const avgSatisfaction = departments.length > 0 ? Math.round(departments.reduce((a, d) => a + d.satisfaction, 0) / departments.length) : 0;
  const avgRating = departments.length > 0 ? Math.round(departments.reduce((a, d) => a + d.avgRating, 0) / departments.length * 10) / 10 : 0;

  const scopeLabel = user.role === "state_admin"
    ? `State: ${stateName || "All"}`
    : user.role === "national_admin" || user.role === "super_admin"
    ? "National"
    : `Org: ${orgName || "All"}`;

  return (
    <AppShell>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Department Management</h1>
            <p className="text-white/50">Scoped to: {scopeLabel}</p>
          </div>
          <Button variant="primary" icon={<span>+</span>}>
            Add Department
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Departments" value={totalDepts} icon="🏢" />
          <StatCard label="Total Staff" value={totalSessions} icon="👥" trend="up" trendValue="across departments" />
          <StatCard label="Avg Satisfaction" value={`${avgSatisfaction}%`} icon="😊" trend="up" trendValue="positive feedback" />
          <StatCard label="Avg Rating" value={`${avgRating}⭐`} icon="⭐" trend="up" trendValue="out of 5" />
        </div>

        {loadingDepts ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept) => (
              <Card key={dept.id} variant="spatial" hover className="group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${deptColors[dept.name] || "from-teal-500 to-cyan-500"} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      {deptIcons[dept.name] || "🏢"}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{dept.name}</h3>
                    </div>
                  </div>
                  <Badge variant="green">Active</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-white/40">Staff</p>
                    <p className="text-lg font-bold text-white">{dept.staffCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-white/40">Active</p>
                    <p className="text-lg font-bold text-teal-400">{dept.activeStaff}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-white/40">Feedback</p>
                    <p className="text-lg font-bold text-gold-400">{dept.feedbackCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5">
                    <p className="text-xs text-white/40">Avg Rating</p>
                    <p className="text-lg font-bold text-blue-400">
                      {dept.avgRating > 0 ? `${dept.avgRating}⭐` : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/40">Satisfaction</span>
                    <span className="text-xs font-semibold text-white">{dept.satisfaction}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-gold-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${dept.satisfaction}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    Analytics
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
