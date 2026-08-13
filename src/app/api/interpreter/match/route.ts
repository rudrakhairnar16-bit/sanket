import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

interface ClerkProfile {
  id: string;
  name: string;
  department: string;
  languages: string[];
  completedSessions: number;
  averageRating: number;
  experienceLevel: "beginner" | "intermediate" | "advanced";
}

// Hardcoded clerk list used in mock/demo mode.
// For production, replace this with a database query (e.g. User model)
// filtering users whose role === "clerk" and including their language prefs.
const clerks: ClerkProfile[] = [
  { id: "clerk-1", name: "Aisha Sharma", department: "Municipal Corporation", languages: ["en", "hi"], completedSessions: 45, averageRating: 4.8, experienceLevel: "advanced" },
  { id: "clerk-2", name: "Rahul Verma", department: "Revenue Department", languages: ["en", "hi", "mr"], completedSessions: 28, averageRating: 4.5, experienceLevel: "intermediate" },
  { id: "clerk-3", name: "Priya Patel", department: "Public Health", languages: ["en", "hi"], completedSessions: 12, averageRating: 4.2, experienceLevel: "intermediate" },
  { id: "clerk-4", name: "Vikram Singh", department: "Water Supply", languages: ["en"], completedSessions: 6, averageRating: 3.9, experienceLevel: "beginner" },
];

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { language, preferredLevel } = await req.json();
    const lang = language || "en";

    const scored = clerks
      .filter((c) => c.languages.includes(lang))
      .map((c) => {
        let score = c.averageRating * 10 + c.completedSessions;
        if (preferredLevel === "advanced" && c.experienceLevel === "advanced") score += 20;
        else if (preferredLevel === "intermediate" && c.experienceLevel === "intermediate") score += 15;
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score);

    const topMatch = scored[0] || null;

    return NextResponse.json({
      match: topMatch,
      alternatives: scored.slice(1, 4),
      totalAvailable: scored.length,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
