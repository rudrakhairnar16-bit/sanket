import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Feedback from "@/models/Feedback";
import { getAuthUser } from "@/lib/auth";
import { getTodayIST } from "@/lib/utils";
import { mockFindByUsername } from "@/lib/mock-users";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const clerkUsername = body?.clerkUsername;
  const attempted = body?.attempted;
  const comment = body?.comment;

  if (!clerkUsername || attempted === undefined) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const clerk = await User.findOne({ username: clerkUsername });
    if (!clerk) {
      return NextResponse.json(
        { error: "Clerk not found" },
        { status: 404 }
      );
    }

    const feedback = await Feedback.create({
      clerkId: clerk._id,
      clerkName: clerk.name,
      department: clerk.department,
      attempted,
      comment: comment || "",
      date: getTodayIST(),
    });

    return NextResponse.json({ success: true, feedback });
  } catch {
    const mockClerk = await mockFindByUsername(clerkUsername).catch(() => null);
    if (!mockClerk || mockClerk.role !== "learner") {
      return NextResponse.json(
        { error: "Failed to submit feedback" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      feedback: {
        clerkId: mockClerk.id,
        clerkName: mockClerk.name,
        department: mockClerk.department,
        attempted,
        comment: comment || "",
        date: getTodayIST(),
      },
    });
  }
}

export async function GET(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser || (authUser.role !== "admin" && authUser.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const clerkId = searchParams.get("clerkId");
  const department = searchParams.get("department");

  try {
    await connectDB();

    const filter: Record<string, unknown> = {};
    if (clerkId) filter.clerkId = clerkId;
    if (department) filter.department = department;

    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const total = await Feedback.countDocuments(filter);
    const positive = await Feedback.countDocuments({ ...filter, attempted: true });
    const negative = await Feedback.countDocuments({ ...filter, attempted: false });

    return NextResponse.json({
      feedbacks,
      stats: {
        total,
        positive,
        negative,
        satisfactionRate: total > 0 ? Math.round((positive / total) * 100) : 0,
      },
    });
  } catch {
    return NextResponse.json({
      feedbacks: [],
      stats: { total: 0, positive: 0, negative: 0, satisfactionRate: 0 },
    });
  }
}
