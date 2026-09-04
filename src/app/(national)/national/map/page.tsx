"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface RegionState {
  name: string;
  abbreviation: string;
  region: "North" | "South" | "East" | "West" | "Central";
  score: number;
  status: "active" | "pilot" | "planned";
  clerks: number;
}

const regionStates: RegionState[] = [
  { name: "Jammu & Kashmir", abbreviation: "JK", region: "North", score: 0, status: "planned", clerks: 0 },
  { name: "Punjab", abbreviation: "PB", region: "North", score: 0, status: "planned", clerks: 0 },
  { name: "Delhi", abbreviation: "DL", region: "North", score: 79, status: "active", clerks: 65 },
  { name: "Rajasthan", abbreviation: "RJ", region: "North", score: 68, status: "pilot", clerks: 28 },
  { name: "Uttar Pradesh", abbreviation: "UP", region: "North", score: 0, status: "planned", clerks: 0 },
  { name: "Madhya Pradesh", abbreviation: "MP", region: "Central", score: 61, status: "pilot", clerks: 18 },
  { name: "Chhattisgarh", abbreviation: "CG", region: "Central", score: 0, status: "planned", clerks: 0 },
  { name: "Gujarat", abbreviation: "GJ", region: "West", score: 87, status: "active", clerks: 145 },
  { name: "Maharashtra", abbreviation: "MH", region: "West", score: 82, status: "active", clerks: 98 },
  { name: "Goa", abbreviation: "GA", region: "West", score: 0, status: "planned", clerks: 0 },
  { name: "Karnataka", abbreviation: "KA", region: "South", score: 75, status: "pilot", clerks: 42 },
  { name: "Tamil Nadu", abbreviation: "TN", region: "South", score: 73, status: "pilot", clerks: 38 },
  { name: "Kerala", abbreviation: "KL", region: "South", score: 0, status: "planned", clerks: 0 },
  { name: "Andhra Pradesh", abbreviation: "AP", region: "South", score: 0, status: "planned", clerks: 0 },
  { name: "West Bengal", abbreviation: "WB", region: "East", score: 64, status: "pilot", clerks: 22 },
  { name: "Odisha", abbreviation: "OD", region: "East", score: 0, status: "planned", clerks: 0 },
  { name: "Bihar", abbreviation: "BR", region: "East", score: 0, status: "planned", clerks: 0 },
  { name: "Assam", abbreviation: "AS", region: "East", score: 0, status: "planned", clerks: 0 },
];

const regions = [
  { name: "North", icon: "🏔️", states: 5, active: 1, color: "bg-blue-400" },
  { name: "South", icon: "🌴", states: 4, active: 2, color: "bg-green-400" },
  { name: "East", icon: "🌊", states: 4, active: 1, color: "bg-teal-400" },
  { name: "West", icon: "🏖️", states: 3, active: 2, color: "bg-gold-400" },
  { name: "Central", icon: "🏛️", states: 2, active: 1, color: "bg-purple-400" },
];

export default function MapPage() {
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const filtered = selectedRegion
    ? regionStates.filter((s) => s.region === selectedRegion)
    : regionStates;

  const getStatusColor = (s: RegionState) => {
    if (s.status === "planned") return "bg-white/10 text-white/20";
    if (s.score >= 80) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (s.score >= 70) return "bg-gold-500/20 text-gold-400 border-gold-500/30";
    return "bg-white/10 text-white/50 border-white/10";
  };

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-1">National Map View</h1>
          <p className="text-white/50">Geographic accessibility overview across India</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card variant="spatial" className="lg:col-span-2">
            <h3 className="font-bold text-white mb-4">India — State Coverage</h3>
            <div className="bg-navy-950/80 rounded-xl p-6 overflow-x-auto">
              <pre className="text-[10px] sm:text-xs leading-relaxed text-white/50 font-mono whitespace-pre">
{`
                        ╔══════════════╗
                    ╔═══╝   JAMMU &    ╚══╗
                ╔═══╝       KASHMIR       ╚══╗
            ╔═══╝  PUNJAB    ╔══════╗  UTTAR  ╚══╗
            ║     ╔═══════╗   ║ DELHI║  PRADESH   ║
        ╔═══╝     ║RAJASTHAN║  ╚══════╝            ║
        ║     ╔═══╝════════╝  ╔═══════════╗  ╔════╝
        ║     ║              ║    MADHYA   ║  ║
    ╔═══╝  ╔═══╗    GUJARAT  ║  PRADESH   ║  ║  BIHAR
    ║      ║ GOA║═════════════╬════════════╝  ║  ╔══╗
    ║  ╔═══╝    ║ MAHARASHTRA ║              ║  ║  ║
    ║  ║  ╔═══════════════════╝   ╔══════════╝  ║  ║ WEST
    ║  ║  ║    ╔═══════════════╗  ║         ╔════╝  ║ BENGAL
    ║  ║  ║    ║   KARNATAKA   ║  ║         ║ ODISHA║
    ║  ║  ║    ╚═══════════════╝  ║         ╚═══════╝
    ║  ║  ║  ╔═════════════════╗  ║  ╔════════════╗
    ║  ║  ║  ║   TAMIL NADU    ║  ║  ║    ASSAM   ║
    ╚══╝  ╚══╣  ╔══════════════╝  ║  ╚════════════╝
              ║  ║   KERALA        ║
              ╚══╬═════════════════╝
                 ╚═════════════════╝
`}
              </pre>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-500/40" /><span className="text-white/50">Active (80+)</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-gold-500/40" /><span className="text-white/50">Pilot (70-79)</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-white/10" /><span className="text-white/50">Planned</span></div>
            </div>
          </Card>

          <Card variant="spatial">
            <h3 className="font-bold text-white mb-4">Regional Summary</h3>
            <div className="space-y-3">
              {regions.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setSelectedRegion(selectedRegion === r.name ? null : r.name)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedRegion === r.name ? "bg-gold-400/15 border border-gold-400/30" : "bg-white/5 hover:bg-white/8 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{r.icon}</span>
                      <span className="text-sm font-semibold text-white">{r.name}</span>
                    </div>
                    <Badge variant={r.active > 1 ? "green" : r.active > 0 ? "blue" : "default"}>
                      {r.active}/{r.states}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${r.color} rounded-full`} style={{ width: `${(r.active / r.states) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-white/40">{Math.round((r.active / r.states) * 100)}%</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">State List</h3>
            {selectedRegion && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedRegion(null)}>
                Clear Filter
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((state) => (
              <div
                key={state.abbreviation}
                className={`p-3 rounded-xl border transition-all cursor-pointer hover:bg-white/5 ${getStatusColor(state)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold opacity-60">{state.abbreviation}</span>
                    <span className="text-sm font-medium text-white">{state.name}</span>
                  </div>
                  <Badge variant={state.status === "active" ? "green" : state.status === "pilot" ? "blue" : "default"}>
                    {state.status}
                  </Badge>
                </div>
                {state.status !== "planned" && (
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-white/40">{state.clerks} clerks</span>
                    <span className={`font-semibold ${state.score >= 80 ? "text-green-400" : state.score >= 70 ? "text-gold-400" : "text-white/60"}`}>
                      {state.score}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
