"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { LoadingState } from "@/components/state/LoadingState";
import { municipalSigns } from "@/data/signs/municipal-signs";

const BADGE_DATA: Record<string, { icon: string; label: string; desc: string }> = {
  "first-sign": { icon: "✋", label: "First Sign", desc: "Completed your first sign" },
  "7-day-streak": { icon: "🔥", label: "7-Day Streak", desc: "Maintained a 7-day streak" },
  "counter-ready": { icon: "🔢", label: "Counter Ready", desc: "Mastered counter signs" },
  "100-xp": { icon: "⚡", label: "100 XP Club", desc: "Earned 100 experience points" },
  "water-master": { icon: "💧", label: "Water Master", desc: "Mastered water service signs" },
  "doc-pro": { icon: "📄", label: "Doc Pro", desc: "Mastered document signs" },
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("en");

  React.useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) {
      setName(user.name);
      setLanguage(user.language);
    }
  }, [user, loading, router]);

  if (loading) return <LoadingState />;
  if (!user) return null;

  const signsLearned = user.islSignsCompleted.map((id) => municipalSigns.find((s) => s.id === id)).filter(Boolean);

  return (
    <AppShell>
      <div className="page-container max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-1">Profile</h1>
          <p className="text-white/50">Your account and ISL progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center text-2xl font-bold text-navy-900">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <p className="text-white/50 text-sm">{user.designation || user.role.replace(/_/g, " ")}</p>
                  {user.isChampion && <Badge variant="gold" className="mt-1">👑 Champion</Badge>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setEditMode(!editMode)}>
                {editMode ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {editMode ? (
              <div className="space-y-4 p-4 rounded-xl bg-white/5">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Display Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Language Preference</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field">
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="mr">मराठी</option>
                    <option value="gu">ગુજરાતી</option>
                  </select>
                </div>
                <Button onClick={() => setEditMode(false)}>Save Changes</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Username", value: user.username },
                  { label: "Employee ID", value: user.employeeId },
                  { label: "Department", value: user.department },
                  { label: "City", value: user.city || "—" },
                  { label: "State", value: user.state || "—" },
                  { label: "Language", value: user.language === "en" ? "English" : user.language === "hi" ? "हिन्दी" : user.language === "mr" ? "मराठी" : "ગુજરાતી" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-white/5">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-medium text-white mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="flex flex-col items-center justify-center text-center">
            <ProgressRing value={user.islXp} max={user.islLevel * 100 + 50} size={100} strokeWidth={7} />
            <p className="text-lg font-bold text-white mt-3">Level {user.islLevel}</p>
            <p className="text-xs text-white/40">{user.islXp} / {user.islLevel * 100 + 50} XP</p>
          </Card>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total XP", value: user.islXp, icon: "⚡", color: "text-gold-400" },
            { label: "Current Streak", value: `${user.currentStreak}d`, icon: "🔥", color: "text-orange-400" },
            { label: "Badges", value: user.islBadges.length, icon: "🏆", color: "text-yellow-400" },
            { label: "Signs Learned", value: user.islSignsCompleted.length, icon: "✋", color: "text-teal-400" },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <span className="text-2xl block mb-1">{stat.icon}</span>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</p>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
          <h3 className="font-bold text-white mb-4">Earned Badges</h3>
          {user.islBadges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {user.islBadges.map((badge) => {
                const data = BADGE_DATA[badge] || { icon: "🏅", label: badge, desc: "" };
                return (
                  <div key={badge} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold-400/20 transition-all text-center">
                    <span className="text-3xl block mb-2">{data.icon}</span>
                    <p className="font-medium text-white text-sm">{data.label}</p>
                    <p className="text-[10px] text-white/40 mt-1">{data.desc}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/40 text-sm text-center py-4">Complete lessons to earn badges</p>
          )}
        </Card>

        {signsLearned.length > 0 && (
          <Card>
            <h3 className="font-bold text-white mb-4">Signs Learned ({signsLearned.length})</h3>
            <div className="flex flex-wrap gap-2">
              {signsLearned.map((sign) => sign && (
                <div key={sign.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-lg">{sign.symbol}</span>
                  <div>
                    <p className="text-xs font-medium text-white">{sign.name}</p>
                    <p className="text-[10px] text-white/40">{sign.nameHi}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
