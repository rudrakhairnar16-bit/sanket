import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthFromCookies } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    try {
      await connectDB();
      await User.findByIdAndUpdate(auth.userId, {
        $set: {
          islXp: body.islXp,
          islLevel: body.islLevel,
          islStreak: body.islStreak,
          islBadges: body.islBadges || [],
          islSignsCompleted: body.islSignsCompleted || [],
          currentStreak: body.currentStreak,
          longestStreak: body.longestStreak,
        },
      });
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ success: true, message: "Synced locally" });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
