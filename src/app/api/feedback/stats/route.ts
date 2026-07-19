import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";
import { getAuthUser } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  const user = await getAuthUser(_req);
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (user.role !== "superadmin") {
    filter.department = user.department;
  }

  const total = await Feedback.countDocuments(filter);
  const positive = await Feedback.countDocuments({ ...filter, attempted: true });
  const negative = await Feedback.countDocuments({ ...filter, attempted: false });

  const deptStats = await Feedback.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$department",
        total: { $sum: 1 },
        positive: { $sum: { $cond: ["$attempted", 1, 0] } },
        clerkName: { $first: "$clerkName" },
      },
    },
    { $sort: { total: -1 } },
  ]);

  return NextResponse.json({
    stats: {
      total,
      positive,
      negative,
      satisfactionRate: total > 0 ? Math.round((positive / total) * 100) : 0,
    },
    departments: deptStats,
  });
}
