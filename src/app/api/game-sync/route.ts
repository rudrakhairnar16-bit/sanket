import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { xp, level, streak, badges, completedSigns } = body;

  if (xp === undefined || level === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectDB();

  await User.findByIdAndUpdate(user.userId, {
    islXp: xp,
    islLevel: level,
    islStreak: streak ?? 0,
    islBadges: badges ?? [],
    islSignsCompleted: completedSigns ?? [],
  });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await connectDB();

  const found = await User.findById(user.userId).select(
    "islXp islLevel islStreak islBadges islSignsCompleted"
  );

  return NextResponse.json({
    islXp: found?.islXp ?? 0,
    islLevel: found?.islLevel ?? 1,
    islStreak: found?.islStreak ?? 0,
    islBadges: found?.islBadges ?? [],
    islSignsCompleted: found?.islSignsCompleted ?? [],
  });
}
