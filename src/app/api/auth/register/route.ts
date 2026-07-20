import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import {
  mockFindByUsername,
  mockCreateUser,
  mockToPublic,
} from "@/lib/mock-users";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, name, department, role } = body;

    if (!username || !password || !name || !department) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
        sameSite: "lax",
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
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
      return res;
    }
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
