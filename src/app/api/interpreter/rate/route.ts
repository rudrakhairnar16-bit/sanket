import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

const ratings = new Map<string, { sessionId: string; clerkId: string; clerkName: string; clerkDepartment: string; rating: number; comment: string; time: number }[]>();

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { sessionId, clerkId, clerkName, clerkDepartment, rating, comment } = await req.json();
    if (!sessionId || !clerkId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Valid sessionId, clerkId, and rating (1-5) required" }, { status: 400 });
    }

    const clerkRatings = ratings.get(clerkId) || [];
    clerkRatings.push({ sessionId, clerkId, clerkName: clerkName || "Unknown", clerkDepartment: clerkDepartment || "", rating, comment: comment || "", time: Date.now() });
    ratings.set(clerkId, clerkRatings);

    const avg = clerkRatings.reduce((s, r) => s + r.rating, 0) / clerkRatings.length;

    return NextResponse.json({
      clerkId,
      averageRating: Math.round(avg * 10) / 10,
      totalRatings: clerkRatings.length,
      rating,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const clerkId = req.nextUrl.searchParams.get("clerkId");
  if (!clerkId) return NextResponse.json({ error: "clerkId required" }, { status: 400 });

  const clerkRatings = ratings.get(clerkId) || [];
  const avg = clerkRatings.length > 0 ? clerkRatings.reduce((s, r) => s + r.rating, 0) / clerkRatings.length : 0;

  return NextResponse.json({
    clerkId,
    averageRating: Math.round(avg * 10) / 10,
    totalRatings: clerkRatings.length,
    recentRatings: clerkRatings.slice(-5).reverse(),
  });
}
