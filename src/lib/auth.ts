import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set in environment");
  return secret;
}
const JWT_SECRET = getJWTSecret();

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


