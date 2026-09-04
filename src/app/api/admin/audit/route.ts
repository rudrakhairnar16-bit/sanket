import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AuditLog from "@/models/AuditLog";
import { requireTenantRole, buildTenantFilter } from "@/lib/db/tenancy";

export async function GET(request: Request) {
  try {
    const { tenantUser, error } = await requireTenantRole("dept_admin");
    if (error) return error;

    try {
      await connectDB();
      const filter = buildTenantFilter(tenantUser!);
      const { searchParams } = new URL(request.url);
      const action = searchParams.get("action");

      const query: Record<string, unknown> = { ...filter };
      if (action && action !== "all") query.action = action;

      const logs = await AuditLog.find(query)
        .sort({ timestamp: -1 })
        .limit(200)
        .lean();

      const actionTypes = await AuditLog.distinct("action", filter);
      const successCount = await AuditLog.countDocuments({ ...filter, result: "success" });
      const failedCount = await AuditLog.countDocuments({ ...filter, result: "failure" });
      const uniqueUsers = await AuditLog.distinct("userId", filter);

      return NextResponse.json({
        success: true,
        logs,
        stats: {
          total: logs.length,
          successCount,
          failedCount,
          uniqueUsers: uniqueUsers.length,
          actionTypes,
        },
      });
    } catch {
      return NextResponse.json({ success: true, logs: [], stats: { total: 0, successCount: 0, failedCount: 0, uniqueUsers: 0, actionTypes: [] } });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
