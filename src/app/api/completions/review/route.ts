import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Completion from "@/models/Completion";
import Module from "@/models/Module";
import { getAuthUser } from "@/lib/auth";
import { getTodayIST } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectDB();

    const today = getTodayIST();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const startRange = new Date(
      threeDaysAgo.getTime() + 5.5 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];
    const endRange = new Date(twoDaysAgo.getTime() + 5.5 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const wrongAnswers = await Completion.find({
      userId: user.userId,
      correct: false,
      date: { $gte: startRange, $lte: endRange },
    });

    if (wrongAnswers.length === 0) {
      return NextResponse.json({ review: null });
    }

    const alreadyReviewed = await Completion.find({
      userId: user.userId,
      date: today,
      correct: true,
    });

    const reviewedModuleIds = alreadyReviewed.map((c) =>
      c.moduleId.toString()
    );

    const dueModules = wrongAnswers.filter(
      (w) => !reviewedModuleIds.includes(w.moduleId.toString())
    );

    if (dueModules.length === 0) {
      return NextResponse.json({ review: null });
    }

    const reviewModule = await Module.findById(dueModules[0].moduleId);

    if (!reviewModule || !reviewModule.active) {
      return NextResponse.json({ review: null });
    }

    return NextResponse.json({
      review: {
        module: reviewModule,
        originalDate: dueModules[0].date,
      },
    });
  } catch {
    return NextResponse.json({ review: null });
  }
}
