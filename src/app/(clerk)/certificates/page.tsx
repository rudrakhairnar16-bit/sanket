"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { LoadingState } from "@/components/state/LoadingState";

interface Milestone {
  id: string;
  level: number;
  label: string;
  xpRequired: number;
  streakRequired: number;
  icon: string;
}

const MILESTONES: Milestone[] = [
  { id: "beginner", level: 1, label: "ISL Beginner", xpRequired: 50, streakRequired: 3, icon: "🌱" },
  { id: "apprentice", level: 2, label: "ISL Apprentice", xpRequired: 150, streakRequired: 7, icon: "📗" },
  { id: "practitioner", level: 3, label: "ISL Practitioner", xpRequired: 350, streakRequired: 14, icon: "📘" },
  { id: "advanced", level: 4, label: "ISL Advanced", xpRequired: 600, streakRequired: 21, icon: "🎓" },
  { id: "champion", level: 5, label: "ISL Champion", xpRequired: 1000, streakRequired: 30, icon: "🏆" },
];

export default function CertificatesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const earnedMilestones = useMemo(() => {
    if (!user) return [];
    return MILESTONES.filter((m) => user.islXp >= m.xpRequired && user.longestStreak >= m.streakRequired);
  }, [user]);

  const nextMilestone = MILESTONES.find((m) => !earnedMilestones.some((e) => e.id === m.id));

  if (loading || !user) return <LoadingState />;

  const generatePDF = (milestone: Milestone) => {
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const centerX = 148.5;
      const centerY = 105;

      doc.setFillColor(11, 17, 32);
      doc.rect(0, 0, 297, 210, "F");

      doc.setDrawColor(201, 169, 97);
      doc.setLineWidth(1.5);
      doc.roundedRect(15, 15, 267, 180, 5, 5, "S");

      doc.setDrawColor(201, 169, 97);
      doc.setLineWidth(0.5);
      doc.roundedRect(20, 20, 257, 170, 4, 4, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text("SANKET 2.0 — ISL ACCESSIBILITY PLATFORM", centerX, 40, { align: "center" });

      doc.setFontSize(28);
      doc.setTextColor(201, 169, 97);
      doc.text("CERTIFICATE", centerX, 58, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(200, 200, 200);
      doc.text("of Achievement", centerX, 68, { align: "center" });

      doc.setDrawColor(201, 169, 97);
      doc.setLineWidth(0.3);
      doc.line(centerX - 40, 75, centerX + 40, 75);

      doc.setFontSize(12);
      doc.setTextColor(180, 180, 180);
      doc.text("This is to certify that", centerX, 88, { align: "center" });

      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text(user.name, centerX, 100, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(180, 180, 180);
      doc.text(`has successfully achieved the level of`, centerX, 112, { align: "center" });

      doc.setFontSize(18);
      doc.setTextColor(201, 169, 97);
      doc.text(milestone.label, centerX, 124, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Employee ID: ${user.employeeId} | Department: ${user.department}`, centerX, 140, { align: "center" });
      doc.text(`XP Earned: ${user.islXp} | Streak: ${user.longestStreak} days`, centerX, 148, { align: "center" });

      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Issued: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, centerX, 162, { align: "center" });
      doc.text(`Verification ID: SKT-${user.employeeId}-${milestone.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`, centerX, 170, { align: "center" });

      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text("ISL reference content attributed to ISLRTC, Ministry of Social Justice & Empowerment, GoI", centerX, 185, { align: "center" });

      doc.save(`Sanket_Certificate_${milestone.label.replace(/\s+/g, "_")}.pdf`);
    });
  };

  return (
    <AppShell>
      <div className="page-container max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-1">
            <span className="gradient-text">Certificates</span>
          </h1>
          <p className="text-white/50">Learning milestones — not official government certification</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <ProgressRing value={earnedMilestones.length} max={MILESTONES.length} size={64} strokeWidth={5} />
              <div>
                <p className="font-bold text-white">{earnedMilestones.length} of {MILESTONES.length} Earned</p>
                <p className="text-xs text-white/40">Keep learning to unlock more</p>
              </div>
            </div>
            {nextMilestone && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Next Milestone</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{nextMilestone.icon}</span>
                    <div>
                      <p className="font-medium text-white text-sm">{nextMilestone.label}</p>
                      <p className="text-[10px] text-white/40">{nextMilestone.xpRequired} XP • {nextMilestone.streakRequired}-day streak</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gold-400">{Math.min(100, Math.round((user.islXp / nextMilestone.xpRequired) * 100))}%</p>
                    <div className="w-20 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-gold-400 rounded-full" style={{ width: `${Math.min(100, (user.islXp / nextMilestone.xpRequired) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-2">📜</span>
            <p className="text-3xl font-bold text-gold-400">{earnedMilestones.length}</p>
            <p className="text-xs text-white/40">Certificates Earned</p>
          </Card>
        </div>

        <div className="space-y-4 mb-8">
          {MILESTONES.map((milestone) => {
            const earned = earnedMilestones.some((e) => e.id === milestone.id);
            const progress = Math.min(100, (user.islXp / milestone.xpRequired) * 100);
            return (
              <Card
                key={milestone.id}
                className={`transition-all ${earned ? "border-gold-400/30 bg-gradient-to-r from-gold-400/5 to-transparent" : "opacity-70"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                      earned ? "bg-gold-400/20" : "bg-white/5"
                    }`}>
                      {earned ? milestone.icon : "🔒"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white">{milestone.label}</p>
                        {earned && <Badge variant="gold">Earned</Badge>}
                      </div>
                      <p className="text-xs text-white/40 mt-0.5">
                        {milestone.xpRequired} XP required • {milestone.streakRequired}-day streak minimum
                      </p>
                      {!earned && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gold-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[10px] text-white/40">{Math.round(progress)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {earned ? (
                      <Button size="sm" onClick={() => generatePDF(milestone)}>
                        Download PDF
                      </Button>
                    ) : (
                      <span className="text-xs text-white/30">Not yet earned</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="text-center">
          <p className="text-xs text-white/30">ISL reference content attributed to ISLRTC, Ministry of Social Justice & Empowerment, GoI</p>
        </Card>
      </div>
    </AppShell>
  );
}
