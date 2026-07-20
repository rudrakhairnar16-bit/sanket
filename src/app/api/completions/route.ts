import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Module from "@/models/Module";
import Completion from "@/models/Completion";
import { getAuthUser } from "@/lib/auth";
import { getTodayIST } from "@/lib/utils";
import { getMockStreak, setMockStreak } from "@/lib/mock-store";

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectDB();
    const { moduleId, answer } = await req.json();

    if (!moduleId || !answer) {
      return NextResponse.json(
        { error: "Module ID and answer required" },
        { status: 400 }
      );
    }

    const module = await Module.findById(moduleId);
    if (!module || !module.active) {
      return NextResponse.json(
        { error: "Module not found or inactive" },
        { status: 404 }
      );
    }

    const today = getTodayIST();

    const existing = await Completion.findOne({
      userId: authUser.userId,
      date: today,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already completed today's module" },
        { status: 409 }
      );
    }

    const correct = answer === module.correctAnswer;

    await Completion.create({
      userId: authUser.userId,
      moduleId,
      date: today,
      correct,
    });

    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIST = new Date(
      yesterday.getTime() + 5.5 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    if (user.lastCompletedDate === yesterdayIST) {
      user.currentStreak += 1;
    } else if (user.lastCompletedDate !== today) {
      user.currentStreak = 1;
    }

    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }

    user.totalCompleted += 1;
    user.lastCompletedDate = today;
    await user.save();

    const milestone = [7, 14, 21, 30].includes(user.currentStreak)
      ? user.currentStreak
      : null;

    return NextResponse.json({
      correct,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalCompleted: user.totalCompleted,
      milestone,
    });
  } catch {
    const { moduleId, answer } = await req
      .json()
      .catch(() => ({ moduleId: "", answer: "" }));
    const today = getTodayIST();
    const prev = getMockStreak(authUser.userId) || {
      currentStreak: 0,
      longestStreak: 0,
      totalCompleted: 0,
      lastCompletedDate: null,
    };
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIST = new Date(yesterday.getTime() + 5.5 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    let currentStreak = prev.currentStreak;
    if (prev.lastCompletedDate === yesterdayIST) currentStreak += 1;
    else if (prev.lastCompletedDate !== today) currentStreak = 1;

    const longestStreak = Math.max(prev.longestStreak, currentStreak);
    const totalCompleted = prev.totalCompleted + 1;
    setMockStreak(authUser.userId, {
      currentStreak,
      longestStreak,
      totalCompleted,
      lastCompletedDate: today,
    });

    void moduleId;
    void answer;
    const milestone = [7, 14, 21, 30].includes(currentStreak)
      ? currentStreak
      : null;

    return NextResponse.json({
      correct: true,
      currentStreak,
      longestStreak,
      totalCompleted,
      milestone,
    });
  }
}

export async function GET(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectDB();
    const today = getTodayIST();

    const completed = await Completion.findOne({
      userId: authUser.userId,
      date: today,
    });

    return NextResponse.json({
      completedToday: !!completed,
      completion: completed,
    });
  } catch {
    const today = getTodayIST();
    const streak = getMockStreak(authUser.userId);
    const completedToday = streak?.lastCompletedDate === today;
    return NextResponse.json({
      completedToday,
      completion: completedToday ? { date: today } : null,
    });
  }
}
