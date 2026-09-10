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

const deptColors: Record<string, "gold" | "teal" | "blue" | "green" | "red"> = {
  "Water Services": "teal",
  "Property Services": "blue",
  "Citizen Certificates": "gold",
  "General Services": "green",
};

interface ServicePack {
  _id: string;
  serviceName: string;
  department: string;
  supportedSigns: string[];
  commonReplies: string[];
  escalationRules: string[];
  active: boolean;
}

export default function ServicePacksPage() {
  const { user, loading } = useAuth();
  const { orgName, stateName } = useTenant();
  const router = useRouter();
  const [packs, setPacks] = useState<ServicePack[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, totalSigns: 0, totalReplies: 0 });
  const reload = async () => { const r=await fetch("/api/admin/service-packs"); const d=await r.json(); if(d.success){setPacks(d.packs);setStats(d.stats);} };
  const createPack = async () => { const serviceName=window.prompt("Service pack name","Citizen Assistance")?.trim(); if(!serviceName)return; const department=user?.department||"General Citizen Services"; const r=await fetch("/api/admin/service-packs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serviceName,department,supportedSigns:["help","please","wait"],commonReplies:["Please wait a moment."],escalationRules:["Low AI confidence"]})}); const d=await r.json(); if(!r.ok||!d.success){alert(d.error||"Could not create service pack");return;} await reload(); };
  const editPack = async (pack: ServicePack) => { const serviceName=window.prompt("Rename service pack",pack.serviceName)?.trim(); if(!serviceName||serviceName===pack.serviceName)return; const r=await fetch("/api/admin/service-packs",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:pack._id,serviceName})}); const d=await r.json(); if(!r.ok||!d.success){alert(d.error||"Could not update service pack");return;} await reload(); };

  useEffect(() => {
    if (!loading && (!user || !adminRoles.includes(user.role))) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !adminRoles.includes(user.role)) return;
    setLoadingPacks(true);
    fetch("/api/admin/service-packs")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPacks(d.packs);
          setStats(d.stats);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingPacks(false));
  }, [user, loading]);

  if (loading || !user) return <LoadingState />;

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
            <h1 className="text-3xl font-bold text-white mb-1">Service Packs</h1>
            <p className="text-white/50">Scoped to: {scopeLabel}</p>
          </div>
          <Button variant="primary" icon={<span>+</span>} onClick={createPack}>Create Pack</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Packs" value={stats.total} icon="📦" />
          <StatCard label="Active Packs" value={stats.active} icon="✅" trend="up" trendValue={`${stats.active} active`} />
          <StatCard label="Supported Signs" value={stats.totalSigns} icon="🤟" />
          <StatCard label="Common Replies" value={stats.totalReplies} icon="💬" />
        </div>

        {loadingPacks ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packs.map((pack) => (
              <Card key={pack._id} variant="spatial" hover className="group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                      📦
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{pack.serviceName}</h3>
                    </div>
                  </div>
                  <Badge variant={deptColors[pack.department] || "default"}>
                    {pack.department}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-white/5 text-center">
                    <p className="text-lg font-bold text-teal-400">{pack.supportedSigns.length}</p>
                    <p className="text-xs text-white/40">Signs</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 text-center">
                    <p className="text-lg font-bold text-gold-400">{pack.commonReplies.length}</p>
                    <p className="text-xs text-white/40">Replies</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 text-center">
                    <p className="text-lg font-bold text-blue-400">{pack.escalationRules.length}</p>
                    <p className="text-xs text-white/40">Rules</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/40">Status</span>
                  <Badge variant={pack.active ? "green" : "red"}>{pack.active ? "Active" : "Inactive"}</Badge>
                </div>

                {expandedId === pack._id && (
                  <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/40 mb-2 font-medium">Supported Signs</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.supportedSigns.map((sign) => (
                        <Badge key={sign} variant="teal">{sign}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => setExpandedId(expandedId === pack._id ? null : pack._id)}
                  >
                    {expandedId === pack._id ? "Hide Signs" : "View Signs"}
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => editPack(pack)}>Edit</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
