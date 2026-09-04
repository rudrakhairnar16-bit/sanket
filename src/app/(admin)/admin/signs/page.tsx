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

const reviewStatusConfig: Record<string, { variant: "green" | "gold" | "blue"; label: string }> = {
  approved: { variant: "green", label: "Approved" },
  "under-review": { variant: "gold", label: "Under Review" },
  draft: { variant: "blue", label: "Draft" },
};

const categoryColors: Record<string, string> = {
  Greetings: "from-pink-500 to-rose-500",
  Basic: "from-teal-500 to-emerald-500",
  Services: "from-blue-500 to-cyan-500",
  Documents: "from-gold-400 to-amber-500",
  Civic: "from-purple-500 to-violet-500",
  "Daily Life": "from-orange-500 to-red-500",
};

interface Sign {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  reviewStatus: string;
  symbol: string;
  handCount: number;
  version: number;
  description: string;
  keywords: string[];
}

export default function SignsPage() {
  const { user, loading } = useAuth();
  const { orgName, stateName } = useTenant();
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [signs, setSigns] = useState<Sign[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingSigns, setLoadingSigns] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !adminRoles.includes(user.role))) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !adminRoles.includes(user.role)) return;
    const params = new URLSearchParams();
    if (filterCategory !== "all") params.set("category", filterCategory);
    if (filterStatus !== "all") params.set("status", filterStatus);
    if (searchQuery) params.set("search", searchQuery);

    setLoadingSigns(true);
    fetch(`/api/admin/signs?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSigns(d.signs);
          setCategories(d.categories || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingSigns(false));
  }, [user, loading, filterCategory, filterStatus, searchQuery]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const approvedCount = signs.filter((s) => s.reviewStatus === "approved").length;
  const reviewCount = signs.filter((s) => s.reviewStatus === "under-review").length;
  const draftCount = signs.filter((s) => s.reviewStatus === "draft").length;

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
            <h1 className="text-3xl font-bold text-white mb-1">Sign Library</h1>
            <p className="text-white/50">Scoped to: {scopeLabel}</p>
          </div>
          <Button variant="primary" icon={<span>+</span>}>
            Add Sign
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Signs" value={signs.length} icon="🤟" />
          <StatCard label="Approved" value={approvedCount} icon="✅" trend="up" trendValue={signs.length > 0 ? `${Math.round((approvedCount / signs.length) * 100)}% approved` : "0%"} />
          <StatCard label="Under Review" value={reviewCount} icon="🔍" />
          <StatCard label="Drafts" value={draftCount} icon="📝" />
        </div>

        {categories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(filterCategory === cat.name ? "all" : cat.name)}
                className={`p-3 rounded-xl text-center transition-all ${
                  filterCategory === cat.name
                    ? "bg-gold-400 text-navy-900"
                    : "glass-card text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-xl block mb-1">{cat.icon}</span>
                <p className="text-xs font-medium">{cat.name}</p>
                <p className="text-xs opacity-60">{cat.count}</p>
              </button>
            ))}
          </div>
        )}

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, Hindi name, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "approved", "under-review", "draft"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterStatus === status
                      ? "bg-gold-400 text-navy-900"
                      : "glass-card text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {status === "all" ? "All" : status === "under-review" ? "Under Review" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {loadingSigns ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {signs.map((sign) => {
              const statusCfg = reviewStatusConfig[sign.reviewStatus];
              return (
                <Card key={sign.id} variant="spatial" hover className="group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl group-hover:scale-110 transition-transform">
                      {sign.symbol}
                    </div>
                    <Badge variant={statusCfg?.variant || "default"}>{statusCfg?.label || sign.reviewStatus}</Badge>
                  </div>

                  <h3 className="font-bold text-white text-lg mb-0.5">{sign.name}</h3>
                  <p className="text-sm text-white/40 mb-3">{sign.nameHi}</p>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 rounded-xl bg-white/5 text-center">
                      <p className="text-xs text-white/40">Category</p>
                      <p className="text-sm font-semibold text-white">{sign.category}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 text-center">
                      <p className="text-xs text-white/40">Hands</p>
                      <p className="text-sm font-semibold text-teal-400">{sign.handCount}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-white/40 mb-1">Version {sign.version}</p>
                    <p className="text-xs text-white/50">{sign.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {sign.keywords.slice(0, 3).map((kw) => (
                      <Badge key={kw} variant="teal">{kw}</Badge>
                    ))}
                    {sign.keywords.length > 3 && (
                      <Badge variant="default">+{sign.keywords.length - 3}</Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <Button variant="secondary" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      Review
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {!loadingSigns && signs.length === 0 && (
          <Card>
            <p className="text-center text-white/40 py-8">No signs found matching your criteria.</p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
