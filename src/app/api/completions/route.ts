import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Completion from "@/models/Completion";
import User from "@/models/User";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    try {
      await connectDB();
      const user = await User.findById(auth.userId).lean();
      let filter: Record<string, unknown> = { userId: auth.userId };

      if (user && ["state_admin", "national_admin", "super_admin"].includes(user.role)) {
        if (user.role === "state_admin") {
          filter = { state: user.state };
        } else {
          filter = {};
        }
      }

      const completions = await Completion.find(filter)
        .sort({ completedAt: -1 })
        .limit(50)
        .lean();
      return NextResponse.json({ success: true, completions });
    } catch {
      return NextResponse.json({ success: true, completions: [] });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    try {
      await connectDB();
      const user = await User.findById(auth.userId).lean();
      const completion = await Completion.create({
        userId: auth.userId,
        moduleId: body.moduleId,
        answer: body.answer,
        correct: body.correct,
        score: body.score || 0,
        xpEarned: body.xpEarned || 0,
        timeSpent: body.timeSpent || 0,
        organizationId: user?.organizationId || "",
        state: user?.state || "",
      });

      await User.findByIdAndUpdate(auth.userId, {
        $inc: { islXp: body.xpEarned || 0, totalCompleted: 1 },
        $set: { lastCompletedDate: new Date().toISOString().split("T")[0] },
      });

      return NextResponse.json({ success: true, completion });
    } catch {
      return NextResponse.json({ success: true, completion: body });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
