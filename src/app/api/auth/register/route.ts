import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import {
  mockFindByUsername,
  mockCreateUser,
  mockToPublic,
} from "@/lib/mock-users";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const isLocal = ip === "unknown" || ip === "127.0.0.1" || ip === "::1" || ip === "localhost";
    if (!isLocal && !checkRateLimit(`register:${ip}`, 5)) {
      return NextResponse.json(
        { error: "Too many attempts. Try again in 60 seconds." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password, name, department, role } = body;

    if (!username || !password || !name || !department) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters with 1 uppercase letter and 1 digit" },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      const existing = await User.findOne({ username });
      if (existing) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        );
      }

      const user = await User.create({
        username,
        password,
        name,
        department,
        role: role || "learner",
      });

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
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return res;
    } catch {
      const existing = await mockFindByUsername(username);
      if (existing) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        );
      }
      const user = await mockCreateUser({
        username,
        password,
        name,
        department,
        role: role || "learner",
      });
      const token = signToken({
        userId: user.id,
        username: user.username,
        role: user.role,
        department: user.department,
      });

      const res = NextResponse.json({ user: mockToPublic(user) });
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
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
