import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Completion from "@/models/Completion";
import { getAuthUser } from "@/lib/auth";
import { getMockLeaderboard } from "@/lib/mock-data";
import { getEscalationCount } from "@/lib/escalation-store";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    const dateFilter: { date?: { $gte?: string; $lte?: string } } = {};
    if (fromDate || toDate) {
      dateFilter.date = {};
      if (fromDate) dateFilter.date.$gte = fromDate;
      if (toDate) dateFilter.date.$lte = toDate;
    }

    const totalUsers = await User.countDocuments({ role: "learner" });

    const completionFilter = { ...dateFilter };
    const totalCompletions = await Completion.countDocuments(completionFilter);

    const deptCompliance = await User.aggregate([
      { $match: { role: "learner" } },
      {
        $lookup: {
          from: "completions",
          localField: "_id",
          foreignField: "userId",
          pipeline: dateFilter.date ? [{ $match: dateFilter }] : [],
          as: "completions",
        },
      },
      {
        $group: {
          _id: "$department",
          totalUsers: { $sum: 1 },
          totalCompletions: { $sum: { $size: "$completions" } },
        },
      },
      { $sort: { totalCompletions: -1 } },
    ]);

    const leaderboard = await User.find({ role: "learner" })
      .select("name username department currentStreak longestStreak totalCompleted isChampion")
      .sort({ currentStreak: -1, totalCompleted: -1 })
      .limit(10);

    return NextResponse.json({
      overallCompliance:
        totalUsers > 0
          ? Math.round((totalCompletions / (totalUsers * 30)) * 100)
          : 0,
      totalUsers,
      totalCompletions,
      deptCompliance,
      leaderboard,
      escalationsHandled: getEscalationCount(),
    });
  } catch {
    const mock = getMockLeaderboard();
    const deptMap = new Map<string, { totalUsers: number; totalCompletions: number }>();
    for (const u of mock.users) {
      const d = deptMap.get(u.department) || { totalUsers: 0, totalCompletions: 0 };
      d.totalUsers += 1;
      d.totalCompletions += u.totalCompleted;
      deptMap.set(u.department, d);
    }
    const deptCompliance = Array.from(deptMap.entries()).map(([id, v]) => ({
      _id: id,
      totalUsers: v.totalUsers,
      totalCompletions: v.totalCompletions,
    }));
    const totalUsers = mock.users.length;
    const totalCompletions = mock.users.reduce((s, u) => s + u.totalCompleted, 0);

    return NextResponse.json({
      overallCompliance:
        totalUsers > 0 ? Math.round((totalCompletions / (totalUsers * 30)) * 100) : 0,
      totalUsers,
      totalCompletions,
      deptCompliance,
      leaderboard: mock.users.slice(0, 10).map((u) => ({
        _id: u._id,
        name: u.name,
        username: u.username,
        department: u.department,
        currentStreak: u.currentStreak,
        longestStreak: u.longestStreak,
        totalCompleted: u.totalCompleted,
        isChampion: u.isChampion,
      })),
      escalationsHandled: getEscalationCount(),
    });
  }
}
