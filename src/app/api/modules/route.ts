import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Module from "@/models/Module";
import { getAuthUser } from "@/lib/auth";
import { MOCK_MODULES } from "@/lib/mock-modules";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectDB();
    if (user.role === "admin" || user.role === "superadmin") {
      const modules = await Module.find().sort({ order: 1 });
      return NextResponse.json({ modules });
    }
    const modules = await Module.find({ active: true }).sort({ order: 1 });
    return NextResponse.json({ modules });
  } catch {
    const modules =
      user.role === "admin" || user.role === "superadmin"
        ? MOCK_MODULES
        : MOCK_MODULES.filter((m) => m.active);
    return NextResponse.json({ modules });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();
    const data = await req.json();
    const mod = await Module.create(data);
    return NextResponse.json({ module: mod }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}
