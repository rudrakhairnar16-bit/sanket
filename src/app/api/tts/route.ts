import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TTS is handled client-side via Web Speech API
    // This route exists for future server-side TTS if needed
    return NextResponse.json({ success: true, message: "Use client-side Web Speech API" });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
