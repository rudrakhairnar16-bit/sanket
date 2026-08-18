import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

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
      result.userCount = await User.countDocuments();
      result.superadminCount = await User.countDocuments({ role: "superadmin" });
      result.users = await User.find({}).select("username role department name").lean();
    } catch (err) {
      result.connected = false;
      result.error = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json(result);
}