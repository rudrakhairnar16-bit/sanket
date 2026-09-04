"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingState } from "@/components/state/LoadingState";
import { getMockLeaderboard } from "@/lib/mock-users";
import { demoSessions } from "@/lib/mock-data";
import { defaultServicePacks } from "@/data/service-packs/default-packs";
import { municipalSigns } from "@/data/signs/municipal-signs";
import { getRecommendations } from "@/lib/learning/recommendations";
import { getLearningRecommendations } from "@/lib/score-to-learning";
import { LearningRecommendation } from "@/components/sahayak/LearningRecommendation";

const BADGE_ICONS: Record<string, string> = {
  "first-sign": "✋",
  "7-day-streak": "🔥",
  "counter-ready": "🔢",
  "100-xp": "⚡",
  "water-master": "💧",
  "doc-pro": "📄",
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    setLeaderboard(getMockLeaderboard().slice(0, 5));
  }, []);

  const recommendations = useMemo(() => {
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
    return getRecommendations(completed, failed, 3);
  }, [user?.islSignsCompleted]);

  const readiness = user ? Math.min(100, Math.round((user.islXp / 50) + (user.currentStreak * 2))) : 0;

  const scoreLearningRecs = useMemo(() => {
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
    return getLearningRecommendations(completed, failed);
  }, [user?.islSignsCompleted]);

  const showScoreRecommendation = readiness < 75 && scoreLearningRecs.length > 0;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  const streakDays = useMemo(() => {
    if (!user) return [];
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const active = i < user.currentStreak;
      days.push({ label: dayName, active });
    }
    return days;
  }, [user?.currentStreak]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const userSessions = demoSessions.filter((s) => s.clerkId === user._id).slice(0, 4);
  const todaySessions = userSessions.length;
  const recentActivity = userSessions.map((s) => ({
    label: s.serviceName,
    time: `${Math.round(s.duration)}s`,
    outcome: s.outcome,
    xp: s.xpEarned,
  }));

  const quickPacks = defaultServicePacks.slice(0, 4);

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-1">
            {greeting}, <span className="gradient-text">{user.name.split(" ")[0]}</span>.
          </h1>
          <p className="text-white/50">Your ISL accessibility dashboard</p>
        </div>

        <div className="mb-6 animate-fade-in">
          <Card variant="spatial" hover onClick={() => router.push("/assist")} className="cursor-pointer relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-gold-400/20 transition-all" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gold-400/20 flex items-center justify-center text-3xl">🤝</div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">START SAHAYAK</h3>
                <p className="text-sm text-white/50">Open your desk to help deaf and hard-of-hearing citizens</p>
              </div>
              <Button className="shrink-0">Begin Session →</Button>
            </div>
          </Card>
        </div>

        {showScoreRecommendation && (
          <div className="mb-6 animate-fade-in">
            <LearningRecommendation
              area={scoreLearningRecs[0].area}
              score={scoreLearningRecs[0].score}
              recommendedModule={scoreLearningRecs[0].recommendedModule}
              reason={scoreLearningRecs[0].reason}
              onStartLearning={() => router.push("/learn")}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="flex items-center gap-4">
            <ProgressRing value={readiness} size={72} strokeWidth={5} />
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider">Readiness</p>
              <p className="text-sm text-white/60">Desk preparedness</p>
            </div>
          </Card>
          <StatCard label="Today's Sessions" value={todaySessions} icon="📋" trend="up" trendValue="Today" />
          <StatCard label="Learning Streak" value={`${user.currentStreak} days`} icon="🔥" />
          <StatCard label="Leaderboard Rank" value={`#${leaderboard.findIndex((e) => e.username === user.username) + 1 || "—"}`} icon="🏆" trendValue={`${user.islXp} XP`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {recommendations.length > 0 && (
            <Card variant="spatial" hover onClick={() => router.push("/learn")} className="cursor-pointer relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-teal-500/20 transition-all" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-2xl">📚</div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Recommended Lesson</h3>
                    <p className="text-sm text-white/50">Continue learning ISL</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {recommendations.slice(0, 3).map((rec) => {
                    const sign = municipalSigns.find((s) => s.id === rec.signId);
                    if (!sign) return null;
                    return (
                      <div key={rec.signId} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                        <span className="text-xl">{sign.symbol}</span>
                        <span className="text-sm text-white/70">{sign.name}</span>
                        <Badge variant={rec.priority === "high" ? "red" : rec.priority === "medium" ? "gold" : "default"}>
                          {rec.priority}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
                <Button variant="secondary" className="w-full mt-4">Start Learning →</Button>
              </div>
            </Card>
          )}

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Recent Activity</h3>
            </div>
            {recentActivity.length > 0 ? (
              <div className="space-y-2">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                        activity.outcome === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {activity.outcome === "completed" ? "✓" : "↗"}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{activity.label}</p>
                        <p className="text-[10px] text-white/40">{activity.time}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gold-400">+{activity.xp} XP</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm text-center py-4">No recent activity. Start a session!</p>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Weekly Streak</h3>
              <Badge variant="gold">{user.currentStreak} day streak</Badge>
            </div>
            <div className="flex items-center justify-between gap-2">
              {streakDays.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    day.active
                      ? "bg-gold-400 text-navy-900 shadow-lg shadow-gold-400/30"
                      : "bg-white/10 text-white/30"
                  }`}>
                    {day.active ? "✓" : "·"}
                  </div>
                  <span className="text-[10px] text-white/40">{day.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-white mb-4">Recent Badges</h3>
            {user.islBadges.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {user.islBadges.slice(0, 4).map((badge: string) => (
                  <div key={badge} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                    <span className="text-lg">{BADGE_ICONS[badge] || "🏅"}</span>
                    <span className="text-xs text-white/70 capitalize">{badge.replace(/-/g, " ")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm">Earn badges by learning signs</p>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Mini Leaderboard</h3>
              <Link href="/dashboard/leaderboard" className="text-xs text-gold-400 hover:text-gold-300">View All →</Link>
            </div>
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div key={entry.username} className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                  entry.username === user.username ? "bg-gold-400/10 border border-gold-400/20" : "hover:bg-white/5"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-6 text-center ${entry.rank <= 3 ? "text-gold-400" : "text-white/40"}`}>
                      #{entry.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-white font-medium">{entry.name}</span>
                        {entry.isChampion && <span title="Champion">👑</span>}
                      </div>
                      <span className="text-[10px] text-white/40">{entry.department}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gold-400">{entry.islXp} XP</span>
                    <span className="text-[10px] text-white/40 block">Lvl {entry.islLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-white mb-4">Quick Access — Service Packs</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickPacks.map((pack) => (
                <Link key={pack.id} href={`/assist`}>
                  <div className="p-4 rounded-xl bg-white/5 hover:bg-white/8 border border-transparent hover:border-gold-400/20 transition-all cursor-pointer text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <p className="text-sm font-medium text-white">{pack.serviceName}</p>
                    <p className="text-[10px] text-white/40 mt-1">{pack.supportedSigns.length} signs</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
