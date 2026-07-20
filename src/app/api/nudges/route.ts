import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Nudge from "@/models/Nudge";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const admin = await getAuthUser(req);
  if (!admin || (admin.role !== "admin" && admin.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();

  const body = await req.json();
  const { clerkIds, reason } = body;

  if (!clerkIds || !Array.isArray(clerkIds) || clerkIds.length === 0) {
    return NextResponse.json({ error: "No clerks selected" }, { status: 400 });
  }

  const clerks = await User.find({ _id: { $in: clerkIds } }).select(
    "name department"
  );

  const nudges = clerks.map((clerk) => ({
    clerkId: clerk._id.toString(),
    clerkName: clerk.name,
    department: clerk.department,
    type: "whatsapp" as const,
    sentAt: new Date(),
    delivered: true,
    reason: reason || "missed-lesson",
  }));

  await Nudge.insertMany(nudges);

  return NextResponse.json({
    success: true,
    count: nudges.length,
    message: `Nudge sent to ${nudges.length} clerk(s)`,
  });
}

export async function GET(req: NextRequest) {
  const admin = await getAuthUser(req);
  if (!admin || (admin.role !== "admin" && admin.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();

  const url = new URL(req.url);
  const days = parseInt(url.searchParams.get("days") || "7", 10);

  const since = new Date();
  since.setDate(since.getDate() - days);

  const nudges = await Nudge.find({ sentAt: { $gte: since } })
    .sort({ sentAt: -1 })
    .limit(50);

  return NextResponse.json({ nudges });
}
