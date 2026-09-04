import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";
import { getAuthFromCookies } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
  try {
    try {
      await connectDB();
      const auth = await getAuthFromCookies();
      let filter: Record<string, unknown> = {};
      if (auth) {
        const user = await User.findById(auth.userId).lean();
        if (user) {
          if (user.role === "state_admin") {
            filter = { state: user.state };
          } else if (!["national_admin", "super_admin"].includes(user.role)) {
            filter = { organizationId: user.organizationId };
          }
        }
      }

      const total = await Feedback.countDocuments(filter);
      const positive = await Feedback.countDocuments({ ...filter, attempted: true });
      const byDepartment = await Feedback.aggregate([
        { $match: filter },
        { $group: { _id: "$department", total: { $sum: 1 }, positive: { $sum: { $cond: ["$attempted", 1, 0] } } } },
      ]);

      return NextResponse.json({
        success: true,
        stats: {
          total,
          positive,
          negative: total - positive,
          rate: total > 0 ? Math.round((positive / total) * 100) : 0,
          byDepartment,
        },
      });
    } catch {
      return NextResponse.json({
        success: true,
        stats: { total: 0, positive: 0, negative: 0, rate: 0, byDepartment: [] },
      });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
