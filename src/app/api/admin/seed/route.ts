import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Module from "@/models/Module";
import { getAuthFromCookies } from "@/lib/auth";
import { mockUsers } from "@/lib/mock-users";
import { mockModules } from "@/lib/mock-modules";

export async function POST() {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "super_admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    // Seed users
    for (const mockUser of mockUsers) {
      const exists = await User.findOne({ username: mockUser.username });
      if (!exists) {
        const hashedPassword = await bcrypt.hash("admin123", 12);
        await User.create({ ...mockUser, password: hashedPassword });
      }
    }

    // Seed modules
    for (const mockModule of mockModules) {
      const exists = await Module.findOne({ title: mockModule.title });
      if (!exists) {
        await Module.create(mockModule);
      }
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch {
    return NextResponse.json({ success: false, error: "Seeding failed" }, { status: 500 });
  }
}
