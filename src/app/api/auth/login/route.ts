import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema, validateInput } from "@/lib/validation";
import { findMockUser } from "@/lib/mock-users";
import { isDBConfigured } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateInput(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const { username, password } = validation.data;

    // Try real DB only if configured
    let user: any = null;
    let source: "db" | "mock" = "mock";

    if (isDBConfigured()) {
      try {
        const { connectDB } = await import("@/lib/db");
        const { default: UserModel } = await import("@/models/User");
        await connectDB();
        user = await UserModel.findOne({ username: username.toLowerCase() });
        if (user) source = "db";
      } catch {
        // DB failed — fall through to mock
      }
    }

    // Demo users are a deliberate prototype path, disabled when DEMO_MODE=false.
    if (!user && process.env.DEMO_MODE !== 'false') {
      user = findMockUser(username);
      source = "mock";
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    let isMatch = false;
    if (source === "db") {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === "demo123";
    }

    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({
      userId: user._id?.toString?.() ?? user._id,
      username: user.username,
      role: user.role,
      name: user.name,
    });

    await setAuthCookie(token);

    // Audit — fire and forget
    try {
      if (isDBConfigured()) {
        const { logAudit } = await import("@/lib/audit");
        await logAudit({
          userId: user._id?.toString?.() ?? user._id,
          username: user.username,
          role: user.role,
          action: "login",
          details: "User logged in",
        });
      }
    } catch {}

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id?.toString?.() ?? user._id,
        username: user.username,
        name: user.name,
        department: user.department,
        role: user.role,
        islXp: user.islXp ?? 0,
        islLevel: user.islLevel ?? 1,
        islStreak: user.islStreak ?? 0,
        currentStreak: user.currentStreak ?? 0,
        longestStreak: user.longestStreak ?? 0,
        isChampion: user.isChampion ?? false,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
