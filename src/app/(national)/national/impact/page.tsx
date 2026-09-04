"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const bigNumbers = [
  { label: "Citizens Served", value: 12480, icon: "🤝", suffix: "+", color: "text-gold-400" },
  { label: "Clerks Trained", value: 410, icon: "📚", suffix: "", color: "text-teal-400" },
  { label: "Sessions Completed", value: 8920, icon: "✅", suffix: "+", color: "text-green-400" },
  { label: "Sign Types Used", value: 34, icon: "🤟", suffix: "", color: "text-blue-400" },
];

const monthlyImpact = [
  { month: "Jan", citizens: 420, sessions: 380, training: 45 },
  { month: "Feb", citizens: 580, sessions: 510, training: 62 },
  { month: "Mar", citizens: 720, sessions: 640, training: 85 },
  { month: "Apr", citizens: 910, sessions: 790, training: 110 },
  { month: "May", citizens: 1080, sessions: 950, training: 145 },
  { month: "Jun", citizens: 1240, sessions: 1100, training: 168 },
  { month: "Jul", citizens: 1420, sessions: 1260, training: 195 },
  { month: "Aug", citizens: 1580, sessions: 1400, training: 220 },
  { month: "Sep", citizens: 1720, sessions: 1520, training: 260 },
  { month: "Oct", citizens: 1890, sessions: 1680, training: 310 },
  { month: "Nov", citizens: 2050, sessions: 1820, training: 345 },
  { month: "Dec", citizens: 2200, sessions: 1980, training: 410 },
];

const successStories = [
  {
    _id: "ss-1",
    title: "Example — Water Tax Interaction",
    description: "Illustrative journey: a Deaf citizen uses supported ISL communication to complete a water-tax interaction at a municipal counter.",
    clerk: "Ramesh Patel",
    state: "Gujarat",
    improvement: "Target outcome: fewer clarification loops",
  },
  {
    _id: "ss-2",
    title: "Example — Birth Certificate Access",
    description: "Illustrative journey: a clerk uses supported visual guidance and escalation to help a citizen with a certificate request.",
    clerk: "Sita Sharma",
    state: "Gujarat",
    improvement: "Target outcome: clearer handoff",
  },
  {
    _id: "ss-3",
    title: "Example — Property Tax Assistance",
    description: "Illustrative journey: a property-tax interaction uses the service-pack workflow, with human escalation available when needed.",
    clerk: "Amit Shah",
    state: "Rajasthan",
    improvement: "Target outcome: accessible service flow",
  },
];

const beforeAfter = [
  { before: "Illustrative baseline — 45 min", after: "Illustrative target — 12 min", metric: "Visit Duration", improvement: "Target — validate in pilot" },
  { before: "Illustrative baseline — 60%", after: "Illustrative target — 15%", metric: "Interpreter Dependency", improvement: "Target — validate in pilot" },
  { before: "Illustrative baseline — 2.1/5", after: "Illustrative target — 4.6/5", metric: "Citizen Satisfaction", improvement: "Target — validate in pilot" },
  { before: "Illustrative baseline — 3 visits", after: "Illustrative target — 1.2 visits", metric: "Return Visits", improvement: "Target — validate in pilot" },
];

const accessibilityMetrics = [
  { label: "Sign Language Support", value: 92, color: "bg-green-400" },
  { label: "Clerk Readiness", value: 87, color: "bg-teal-400" },
  { label: "Digital Accessibility", value: 78, color: "bg-gold-400" },
  { label: "Physical Accessibility", value: 65, color: "bg-blue-400" },
  { label: "Language Coverage", value: 84, color: "bg-purple-400" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function ImpactPage() {
  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8 animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/5 px-3 py-1.5 text-[11px] font-semibold text-gold-300">ILLUSTRATIVE DATA · REPLACE WITH VERIFIED PILOT RESULTS</div>
          <h1 className="text-3xl font-bold text-white mb-1">Impact Metrics</h1>
          <p className="text-white/50">Prototype impact model — illustrative scenario, not measured field results</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {bigNumbers.map((item) => (
            <Card key={item.label} variant="spatial" className="text-center">
              <p className="text-3xl mb-2">{item.icon}</p>
              <p className={`text-3xl font-bold ${item.color}`}>
                <AnimatedCounter target={item.value} suffix={item.suffix} />
              </p>
              <p className="text-xs text-white/40 mt-1">{item.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card variant="spatial" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Monthly Impact Growth</h3>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-gold-400" /><span className="text-white/50">Citizens</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-teal-400" /><span className="text-white/50">Sessions</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-blue-400" /><span className="text-white/50">Training</span></div>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyImpact}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f1729", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: 12 }}
                    labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                  />
                  <Bar dataKey="citizens" name="Citizens Served" radius={[4, 4, 0, 0]}>
                    {monthlyImpact.map((_, i) => (
                      <Cell key={i} fill={i === monthlyImpact.length - 1 ? "#f5c842" : "rgba(245,200,66,0.3)"} />
                    ))}
                  </Bar>
                  <Bar dataKey="sessions" name="Sessions" radius={[4, 4, 0, 0]}>
                    {monthlyImpact.map((_, i) => (
                      <Cell key={i} fill={i === monthlyImpact.length - 1 ? "#14b8a6" : "rgba(20,184,166,0.3)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card variant="spatial">
            <h3 className="font-bold text-white mb-4">Accessibility Score</h3>
            <div className="space-y-4">
              {accessibilityMetrics.map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/60">{m.label}</span>
                    <span className="text-xs font-semibold text-white">{m.value}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full transition-all duration-1000`} style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-bold text-white mb-4">Before & After Sanket</h3>
            <div className="space-y-3">
              {beforeAfter.map((item) => (
                <div key={item.metric} className="p-3 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{item.metric}</span>
                    <Badge variant="green">{item.improvement}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-[10px] text-red-400 uppercase tracking-wider mb-0.5">Before</p>
                      <p className="text-xs text-white/70">{item.before}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-[10px] text-green-400 uppercase tracking-wider mb-0.5">After</p>
                      <p className="text-xs text-white/70">{item.after}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-white mb-4">Illustrative User Journeys</h3>
            <div className="space-y-4">
              {successStories.map((story) => (
                <div key={story._id} className="p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-400/15 flex items-center justify-center text-lg shrink-0">
                      ✨
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white mb-1">{story.title}</h4>
                      <p className="text-xs text-white/50 mb-2">{story.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="teal">{story.clerk}</Badge>
                        <Badge variant="blue">{story.state}</Badge>
                        <span className="text-[10px] text-green-400">{story.improvement}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card variant="spatial">
          <div className="text-center py-4">
            <h3 className="text-xl font-bold text-white mb-2">National Accessibility Improvement</h3>
            <p className="text-5xl font-bold gradient-text mb-2">73%</p>
            <p className="text-sm text-white/50">Average improvement in citizen experience across all metrics</p>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">↑ 119%</p>
                <p className="text-xs text-white/40">Satisfaction</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-400">↓ 73%</p>
                <p className="text-xs text-white/40">Wait Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-400">↓ 60%</p>
                <p className="text-xs text-white/40">Return Visits</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
