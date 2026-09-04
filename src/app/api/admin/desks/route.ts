import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireTenantRole, buildUserFilter } from "@/lib/db/tenancy";

export async function GET() {
  try {
    const { tenantUser, error } = await requireTenantRole("dept_admin");
    if (error) return error;

    try {
      await connectDB();
      const filter = buildUserFilter(tenantUser!);

      const desks = await User.aggregate([
        { $match: { ...filter, deskId: { $ne: "" } } },
        {
          $group: {
            _id: "$deskId",
            clerks: { $push: { _id: "$_id", name: "$name", username: "$username", status: "$status" } },
            clerkCount: { $sum: 1 },
            activeClerks: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return NextResponse.json({ success: true, desks });
    } catch {
      return NextResponse.json({ success: true, desks: [] });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
