import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { default: AuditLog } = await import("@/models/AuditLog");

    let orgId = "";
    let userState = "";
    if (body.userId) {
      try {
        await connectDB();
        const user = await User.findById(body.userId).lean();
        if (user) {
          orgId = user.organizationId || "";
          userState = user.state || "";
        }
      } catch {}
    }

    await AuditLog.create({
      userId: body.userId,
      userName: body.username,
      action: body.action,
      target: body.details,
      result: "success",
      details: body.metadata ? JSON.stringify(body.metadata) : undefined,
      organizationId: orgId,
      state: userState,
      timestamp: new Date(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
