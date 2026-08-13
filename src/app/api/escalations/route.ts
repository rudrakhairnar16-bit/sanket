import { NextRequest, NextResponse } from "next/server";
import {
  logEscalation,
  getEscalationCount,
  getRecentEscalations,
} from "@/lib/escalation-store";

export async function GET() {
  return NextResponse.json({
    total: getEscalationCount(),
    escalations: getRecentEscalations(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { clerkName, language } = await req.json();
    logEscalation({
      clerkName: clerkName || "Desk clerk",
      language: language || "en",
    });
    return NextResponse.json({ total: getEscalationCount() });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}