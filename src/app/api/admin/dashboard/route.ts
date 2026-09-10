import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Feedback from "@/models/Feedback";
import AssistSession from "@/models/AssistSession";
import { requireTenantRole, buildTenantFilter } from "@/lib/db/tenancy";
import { calculateScore } from "@/lib/score/calculator";

export async function GET() {
  try {
    const { tenantUser, error } = await requireTenantRole("dept_admin");
    if (error) return error;

    try {
      await connectDB();
      const filter = buildTenantFilter(tenantUser!);
      const clerkFilter = { ...filter, role: "clerk" };

      const totalClerks = await User.countDocuments(clerkFilter);
      const activeClerks = await User.countDocuments({ ...clerkFilter, status: "active" });
      const totalSessions = await AssistSession.countDocuments(filter);
      const completedSessions = await AssistSession.countDocuments({ ...filter, outcome: "completed" });
      const escalatedSessions = await AssistSession.countDocuments({ ...filter, outcome: "escalated" });
      const totalFeedback = await Feedback.countDocuments(filter);
      const positiveFeedback = await Feedback.countDocuments({ ...filter, attempted: true });

      const avgXp = await User.aggregate([
        { $match: clerkFilter },
        { $group: { _id: null, avg: { $avg: "$islXp" } } },
      ]);

      const avgRating = totalFeedback > 0 ? (await Feedback.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]))[0]?.avg || 0 : 0;

      const signsLearned = await User.aggregate([
        { $match: clerkFilter },
        { $group: { _id: null, total: { $sum: "$totalCompleted" } } },
      ]);

      const score = calculateScore({
        totalSessions,
        completedSessions,
        escalatedSessions,
        totalFeedback,
        positiveFeedback,
        averageRating: avgRating,
        activeLearners: activeClerks,
        totalStaff: totalClerks,
        signsLearned: signsLearned[0]?.total || 0,
        totalSignsAvailable: 150,
        systemUptime: 99.5,
      });

      return NextResponse.json({
        success: true,
        data: {
          totalClerks,
          activeClerks,
          totalSessions,
          completedSessions,
          escalatedSessions,
          totalFeedback,
          positiveFeedback,
          averageXp: avgXp[0]?.avg || 0,
          sugamyaScore: score,
        },
      });
    } catch {
      return NextResponse.json({
        success: true,
        data: {
          totalClerks: 0,
          activeClerks: 0,
          totalSessions: 0,
          completedSessions: 0,
          escalatedSessions: 0,
          totalFeedback: 0,
          positiveFeedback: 0,
          averageXp: 0,
          sugamyaScore: {
            overall: 0,
            communicationReadiness: 0,
            clerkLearning: 0,
            assistedInteraction: 0,
            citizenFeedback: 0,
            safetyNet: 0,
            systemAvailability: 0,
          },
        },
      });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
