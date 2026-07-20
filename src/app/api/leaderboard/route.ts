import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await connectDB();

  const users = await User.find({ role: "learner" })
    .select("name department currentStreak longestStreak totalCompleted islXp islLevel islStreak islBadges")
    .sort({ currentStreak: -1 })
    .limit(20);

  const deptStats = await User.aggregate([
    { $match: { role: "learner" } },
    {
      $group: {
        _id: "$department",
        totalUsers: { $sum: 1 },
        totalCompleted: { $sum: "$totalCompleted" },
        avgStreak: { $avg: "$currentStreak" },
      },
    },
    { $sort: { avgStreak: -1 } },
  ]);

  return NextResponse.json({
    users,
    departments: deptStats,
  });
}
