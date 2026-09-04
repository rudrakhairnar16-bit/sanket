import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Feedback from "@/models/Feedback";
import AssistSession from "@/models/AssistSession";
import { requireTenantRole, buildTenantFilter } from "@/lib/db/tenancy";

export async function GET() {
  try {
    const { tenantUser, error } = await requireTenantRole("dept_admin");
    if (error) return error;

    try {
      await connectDB();
      const filter = buildTenantFilter(tenantUser!);

      const deptStats = await User.aggregate([
        { $match: { ...filter, role: "clerk" } },
        {
          $group: {
            _id: "$department",
            staffCount: { $sum: 1 },
            activeStaff: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
            totalXp: { $sum: "$islXp" },
            avgLevel: { $avg: "$islLevel" },
          },
        },
        { $sort: { staffCount: -1 } },
      ]);

      const feedbackByDept = await Feedback.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$department",
            total: { $sum: 1 },
            positive: { $sum: { $cond: ["$attempted", 1, 0] } },
            avgRating: { $avg: "$rating" },
          },
        },
      ]);

      const feedbackMap = new Map(feedbackByDept.map((f) => [f._id, f]));

      const departments = deptStats.map((dept) => {
        const fb = feedbackMap.get(dept._id) || { total: 0, positive: 0, avgRating: 0 };
        return {
          id: dept._id,
          name: dept._id,
          staffCount: dept.staffCount,
          activeStaff: dept.activeStaff,
          totalXp: dept.totalXp,
          avgLevel: Math.round(dept.avgLevel || 0),
          feedbackCount: fb.total,
          positiveFeedback: fb.positive,
          avgRating: Math.round((fb.avgRating || 0) * 10) / 10,
          satisfaction: fb.total > 0 ? Math.round((fb.positive / fb.total) * 100) : 0,
        };
      });

      return NextResponse.json({ success: true, departments });
    } catch {
      return NextResponse.json({ success: true, departments: [] });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
