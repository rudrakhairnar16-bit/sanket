"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

interface StateData {
  _id: string;
  name: string;
  region: "North" | "South" | "East" | "West" | "Central";
  clerks: number;
  sessions: number;
  score: number;
  status: "pilot" | "pilot" | "planned";
  cities: string[];
}

const mockStates: StateData[] = [
  { _id: "st-1", name: "Gujarat", region: "West", clerks: 145, sessions: 320, score: 87, status: "pilot", cities: ["Vadodara", "Ahmedabad", "Surat"] },
  { _id: "st-2", name: "Maharashtra", region: "West", clerks: 98, sessions: 210, score: 82, status: "pilot", cities: ["Mumbai", "Pune", "Nagpur"] },
  { _id: "st-3", name: "Delhi", region: "North", clerks: 65, sessions: 180, score: 79, status: "pilot", cities: ["New Delhi"] },
  { _id: "st-4", name: "Karnataka", region: "South", clerks: 42, sessions: 95, score: 75, status: "pilot", cities: ["Bangalore", "Mysore"] },
  { _id: "st-5", name: "Tamil Nadu", region: "South", clerks: 38, sessions: 88, score: 73, status: "pilot", cities: ["Chennai", "Coimbatore"] },
  { _id: "st-6", name: "Rajasthan", region: "North", clerks: 28, sessions: 62, score: 68, status: "pilot", cities: ["Jaipur", "Jodhpur"] },
  { _id: "st-7", name: "West Bengal", region: "East", clerks: 22, sessions: 45, score: 64, status: "pilot", cities: ["Kolkata"] },
  { _id: "st-8", name: "Madhya Pradesh", region: "Central", clerks: 18, sessions: 38, score: 61, status: "pilot", cities: ["Bhopal", "Indore"] },
];

const regions = ["All", "North", "South", "East", "West", "Central"] as const;

export default function StatesPage() {
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"score" | "clerks" | "sessions">("score");

  const filtered = mockStates
    .filter((s) => selectedRegion === "All" || s.region === selectedRegion)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const totalClerks = filtered.reduce((a, b) => a + b.clerks, 0);
  const totalSessions = filtered.reduce((a, b) => a + b.sessions, 0);
  const avgScore = filtered.length > 0 ? Math.round(filtered.reduce((a, b) => a + b.score, 0) / filtered.length) : 0;

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8 animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/5 px-3 py-1.5 text-[11px] font-semibold text-gold-300">SIMULATION · NO LIVE STATE DEPLOYMENT CLAIM</div>
          <h1 className="text-3xl font-bold text-white mb-1">State Dashboard</h1>
          <p className="text-white/50">State-scale design simulation — illustrative data, not live deployment</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="States Shown" value={filtered.length} icon="🗺️" />
          <StatCard label="Total Clerks" value={totalClerks} icon="👥" trend="up" trendValue="Across filtered" />
          <StatCard label="Avg Score" value={`${avgScore}%`} icon="📊" />
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedRegion === r ? "bg-gold-400/20 text-gold-400 border border-gold-400/30" : "text-white/50 hover:bg-white/10 border border-transparent"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 ml-auto">
            {(["score", "clerks", "sessions"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  sortBy === s ? "bg-teal-400/20 text-teal-400 border border-teal-400/30" : "text-white/50 hover:bg-white/10 border border-transparent"
                }`}
              >
                Sort: {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((state) => (
            <Card key={state._id} variant="spatial" hover className="flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-white text-lg">{state.name}</h3>
                  <p className="text-xs text-white/40">{state.region} Region</p>
                </div>
                <Badge variant={state.status === "pilot" ? "blue" : "default"}>
                  {state.status}
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/40">Sugamya Score</span>
                  <span className={`text-sm font-bold ${state.score >= 80 ? "text-green-400" : state.score >= 70 ? "text-gold-400" : "text-red-400"}`}>
                    {state.score}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      state.score >= 80 ? "bg-green-400" : state.score >= 70 ? "bg-gold-400" : "bg-red-400"
                    }`}
                    style={{ width: `${state.score}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <p className="text-lg font-bold text-teal-400">{state.clerks}</p>
                  <p className="text-[10px] text-white/40">Clerks</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <p className="text-lg font-bold text-gold-400">{state.sessions}</p>
                  <p className="text-[10px] text-white/40">Sessions</p>
                </div>
              </div>

              <div className="mt-auto">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Key Cities</p>
                <div className="flex flex-wrap gap-1">
                  {state.cities.map((c) => (
                    <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50">{c}</span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
