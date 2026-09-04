"use client";

import React, { useEffect, useState, useMemo } from "react";
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

const roleBadgeColors: Record<string, "gold" | "teal" | "blue" | "green" | "red"> = {
  clerk: "teal",
  dept_admin: "gold",
  org_admin: "blue",
  state_admin: "teal",
  national_admin: "green",
  super_admin: "red",
};

interface StaffMember {
  _id: string;
  name: string;
  username: string;
  department: string;
  role: string;
  status: string;
  currentStreak: number;
  islXp: number;
  islLevel: number;
}

export default function StaffPage() {
  const { user, loading } = useAuth();
  const { orgName, stateName } = useTenant();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !adminRoles.includes(user.role))) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !adminRoles.includes(user.role)) return;
    const params = new URLSearchParams();
    if (filterRole !== "all") params.set("role", filterRole);
    if (filterStatus !== "all") params.set("status", filterStatus);
    if (search) params.set("search", search);

    setLoadingStaff(true);
    fetch(`/api/admin/staff?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStaff(d.staff);
      })
      .catch(() => setStaff([]))
      .finally(() => setLoadingStaff(false));
  }, [user, loading, filterRole, filterStatus, search]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const activeCount = staff.filter((u) => u.status === "active").length;
  const clerkCount = staff.filter((u) => u.role === "clerk").length;
  const totalXp = staff.filter((u) => u.role === "clerk").reduce((a, c) => a + c.islXp, 0);
  const avgLevel = clerkCount > 0 ? Math.round(staff.filter((u) => u.role === "clerk").reduce((a, c) => a + c.islLevel, 0) / clerkCount) : 0;

  const scopeLabel = user.role === "state_admin"
    ? `State: ${stateName || "All"}`
    : user.role === "national_admin" || user.role === "super_admin"
    ? "National"
    : `Org: ${orgName || "All"}`;

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Staff Management</h1>
          <p className="text-white/50">Scoped to: {scopeLabel}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Staff" value={staff.length} icon="👥" trend="up" trendValue={`${staff.length} registered`} />
          <StatCard label="Active" value={activeCount} icon="✅" trend="up" trendValue={staff.length > 0 ? `${Math.round((activeCount / staff.length) * 100)}% active` : "0% active"} />
          <StatCard label="Total XP Earned" value={totalXp} icon="⭐" trend="up" trendValue="across clerks" />
          <StatCard label="Avg Level" value={avgLevel} icon="📈" trend="up" trendValue="clerk average" />
        </div>

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, department, or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="input-field"
              >
                <option value="all">All Roles</option>
                <option value="clerk">Clerks</option>
                <option value="interpreter">Interpreters</option>
                <option value="dept_admin">Dept Admin</option>
                <option value="org_admin">Org Admin</option>
                <option value="state_admin">State Admin</option>
                <option value="national_admin">National Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          {loadingStaff ? (
            <LoadingState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/40 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-white/40 font-medium">Department</th>
                    <th className="text-left py-3 px-4 text-white/40 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-white/40 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-white/40 font-medium">Streak</th>
                    <th className="text-left py-3 px-4 text-white/40 font-medium">XP</th>
                    <th className="text-left py-3 px-4 text-white/40 font-medium">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => (
                    <tr key={s._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{s.name}</p>
                            <p className="text-xs text-white/40">@{s.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/60">{s.department}</td>
                      <td className="py-3 px-4">
                        <Badge variant={roleBadgeColors[s.role] || "default"}>
                          {s.role.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={s.status === "active" ? "green" : s.status === "suspended" ? "red" : "default"}>{s.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-orange-400">🔥</span>
                          <span className="text-white/70">{s.currentStreak}d</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gold-400 font-semibold">{s.islXp}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-400 text-xs font-semibold">
                          Lv.{s.islLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loadingStaff && staff.length === 0 && (
            <div className="text-center py-8 text-white/40">
              No staff found matching your criteria.
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
