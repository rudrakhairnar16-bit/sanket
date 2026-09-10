import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { requireAuth } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

export async function POST() {
  try {
    const { auth } = await requireAuth();
    await clearAuthCookie();
    if (auth) {
      await logAudit({ userId: auth.userId, username: '', role: auth.role, action: 'logout', details: 'User logged out' });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}
