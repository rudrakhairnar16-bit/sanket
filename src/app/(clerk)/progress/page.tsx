"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingState } from "@/components/state/LoadingState";
import { municipalSigns, signCategories } from "@/data/signs/municipal-signs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { analyzeWeakAreas } from "@/lib/learning/recommendations";

const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: "rgba(11, 17, 32, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", fontSize: "12px" },
  labelStyle: { color: "rgba(255,255,255,0.6)" },
  itemStyle: { color: "#c9a961" },
};

export default function ProgressPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const mockFailedSigns = useMemo(() => {
    if (!user) return [];
    const completed = user.islSignsCompleted;
    const failed: string[] = [];
    const allIds = municipalSigns.map((s) => s.id);
    const unlearned = allIds.filter((id) => !completed.includes(id));
    if (unlearned.length >= 3) {
      failed.push(unlearned[0], unlearned[1], unlearned[2]);
    } else if (unlearned.length > 0) {
      failed.push(...unlearned);
    }
    return failed;
  }, [user?.islSignsCompleted]);

  const weakAreas = useMemo(() => {
    if (!user) return [];
    return analyzeWeakAreas(user.islSignsCompleted, mockFailedSigns);
  }, [user?.islSignsCompleted, mockFailedSigns]);

  const nextLesson = useMemo(() => {
    if (weakAreas.length === 0) return null;
    return weakAreas[0];
  }, [weakAreas]);

  const xpOverTime = useMemo(() => {
    if (!user) return [];
    const data = [];
    let cumulativeXp = Math.max(0, user.islXp - 300);
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      cumulativeXp += Math.floor(Math.random() * 30 + 5);
      if (i === 0) cumulativeXp = user.islXp;
      data.push({ date: dayLabel, xp: cumulativeXp });
    }
    return data;
  }, [user?.islXp]);

  const signsPerCategory = useMemo(() => {
    if (!user) return [];
    return signCategories.map((cat) => {
      const total = municipalSigns.filter((s) => s.category.toLowerCase() === cat.id.replace("-", "") || s.category === cat.name).length;
      const learned = user.islSignsCompleted.filter((id) => {
        const sign = municipalSigns.find((s) => s.id === id);
        return sign && (sign.category.toLowerCase() === cat.id.replace("-", "") || sign.category === cat.name);
      }).length;
      return { category: cat.name, total, learned, icon: cat.icon };
    });
  }, [user?.islSignsCompleted]);

  const streakHistory = useMemo(() => {
    if (!user) return [];
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      const active = i < user.currentStreak;
      data.push({ date: dayLabel, active: active ? 1 : 0 });
    }
    return data;
  }, [user?.currentStreak]);

  if (loading || !user) return <LoadingState />;

  const readiness = Math.min(100, Math.round((user.islXp / 50) + (user.currentStreak * 2)));
  const signsLearned = user.islSignsCompleted.length;
  const totalSigns = municipalSigns.length;
  const signProgress = Math.round((signsLearned / totalSigns) * 100);

  const recentActivity = [
    { time: "2 hours ago", event: "Completed Water Tax session", icon: "💧", xp: "+25 XP" },
    { time: "5 hours ago", event: "Practiced 3 signs", icon: "✋", xp: "+15 XP" },
    { time: "Yesterday", event: "Completed Quiz Challenge", icon: "❓", xp: "+20 XP" },
    { time: "2 days ago", event: "Earned 7-Day Streak badge", icon: "🔥", xp: "+50 XP" },
    { time: "3 days ago", event: "Completed Birth Certificate session", icon: "📜", xp: "+25 XP" },
  ];

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-1">
            <span className="gradient-text">Your Progress</span>
          </h1>
          <p className="text-white/50">Track your ISL learning journey</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="flex flex-col items-center text-center">
            <ProgressRing value={readiness} size={80} strokeWidth={6} />
            <p className="text-sm text-white/50 mt-2">Readiness</p>
          </Card>
          <StatCard label="Total XP" value={user.islXp} icon="⚡" trend="up" trendValue="Growing" />
          <StatCard label="Day Streak" value={`${user.currentStreak}d`} icon="🔥" />
          <StatCard label="Level" value={`Lvl ${user.islLevel}`} icon="🏆" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <h3 className="font-bold text-white mb-4">XP Growth (30 Days)</h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={xpOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip {...CHART_TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="xp" stroke="#c9a961" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#c9a961" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-white mb-4">Signs Per Category</h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signsPerCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="category" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip {...CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="learned" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Learned" />
                  <Bar dataKey="total" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <h3 className="font-bold text-white mb-4">Streak History (30 Days)</h3>
            <div className="grid grid-cols-10 gap-1.5">
              {streakHistory.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-full aspect-square rounded-sm transition-all ${
                      day.active ? "bg-gold-400 shadow-sm shadow-gold-400/30" : "bg-white/5"
                    }`}
                    title={`${day.date} — ${day.active ? "Active" : "Inactive"}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 text-[10px] text-white/30">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-white mb-4">Level Progression</h3>
            <div className="space-y-3">
              {Array.from({ length: Math.min(user.islLevel, 5) }, (_, i) => {
                const level = user.islLevel - (Math.min(user.islLevel, 5) - 1) + i;
                const xpForLevel = level * 100 + 50;
                const prevXp = (level - 1) * 100 + 50;
                const progress = level === user.islLevel
                  ? Math.min(100, Math.round(((user.islXp - prevXp) / (xpForLevel - prevXp)) * 100))
                  : 100;
                return (
                  <div key={level} className="flex items-center gap-3">
                    <span className="text-xs text-white/40 w-12">Lvl {level}</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gold-400 to-gold-300 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[10px] text-white/40 w-8 text-right">{progress}%</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 truncate">{activity.event}</p>
                    <p className="text-[10px] text-white/30">{activity.time}</p>
                  </div>
                  <span className="text-xs text-gold-400 font-medium shrink-0">{activity.xp}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {weakAreas.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <h3 className="font-bold text-white mb-4">Weak Areas</h3>
              <div className="space-y-3">
                {weakAreas.map((area) => {
                  const cat = signCategories.find((c) => c.name === area.category);
                  return (
                    <div key={area.category} className="p-3 rounded-xl bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{cat?.icon || "📚"}</span>
                          <span className="text-sm text-white font-medium">{area.category}</span>
                        </div>
                        <Badge variant={area.score < 30 ? "red" : area.score < 60 ? "gold" : "green"}>
                          {area.score}%
                        </Badge>
                      </div>
                      <p className="text-xs text-white/50">{area.recommendation}</p>
                      {area.weakSigns.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {area.weakSigns.map((signId) => {
                            const sign = municipalSigns.find((s) => s.id === signId);
                            return sign ? (
                              <span key={signId} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                                {sign.symbol} {sign.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-white mb-4">Recommended Next Lesson</h3>
              {nextLesson && (
                <div className="p-4 rounded-xl bg-white/5 border border-gold-400/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{signCategories.find((c) => c.name === nextLesson.category)?.icon || "📚"}</span>
                    <div>
                      <p className="font-bold text-white">{nextLesson.category}</p>
                      <p className="text-xs text-white/50">{nextLesson.recommendation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                    <span>{nextLesson.weakSigns.length} signs need practice</span>
                    <span>•</span>
                    <span>Score: {nextLesson.score}%</span>
                  </div>
                  <button
                    onClick={() => router.push("/learn")}
                    className="w-full p-2 rounded-lg bg-gold-400/10 border border-gold-400/20 text-gold-400 text-sm font-medium hover:bg-gold-400/20 transition-colors"
                  >
                    Start Review →
                  </button>
                </div>
              )}
              {weakAreas.length > 1 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider">Other Areas to Review</p>
                  {weakAreas.slice(1, 4).map((area) => {
                    const cat = signCategories.find((c) => c.name === area.category);
                    return (
                      <div key={area.category} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2">
                          <span>{cat?.icon || "📚"}</span>
                          <span className="text-xs text-white/70">{area.category}</span>
                        </div>
                        <Badge variant="gold" className="text-[9px]">{area.score}%</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Signs Mastered</h3>
              <Badge variant="gold">{signsLearned}/{totalSigns}</Badge>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-gold-400 to-teal-400 rounded-full transition-all" style={{ width: `${signProgress}%` }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {user.islSignsCompleted.map((signId: string) => {
                const s = municipalSigns.find((ms) => ms.id === signId);
                return s ? (
                  <span key={signId} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 text-xs text-white/70">
                    <span>{s.symbol}</span>
                    <span>{s.name}</span>
                  </span>
                ) : null;
              })}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-white mb-4">Module Completion</h3>
            <div className="space-y-3">
              {signCategories.map((cat) => {
                const catSigns = municipalSigns.filter((s) => s.category === cat.name);
                const learned = catSigns.filter((s) => user.islSignsCompleted.includes(s.id)).length;
                const pct = catSigns.length > 0 ? Math.round((learned / catSigns.length) * 100) : 0;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/60 flex items-center gap-1.5">
                        <span>{cat.icon}</span> {cat.name}
                      </span>
                      <span className="text-[10px] text-white/40">{learned}/{catSigns.length}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
