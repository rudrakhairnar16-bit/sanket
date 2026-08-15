import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import { mockFindByUsername, updateMockProfile, mockToPublic } from "@/lib/mock-users";

export async function PATCH(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    department,
    designation,
    employeeId,
    phone,
    email,
    officeLocation,
    city,
    bio,
    profilePhoto,
  } = body;
  const update: Record<string, string> = {};
  if (name) update.name = name;
  if (department) update.department = department;
  if (designation !== undefined) update.designation = designation;
  if (employeeId !== undefined) update.employeeId = employeeId;
  if (phone !== undefined) update.phone = phone;
  if (email !== undefined) update.email = email;
  if (officeLocation !== undefined) update.officeLocation = officeLocation;
  if (city !== undefined) update.city = city;
  if (bio !== undefined) update.bio = bio;
  if (profilePhoto !== undefined) update.profilePhoto = profilePhoto;

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
    return NextResponse.json({ user });
  } catch {
    const mock = await mockFindByUsername(authUser.username);
    if (!mock) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    updateMockProfile(mock.id, update);
    return NextResponse.json({ user: mockToPublic(mock) });
  }
}
