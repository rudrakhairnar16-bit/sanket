import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { registerSchema, validateInput } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateInput(registerSchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const { username, password, name, department, role } = validation.data;

    try {
      await connectDB();
      const existing = await User.findOne({ username: username.toLowerCase() });
      if (existing) {
        return NextResponse.json({ success: false, error: "Username already taken" }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create({
        username: username.toLowerCase(),
        password: hashedPassword,
        name,
        department,
        role: role || "clerk",
      });

      const token = signToken({
        userId: user._id.toString(),
        username: user.username,
        role: user.role,
        name: user.name,
      });

      await setAuthCookie(token);

      return NextResponse.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          department: user.department,
          role: user.role,
        },
      });
    } catch {
      return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
