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
    if (!checkRateLimit(`login:${ip}`)) {
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

      const token = signToken({
        userId: user._id.toString(),
        username: user.username,
        role: user.role,
        department: user.department,
      });

      const res = NextResponse.json({
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          department: user.department,
          role: user.role,
        },
      });

      res.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return res;
    } catch {
      const user = await mockFindByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const token = signToken({
        userId: user.id,
        username: user.username,
        role: user.role,
        department: user.department,
      });

      const res = NextResponse.json({ user: mockToPublic(user) });
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
      return res;
    }
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
