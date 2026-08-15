import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const DEV_SECRET = "sanket-dev-secret-change-in-production";

export function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set in environment");
  if (secret === DEV_SECRET && process.env.NODE_ENV === "development") {
    console.warn("WARNING: Using default dev JWT_SECRET. Set a strong secret in production.");
  }
  return secret;
}

export interface JWTPayload {
  userId: string;
  username: string;
  role: "learner" | "admin" | "superadmin";
  department?: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJWTSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, getJWTSecret()) as JWTPayload;
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJWTSecret()) as JWTPayload;
  } catch {
    return null;
  }
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


