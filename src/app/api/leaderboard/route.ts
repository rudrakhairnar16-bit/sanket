import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    try {
      await connectDB();
      const users = await User.find({ role: "clerk" })
        .select("name username department islXp islLevel currentStreak isChampion")
        .sort({ islXp: -1 })
        .limit(20)
        .lean();

      const leaderboard = users.map((u: any, i: number) => ({
        rank: i + 1,
        username: u.username,
        name: u.name,
        department: u.department,
        islXp: u.islXp,
        islLevel: u.islLevel,
        currentStreak: u.currentStreak,
        isChampion: u.isChampion,
      }));

      return NextResponse.json({ success: true, leaderboard });
    } catch {
      const { getMockLeaderboard } = await import("@/lib/mock-users");
      return NextResponse.json({ success: true, leaderboard: getMockLeaderboard() });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
