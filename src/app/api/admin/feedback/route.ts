import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";
import { requireTenantRole, buildTenantFilter } from "@/lib/db/tenancy";

export async function GET(request: Request) {
  try {
    const { tenantUser, error } = await requireTenantRole("dept_admin");
    if (error) return error;

    try {
      await connectDB();
      const filter = buildTenantFilter(tenantUser!);
      const { searchParams } = new URL(request.url);
      const dept = searchParams.get("department");
      const rating = searchParams.get("rating");

      const query: Record<string, unknown> = { ...filter };
      if (dept && dept !== "all") query.department = dept;
      if (rating && rating !== "all") query.rating = parseInt(rating);

      const feedback = await Feedback.find(query)
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();

      const total = await Feedback.countDocuments(filter);
      const positive = await Feedback.countDocuments({ ...filter, attempted: true });
      const avgResult = await Feedback.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]);
      const avgRating = avgResult[0]?.avg || 0;

      const departments = await Feedback.distinct("department", filter);

      return NextResponse.json({
        success: true,
        feedback,
        stats: {
          total,
          positive,
          negative: total - positive,
          rate: total > 0 ? Math.round((positive / total) * 100) : 0,
          avgRating: Math.round(avgRating * 10) / 10,
          departments,
        },
      });
    } catch {
      return NextResponse.json({ success: true, feedback: [], stats: { total: 0, positive: 0, negative: 0, rate: 0, avgRating: 0, departments: [] } });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
