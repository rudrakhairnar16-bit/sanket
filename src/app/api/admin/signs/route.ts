import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireTenantRole } from "@/lib/db/tenancy";

export async function GET(request: Request) {
  try {
    const { tenantUser, error } = await requireTenantRole("dept_admin");
    if (error) return error;

    try {
      await connectDB();
      const { municipalSigns, signCategories } = await import("@/data/signs/municipal-signs");
      const { searchParams } = new URL(request.url);
      const category = searchParams.get("category");
      const status = searchParams.get("status");
      const search = searchParams.get("search") || "";

      let filtered = municipalSigns;
      if (category && category !== "all") {
        filtered = filtered.filter((s: any) => s.category === category);
      }
      if (status && status !== "all") {
        filtered = filtered.filter((s: any) => s.reviewStatus === status);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (s: any) =>
            s.name.toLowerCase().includes(q) ||
            s.nameHi.includes(search) ||
            s.id.toLowerCase().includes(q)
        );
      }

      return NextResponse.json({
        success: true,
        signs: filtered,
        categories: signCategories,
        total: filtered.length,
      });
    } catch {
      return NextResponse.json({ success: true, signs: [], categories: [], total: 0 });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
