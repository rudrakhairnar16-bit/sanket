import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

interface SessionRecord {
  id: string;
  userId: string;
  clerkId: string;
  clerkName: string;
  language: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  rating?: number;
  status: "active" | "completed" | "disconnected";
}

const sessions = new Map<string, SessionRecord>();

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userSessions = Array.from(sessions.values())
    .filter((s) => s.userId === user.userId || s.clerkId === user.userId)
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 20);

  return NextResponse.json({ sessions: userSessions });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { sessionId, clerkId, clerkName, language } = await req.json();
    if (!sessionId || !clerkId) {
      return NextResponse.json({ error: "sessionId and clerkId required" }, { status: 400 });
    }

    const record: SessionRecord = {
      id: sessionId,
      userId: user.userId,
      clerkId,
      clerkName: clerkName || "Unknown Clerk",
      language: language || "en",
      startTime: Date.now(),
      status: "active",
    };
    sessions.set(sessionId, record);
    return NextResponse.json({ session: record });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
