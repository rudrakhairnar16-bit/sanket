import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Module from "@/models/Module";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await connectDB();
  const mod = await Module.findById(params.id);
  if (!mod) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  return NextResponse.json({ module: mod });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req);
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();
    const data = await req.json();
    const mod = await Module.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    if (!mod) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ module: mod });
  } catch {
    return NextResponse.json(
      { error: "Failed to update module" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req);
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();
    const mod = await Module.findByIdAndDelete(params.id);
    if (!mod) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete module" },
      { status: 500 }
    );
  }
}
