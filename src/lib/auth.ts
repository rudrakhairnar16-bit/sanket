import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { connectDB } from "./db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "sanket-dev-secret";

export interface JWTPayload {
  userId: string;
  username: string;
  role: "learner" | "admin" | "superadmin";
  department?: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function getAuthUser(
  req: NextRequest
): Promise<JWTPayload | null> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireRole(...roles: string[]) {
  return async (req: NextRequest) => {
    const user = await getAuthUser(req);
    if (!user) return null;
    if (!roles.includes(user.role)) return null;
    return user;
  };
}
