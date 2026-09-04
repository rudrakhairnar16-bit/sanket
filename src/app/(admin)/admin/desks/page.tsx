"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTenant } from "@/lib/tenant-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/state/LoadingState";

const adminRoles = ["dept_admin", "org_admin", "state_admin", "national_admin", "super_admin"];

interface Desk {
  _id: string;
  clerks: { _id: string; name: string; username: string; status: string }[];
  clerkCount: number;
  activeClerks: number;
}

export default function DesksPage() {
  const { user, loading } = useAuth();
  const { orgName, stateName } = useTenant();
  const router = useRouter();
  const [desks, setDesks] = useState<Desk[]>([]);
  const [loadingDesks, setLoadingDesks] = useState(true);

  React.useEffect(() => {
    if (!loading && (!user || !adminRoles.includes(user.role))) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !adminRoles.includes(user.role)) return;
    setLoadingDesks(true);
    fetch("/api/admin/desks")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setDesks(d.desks);
      })
      .catch(() => {})
      .finally(() => setLoadingDesks(false));
  }, [user, loading]);

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
          <h1 className="text-3xl font-bold text-white mb-1">Desks</h1>
          <p className="text-white/50">Scoped to: {scopeLabel}</p>
        </div>

        {loadingDesks ? (
          <LoadingState />
        ) : desks.length === 0 ? (
          <Card>
            <p className="text-white/40 text-sm text-center py-8">No desks found. Desk management — assign clerks to service counters.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {desks.map((desk) => (
              <Card key={desk._id} variant="spatial" hover>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white">Desk {desk._id}</h3>
                  <Badge variant="teal">{desk.clerkCount} clerks</Badge>
                </div>
                <div className="space-y-2">
                  {desk.clerks.map((clerk) => (
                    <div key={clerk._id} className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        {clerk.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{clerk.name}</p>
                        <p className="text-xs text-white/40">@{clerk.username}</p>
                      </div>
                      <Badge variant={clerk.status === "active" ? "green" : "red"}>{clerk.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
