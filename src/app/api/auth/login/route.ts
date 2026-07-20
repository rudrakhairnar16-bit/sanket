import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { mockFindByUsername, mockToPublic } from "@/lib/mock-users";

export async function POST(req: NextRequest) {
  try {
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
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
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
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
      return res;
    }
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
