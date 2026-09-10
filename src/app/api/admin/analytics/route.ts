import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Feedback from "@/models/Feedback";
import AssistSession from "@/models/AssistSession";
import Completion from "@/models/Completion";
import { requireTenantRole, buildTenantFilter } from "@/lib/db/tenancy";

export async function GET(request: Request) {
  try {
    const { tenantUser, error } = await requireTenantRole("dept_admin");
    if (error) return error;

    try {
      await connectDB();
      const filter = buildTenantFilter(tenantUser!);
      const clerkFilter = { ...filter, role: "clerk" };
      const { searchParams } = new URL(request.url);
      const range = searchParams.get("range") || "30d";
      const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const periodFilter = { ...filter, createdAt: { $gte: startDate } };

      const totalSessions = await AssistSession.countDocuments(filter);
      const completedSessions = await AssistSession.countDocuments({ ...filter, outcome: "completed" });
      const escalatedSessions = await AssistSession.countDocuments({ ...filter, outcome: "escalated" });

      const sessionsByDay = await AssistSession.aggregate([
        { $match: { ...filter, startedAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$startedAt" } },
            sessions: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ["$outcome", "completed"] }, 1, 0] } },
            escalated: { $sum: { $cond: [{ $eq: ["$outcome", "escalated"] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const serviceDistribution = await AssistSession.aggregate([
        { $match: filter },
        { $group: { _id: "$serviceName", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      const clerkPerformance = await User.aggregate([
        { $match: clerkFilter },
        {
          $lookup: {
            from: "assistsessions",
            localField: "_id",
            foreignField: "clerkId",
            as: "sessions",
          },
        },
        {
          $project: {
            name: 1,
            sessions: { $size: "$sessions" },
            xp: "$islXp",
            level: "$islLevel",
            streak: "$currentStreak",
          },
        },
        { $sort: { xp: -1 } },
        { $limit: 20 },
      ]);

      const avgConfResult = await AssistSession.aggregate([
        { $match: { ...filter, outcome: "completed" } },
        { $group: { _id: null, avg: { $avg: "$averageConfidence" } } },
      ]);
      const avgConfidence = avgConfResult[0]?.avg || 0;

      return NextResponse.json({
        success: true,
        data: {
          totalSessions,
          completedSessions,
          escalatedSessions,
          avgConfidence,
          sessionsByDay,
          serviceDistribution: serviceDistribution.map((s) => ({ name: s._id, count: s.count })),
          clerkPerformance,
        },
      });
    } catch {
      return NextResponse.json({
        success: true,
        data: {
          totalSessions: 0,
          completedSessions: 0,
          escalatedSessions: 0,
          avgConfidence: 0,
          sessionsByDay: [],
          serviceDistribution: [],
          clerkPerformance: [],
        },
      });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
