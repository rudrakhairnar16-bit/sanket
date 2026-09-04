import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Module from "@/models/Module";
import { requireRole } from "@/lib/api-helpers";

export async function GET() {
  try {
    try {
      await connectDB();
      const modules = await Module.find({ active: true }).sort({ order: 1 }).lean();
      return NextResponse.json({ success: true, modules });
    } catch {
      const { mockModules } = await import("@/lib/mock-modules");
      return NextResponse.json({ success: true, modules: mockModules });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { auth, error } = await requireRole('super_admin', 'dept_admin', 'org_admin');
    if (error) return error;

    const body = await request.json();
    try {
      await connectDB();
      const newModule = await Module.create(body);
      return NextResponse.json({ success: true, module: newModule });
    } catch {
      return NextResponse.json({ success: false, error: "Failed to create module" }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
