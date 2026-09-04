"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { getSugamyaScoreData, demoSessions, demoFeedback } from "@/lib/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const nationalGrowth = [
  { month: "Jan", sessions: 120, clerks: 45, states: 3 },
  { month: "Feb", sessions: 180, clerks: 62, states: 4 },
  { month: "Mar", sessions: 250, clerks: 85, states: 5 },
  { month: "Apr", sessions: 310, clerks: 110, states: 6 },
  { month: "May", sessions: 420, clerks: 145, states: 7 },
  { month: "Jun", sessions: 480, clerks: 168, states: 8 },
  { month: "Jul", sessions: 550, clerks: 195, states: 9 },
  { month: "Aug", sessions: 620, clerks: 220, states: 10 },
  { month: "Sep", sessions: 710, clerks: 260, states: 11 },
  { month: "Oct", sessions: 830, clerks: 310, states: 12 },
  { month: "Nov", sessions: 920, clerks: 345, states: 13 },
  { month: "Dec", sessions: 1050, clerks: 410, states: 14 },
];

const topStates = [
  { name: "Gujarat", clerks: 145, sessions: 320, score: 87, status: "active" },
  { name: "Maharashtra", clerks: 98, sessions: 210, score: 82, status: "active" },
  { name: "Delhi", clerks: 65, sessions: 180, score: 79, status: "active" },
  { name: "Karnataka", clerks: 42, sessions: 95, score: 75, status: "pilot" },
  { name: "Tamil Nadu", clerks: 38, sessions: 88, score: 73, status: "pilot" },
];

const nationalAlerts = [
  { _id: "a1", title: "Gujarat achieves 95% clerk training completion", type: "milestone", time: "2h ago" },
  { _id: "a2", title: "Maharashtra sugamya score increased by 8 points", type: "improvement", time: "5h ago" },
  { _id: "a3", title: "New ISL signs added for property services", type: "update", time: "1d ago" },
  { _id: "a4", title: "National interpreter pool expanded to 52", type: "expansion", time: "2d ago" },
];

const deploymentStatus = [
  { name: "Phase 1 — Pilot", states: 4, complete: true },
  { name: "Phase 2 — Regional", states: 6, complete: true },
  { name: "Phase 3 — National", states: 4, complete: false },
];

export default function NationalPage() {
  const score = getSugamyaScoreData();

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-1">National Overview</h1>
          <p className="text-white/50">National readiness dashboard — prototype simulation</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/5 px-3 py-1.5 text-[11px] font-semibold text-gold-300">DEMONSTRATION DATA · NOT LIVE GOVERNMENT DEPLOYMENT</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total States" value="14" icon="🗺️" trend="up" trendValue="+3 this quarter" />
          <StatCard label="Total Clerks" value="410" icon="👥" trend="up" trendValue="+65 this month" />
          <StatCard label="Total Sessions" value="1,050" icon="🤝" trend="up" trendValue="+130 this month" />
          <StatCard label="National Score" value={`${score.overall}%`} icon="🏆" trend="up" trendValue="+5 from last month" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card variant="spatial" className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                  strokeDasharray={`${score.overall * 3.27} ${326.7 - score.overall * 3.27}`}
                  strokeLinecap="round" transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f5c842" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{score.overall}</span>
                <span className="text-xs text-white/40">/ 100</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">Sugamya Score</h3>
            <p className="text-xs text-white/40">Composite national metric</p>
          </Card>

          <Card variant="spatial" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">National Growth (12 months)</h3>
              <Badge variant="teal">Sessions & Clerks</Badge>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={nationalGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f1729", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: 12 }}
                    labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                  />
                  <Area type="monotone" dataKey="sessions" stroke="#f5c842" fill="rgba(245,200,66,0.1)" strokeWidth={2} name="Sessions" />
                  <Area type="monotone" dataKey="clerks" stroke="#14b8a6" fill="rgba(20,184,166,0.1)" strokeWidth={2} name="Clerks" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-bold text-white mb-4">Top States</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-white/40 font-medium uppercase tracking-wider pb-3">#</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase tracking-wider pb-3">State</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase tracking-wider pb-3">Clerks</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase tracking-wider pb-3">Sessions</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase tracking-wider pb-3">Score</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase tracking-wider pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topStates.map((s, i) => (
                    <tr key={s.name} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-sm text-white/40 font-bold">{i + 1}</td>
                      <td className="py-3 text-sm text-white font-medium">{s.name}</td>
                      <td className="py-3 text-sm text-white/60">{s.clerks}</td>
                      <td className="py-3 text-sm text-white/60">{s.sessions}</td>
                      <td className="py-3">
                        <span className={`text-sm font-semibold ${s.score >= 80 ? "text-green-400" : s.score >= 70 ? "text-gold-400" : "text-red-400"}`}>{s.score}%</span>
                      </td>
                      <td className="py-3">
                        <Badge variant={s.status === "active" ? "green" : "blue"}>{s.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-white mb-4">National Alerts</h3>
            <div className="space-y-3">
              {nationalAlerts.map((alert) => (
                <div key={alert._id} className="p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm ${
                      alert.type === "milestone" ? "bg-gold-400/15 text-gold-400" :
                      alert.type === "improvement" ? "bg-green-400/15 text-green-400" :
                      alert.type === "expansion" ? "bg-teal-400/15 text-teal-400" :
                      "bg-blue-400/15 text-blue-400"
                    }`}>
                      {alert.type === "milestone" ? "🏆" : alert.type === "improvement" ? "📈" : alert.type === "expansion" ? "🚀" : "📢"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{alert.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {deploymentStatus.map((phase) => (
            <Card key={phase.name} variant="spatial">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white text-sm">{phase.name}</h4>
                <Badge variant={phase.complete ? "green" : "blue"}>{phase.complete ? "Complete" : "In Progress"}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40">{phase.states} states</span>
                <span className="text-xs text-white/60">{phase.complete ? "100%" : "67%"}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${phase.complete ? "bg-green-400" : "bg-gold-400"}`} style={{ width: phase.complete ? "100%" : "67%" }} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
