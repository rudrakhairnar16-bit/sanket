"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/state/LoadingState";
import { getMockLeaderboard } from "@/lib/mock-users";

export default function LeaderboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const allEntries = getMockLeaderboard();
  const departments = ["all", ...Array.from(new Set(allEntries.map((e) => e.department)))];
  const filtered = filter === "all" ? allEntries : allEntries.filter((e) => e.department === filter);

  const userRank = allEntries.find((e) => e.username === user.username);

  return (
    <AppShell>
      <div className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Accessibility Champions</h1>
            <p className="text-white/50">Top performers across all departments</p>
          </div>
          {userRank && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gold-400/10 border border-gold-400/20">
              <span className="text-2xl">🏅</span>
              <div>
                <p className="text-xs text-white/40">Your Rank</p>
                <p className="text-lg font-bold text-gold-400">#{userRank.rank}</p>
              </div>
              <div className="ml-2 pl-3 border-l border-white/10">
                <p className="text-xs text-white/40">Your XP</p>
                <p className="text-lg font-bold text-white">{userRank.islXp}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilter(dept)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === dept
                  ? "bg-gold-400 text-navy-900"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {dept === "all" ? "All Departments" : dept}
            </button>
          ))}
        </div>

        <Card>
          <div className="space-y-2">
            {filtered.map((entry) => {
              const isCurrentUser = entry.username === user.username;
              const isTop3 = entry.rank <= 3;
              return (
                <div
                  key={entry.username}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    isCurrentUser
                      ? "bg-gold-400/10 border border-gold-400/20 shadow-lg shadow-gold-400/10"
                      : isTop3
                        ? "bg-white/5 border border-white/5 hover:bg-white/8"
                        : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isTop3
                        ? "bg-gradient-to-br from-gold-300 to-gold-600 text-navy-900"
                        : "bg-white/10 text-white/50"
                    }`}>
                      {entry.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{entry.name}</p>
                        {entry.isChampion && <span title="Champion" className="text-sm">👑</span>}
                        {isCurrentUser && <Badge variant="gold" className="text-[10px]">You</Badge>}
                      </div>
                      <p className="text-xs text-white/40">{entry.department} • Level {entry.islLevel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold-400">{entry.islXp} XP</p>
                    <p className="text-xs text-white/40">🔥 {entry.currentStreak} day streak</p>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-white/40 text-center py-8">No users found for this department</p>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
