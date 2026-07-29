import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import { getMockLeaderboard } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectDB();

    const users = await User.find({ role: "learner" })
      .select("name username department currentStreak longestStreak totalCompleted islXp islLevel islStreak islBadges isChampion")
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
  } catch {
    const mock = getMockLeaderboard();
    return NextResponse.json({
      users: mock.users,
      departments: mock.departments,
    });
  }
}
