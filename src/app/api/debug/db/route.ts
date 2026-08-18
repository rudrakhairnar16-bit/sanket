import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

function maskUri(uri: string) {
  try {
    return uri.replace(/\/\/[^@]+@/, "//***:***@");
  } catch {
    return "unparseable";
  }
}

export async function GET() {
  const uri = process.env.MONGODB_URI;
  const result: Record<string, unknown> = {
    hasUri: !!uri,
    maskedUri: uri ? maskUri(uri) : null,
    uriLength: uri ? uri.length : 0,
    jwtSecretDefined: !!process.env.JWT_SECRET,
  };

  if (uri) {
    try {
      await connectDB();
      result.connected = true;
    } catch (err) {
      result.connected = false;
      result.error = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json(result);
}