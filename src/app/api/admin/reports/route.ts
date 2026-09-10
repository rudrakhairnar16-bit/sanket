import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Feedback from "@/models/Feedback";
import AssistSession from "@/models/AssistSession";
import { requireTenantRole, buildTenantFilter } from "@/lib/db/tenancy";
import { calculateScore } from "@/lib/score/calculator";

export async function GET(request: Request) {
  try {
    const { tenantUser, error } = await requireTenantRole("dept_admin");
    if (error) return error;

    try {
      await connectDB();
      const filter = buildTenantFilter(tenantUser!);
      const clerkFilter = { ...filter, role: "clerk" };
      const { searchParams } = new URL(request.url);
      const reportType = searchParams.get("type") || "monthly";

      const totalClerks = await User.countDocuments(clerkFilter);
      const activeClerks = await User.countDocuments({ ...clerkFilter, status: "active" });
      const totalSessions = await AssistSession.countDocuments(filter);
      const completedSessions = await AssistSession.countDocuments({ ...filter, outcome: "completed" });
      const escalatedSessions = await AssistSession.countDocuments({ ...filter, outcome: "escalated" });
      const totalFeedback = await Feedback.countDocuments(filter);
      const positiveFeedback = await Feedback.countDocuments({ ...filter, attempted: true });

      const avgRatingResult = await Feedback.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]);
      const avgRating = avgRatingResult[0]?.avg || 0;

      const avgXpResult = await User.aggregate([
        { $match: clerkFilter },
        { $group: { _id: null, avg: { $avg: "$islXp" } } },
      ]);
      const avgXp = avgXpResult[0]?.avg || 0;

      const score = calculateScore({
        totalSessions,
        completedSessions,
        escalatedSessions,
        totalFeedback,
        positiveFeedback,
        averageRating: avgRating,
        activeLearners: activeClerks,
        totalStaff: totalClerks,
        signsLearned: 0,
        totalSignsAvailable: 150,
        systemUptime: 99.5,
      });

      return NextResponse.json({
        success: true,
        report: {
          type: reportType,
          generatedAt: new Date().toISOString(),
          summary: {
            totalClerks,
            activeClerks,
            totalSessions,
            completedSessions,
            escalatedSessions,
            totalFeedback,
            positiveFeedback,
            avgRating: Math.round(avgRating * 10) / 10,
            avgXp: Math.round(avgXp),
          },
          sugamyaScore: score,
        },
      });
    } catch {
      return NextResponse.json({ success: true, report: null });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
