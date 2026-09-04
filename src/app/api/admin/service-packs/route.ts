import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ServicePack from "@/models/ServicePack";
import { requireTenantRole, buildTenantFilter } from "@/lib/db/tenancy";

export async function GET() {
  try {
    const { tenantUser, error } = await requireTenantRole("dept_admin");
    if (error) return error;

    try {
      await connectDB();
      const filter = buildTenantFilter(tenantUser!);

      const packs = await ServicePack.find(filter)
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      const activePacks = packs.filter((p) => p.active).length;
      const totalSigns = packs.reduce((a, p) => a + p.supportedSigns.length, 0);
      const totalReplies = packs.reduce((a, p) => a + p.commonReplies.length, 0);

      return NextResponse.json({
        success: true,
        packs,
        stats: {
          total: packs.length,
          active: activePacks,
          totalSigns,
          totalReplies,
        },
      });
    } catch {
      return NextResponse.json({ success: true, packs: [], stats: { total: 0, active: 0, totalSigns: 0, totalReplies: 0 } });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
