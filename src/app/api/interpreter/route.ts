import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const { auth, error } = await requireAuth();
    if (error) return error;

    const body = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 1600));

    await logAudit({ userId: auth.userId, username: auth.username, role: auth.role, action: 'interpreter_escalation', details: 'Interpreter requested' });

    return NextResponse.json({
      success: true,
      interpreter: {
        id: "demo-interpreter-01",
        name: "Demo Interpreter",
        status: "connected",
        message: "Hello, I can help with this conversation.",
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    interpreters: [
      { id: "demo-interpreter-01", name: "Demo Interpreter 01", status: "available" },
      { id: "demo-interpreter-02", name: "Demo Interpreter 02", status: "available" },
    ],
  });
}
