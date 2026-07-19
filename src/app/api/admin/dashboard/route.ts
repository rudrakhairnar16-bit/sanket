import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Completion from "@/models/Completion";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

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
    .select("name department currentStreak longestStreak totalCompleted")
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
  });
}
