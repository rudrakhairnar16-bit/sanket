import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { findMockUser } from "@/lib/mock-users";
import { isDBConfigured } from "@/lib/db";

export async function GET() {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    // Try real DB only if configured
    if (isDBConfigured()) {
      try {
        const { connectDB } = await import("@/lib/db");
        const { default: UserModel } = await import("@/models/User");
        await connectDB();
        const user = await UserModel.findById(auth.userId).select("-password");
        if (user) {
          return NextResponse.json({ success: true, user });
        }
      } catch {
        // DB failed — fall through to mock
      }
    }

    // Always fall back to mock users
    const mockUser = findMockUser(auth.username);
    if (!mockUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = mockUser as any;
    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
