import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import { mockFindByUsername, updateMockProfile } from "@/lib/mock-users";

export async function PATCH(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { name, department } = body;
  const update: { name?: string; department?: string } = {};
  if (name) update.name = name;
  if (department) update.department = department;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    await connectDB();
    const user = await User.findByIdAndUpdate(
      authUser.userId,
      { $set: update },
      { new: true }
    ).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        department: user.department,
        role: user.role,
      },
    });
  } catch {
    const mock = await mockFindByUsername(authUser.username);
    if (!mock) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    updateMockProfile(mock.id, update);
    return NextResponse.json({
      user: {
        id: mock.id,
        name: mock.name,
        username: mock.username,
        department: mock.department,
        role: mock.role,
      },
    });
  }
}
