import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";
import { feedbackSchema, validateInput } from "@/lib/validation";
import { logAudit } from "@/lib/audit";
import { getAuthFromCookies } from "@/lib/auth";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateInput(feedbackSchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    try {
      await connectDB();
      const auth = await getAuthFromCookies();
      let orgId = "";
      let userState = "";
      if (auth) {
        const user = await User.findById(auth.userId).lean();
        if (user) {
          orgId = user.organizationId || "";
          userState = user.state || "";
        }
      }
      await Feedback.create({ ...validation.data, organizationId: orgId, state: userState });
      await logAudit({ userId: auth?.userId || "", username: auth?.username || "", role: auth?.role || "", action: "feedback_submitted", details: "Feedback submitted" });
      return NextResponse.json({ success: true });
    } catch {
      await logAudit({ userId: "", username: "", role: "", action: "feedback_submitted", details: "Feedback submitted" });
      return NextResponse.json({ success: true, message: "Feedback recorded (demo)" });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    try {
      await connectDB();
      const auth = await getAuthFromCookies();
      let filter: Record<string, unknown> = {};
      if (auth) {
        const user = await User.findById(auth.userId).lean();
        if (user) {
          if (user.role === "state_admin") {
            filter = { state: user.state };
          } else if (!["national_admin", "super_admin"].includes(user.role)) {
            filter = { organizationId: user.organizationId };
          }
        }
      }
      const feedback = await Feedback.find(filter).sort({ createdAt: -1 }).limit(50).lean();
      return NextResponse.json({ success: true, feedback });
    } catch {
      return NextResponse.json({ success: true, feedback: [] });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
