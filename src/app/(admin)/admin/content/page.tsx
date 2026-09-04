"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingState } from "@/components/state/LoadingState";
import { mockModules } from "@/lib/mock-modules";

const adminRoles = ["dept_admin", "org_admin", "state_admin", "national_admin", "super_admin"];

const categoryIcons: Record<string, string> = {
  Greetings: "🙏",
  Numbers: "🔢",
  Services: "🏢",
  Documents: "📄",
  Emergency: "🚨",
};

const difficultyColors: Record<string, "green" | "gold" | "red"> = {
  beginner: "green",
  intermediate: "gold",
  advanced: "red",
};

export default function ContentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [modules, setModules] = useState(mockModules);
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    if (!loading && (!user || !adminRoles.includes(user.role))) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const categories = Array.from(new Set(modules.map((m) => m.category)));

  const filtered = modules.filter(
    (m) => filterCategory === "all" || m.category === filterCategory
  );

  const activeCount = modules.filter((m) => m.active).length;
  const totalSigns = modules.reduce((a, m) => a + m.signsIncluded.length, 0);

  const toggleActive = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m._id === id ? { ...m, active: !m.active } : m))
    );
  };

  return (
    <AppShell>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Content Management</h1>
            <p className="text-white/50">Manage ISL learning modules and lessons</p>
          </div>
          <Button variant="primary" icon={<span>+</span>}>
            Add Module
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Modules" value={modules.length} icon="📚" />
          <StatCard label="Active Modules" value={activeCount} icon="✅" trend="up" trendValue={`${activeCount} active`} />
          <StatCard label="Total Signs" value={totalSigns} icon="🤟" />
          <StatCard label="Categories" value={categories.length} icon="📁" />
        </div>

        <Card className="mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterCategory === "all"
                  ? "bg-gold-400 text-navy-900"
                  : "glass-card text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterCategory === cat
                    ? "bg-gold-400 text-navy-900"
                    : "glass-card text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {categoryIcons[cat] || "📁"} {cat}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((mod) => (
            <Card key={mod._id} variant="spatial" hover className="group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                    {categoryIcons[mod.category] || "📚"}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{mod.title}</h3>
                    <p className="text-sm text-white/40">{mod.titleHi}</p>
                  </div>
                </div>
                <Badge variant={difficultyColors[mod.difficulty] || "default"}>
                  {mod.difficulty}
                </Badge>
              </div>

              <p className="text-sm text-white/50 mb-3">{mod.description}</p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2 rounded-xl bg-white/5 text-center">
                  <p className="text-lg font-bold text-teal-400">{mod.signsIncluded.length}</p>
                  <p className="text-xs text-white/40">Signs</p>
                </div>
                <div className="p-2 rounded-xl bg-white/5 text-center">
                  <p className="text-lg font-bold text-gold-400">{mod.options.length}</p>
                  <p className="text-xs text-white/40">Options</p>
                </div>
                <div className="p-2 rounded-xl bg-white/5 text-center">
                  <p className="text-lg font-bold text-blue-400">{mod.estimatedMinutes}m</p>
                  <p className="text-xs text-white/40">Duration</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-white/40 mb-2">Signs Included</p>
                <div className="flex flex-wrap gap-1.5">
                  {mod.signsIncluded.map((sign) => (
                    <Badge key={sign} variant="teal">{sign}</Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/40">Status</span>
                  <button
                    onClick={() => toggleActive(mod._id)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      mod.active ? "bg-teal-500" : "bg-white/20"
                    }`}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{ left: mod.active ? "22px" : "2px" }}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  Preview
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card>
            <p className="text-center text-white/40 py-8">No modules found in this category.</p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
