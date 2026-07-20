import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import { toggleMockChampion } from "@/lib/mock-users";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getAuthUser(req);
  if (!admin || (admin.role !== "admin" && admin.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.isChampion = !user.isChampion;
    await user.save();

    return NextResponse.json({
      success: true,
      isChampion: user.isChampion,
      name: user.name,
    });
  } catch {
    const result = toggleMockChampion(params.id);
    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      isChampion: result.isChampion,
      name: result.name,
    });
  }
}
