import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { mockFindByUsername, mockToPublic } from "@/lib/mock-users";
import { checkRateLimit, getRateLimitRemaining } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const isLocal = ip === "unknown" || ip === "127.0.0.1" || ip === "::1" || ip === "localhost";
    if (!isLocal && !checkRateLimit(`login:${ip}`)) {
      return NextResponse.json(
        { error: "Too many attempts. Try again in 60 seconds." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      const user = await User.findOne({ username });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("login db path error:", error);
      let mockUser = null;
      try {
        mockUser = await mockFindByUsername(username);
        if (!mockUser || !(await bcrypt.compare(password, mockUser.password))) {
          return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
          );
        }
      } catch (mockError) {
        console.error("login mock path error:", mockError);
        const msg =
          mockError instanceof Error ? mockError.message : String(mockError);
        return NextResponse.json(
          { error: "Login failed", detail: "mock: " + msg.slice(0, 300) },
          { status: 500 }
        );
      }
      if (!mockUser) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const token = signToken({
        userId: mockUser.id,
        username: mockUser.username,
        role: mockUser.role,
        department: mockUser.department,
      });

      const res = NextResponse.json({ user: mockToPublic(mockUser) });
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
      return res;
    }
  } catch (error) {
    console.error("login route error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Login failed", detail: msg.slice(0, 300) },
      { status: 500 }
    );
  }
}
