import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireTenantRole, buildUserFilter } from "@/lib/db/tenancy";

export async function GET(request: Request) {
  try {
    const { tenantUser, error } = await requireTenantRole("dept_admin");
    if (error) return error;

    try {
      await connectDB();
      const filter = buildUserFilter(tenantUser!);
      const { searchParams } = new URL(request.url);
      const role = searchParams.get("role");
      const status = searchParams.get("status");
      const search = searchParams.get("search") || "";

      const query: Record<string, unknown> = { ...filter };
      if (role && role !== "all") query.role = role;
      if (status && status !== "all") query.status = status;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { department: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
        ];
      }

      const staff = await User.find(query)
        .select("-password")
        .sort({ islXp: -1 })
        .limit(200)
        .lean();

      return NextResponse.json({ success: true, staff });
    } catch {
      return NextResponse.json({ success: true, staff: [] });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
