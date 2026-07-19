import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Module from "@/models/Module";
import Completion from "@/models/Completion";
import { getTodayIST } from "@/lib/utils";

export async function POST() {
  try {
    await connectDB();

    const existing = await User.countDocuments();
    if (existing > 0) {
      return NextResponse.json(
        { error: "Database already has data. Drop collections first to reseed." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      username: "admin",
      password: hashedPassword,
      name: "Super Admin",
      department: "Municipal",
      role: "superadmin",
    });

    await User.create({
      username: "wateradmin",
      password: hashedPassword,
      name: "Water Tax Manager",
      department: "Water Tax",
      role: "admin",
    });

    const learnersData = [
      { username: "ramesh", name: "Ramesh Gupta", department: "Water Tax" },
      { username: "sita", name: "Sita Sharma", department: "Water Tax" },
      { username: "amit", name: "Amit Singh", department: "Property Tax" },
      { username: "priya", name: "Priya Patel", department: "Property Tax" },
      { username: "vikram", name: "Vikram Joshi", department: "Police" },
      { username: "anita", name: "Anita Desai", department: "Police" },
      { username: "rajesh", name: "Rajesh Kumar", department: "Municipal" },
      { username: "neha", name: "Neha Verma", department: "Municipal" },
      { username: "suresh", name: "Suresh Reddy", department: "Health" },
      { username: "kavita", name: "Kavita Mehta", department: "Health" },
      { username: "deepak", name: "Deepak Yadav", department: "Education" },
      { username: "pooja", name: "Pooja Jain", department: "Education" },
    ];

    const today = getTodayIST();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIST = new Date(
      yesterday.getTime() + 5.5 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    const learners = [];
    for (const l of learnersData) {
      const learner = await User.create({
        ...l,
        password: hashedPassword,
        role: "learner",
        currentStreak: 0,
        longestStreak: 0,
        totalCompleted: 0,
        lastCompletedDate: null,
      });
      learners.push(learner);
    }

    const streaks = [12, 8, 5, 3, 1, 0, 7, 4, 2, 0, 6, 1];
    for (let i = 0; i < learners.length; i++) {
      const streak = streaks[i];
      learners[i].currentStreak = streak;
      learners[i].longestStreak = Math.max(streak, Math.floor(Math.random() * 5) + streak);
      learners[i].totalCompleted = streak + Math.floor(Math.random() * 3);
      learners[i].lastCompletedDate = streak > 0 ? today : null;
      await learners[i].save();
    }

    const modules = await Module.create([
      {
        title: "Sign: Thank You",
        videoUrl: "/videos/thank-you.mp4",
        question: "What does this sign mean?",
        options: ["Please", "Thank You", "Sorry", "Hello"],
        correctAnswer: "Thank You",
        order: 1,
        active: true,
      },
      {
        title: "Sign: Please Wait",
        videoUrl: "/videos/please-wait.mp4",
        question: "What does this sign mean?",
        options: ["Come Here", "Go Away", "Please Wait", "Sit Down"],
        correctAnswer: "Please Wait",
        order: 2,
        active: true,
      },
      {
        title: "Sign: Sign Here",
        videoUrl: "/videos/sign-here.mp4",
        question: "This sign instructs the citizen to:",
        options: ["Pay Here", "Sign Here", "Stand Here", "Wait Here"],
        correctAnswer: "Sign Here",
        order: 3,
        active: true,
      },
      {
        title: "Sign: Water Bill",
        videoUrl: "/videos/water-bill.mp4",
        question: "Which department does this sign relate to?",
        options: ["Property Tax", "Police", "Water Bill", "Health"],
        correctAnswer: "Water Bill",
        order: 4,
        active: true,
      },
      {
        title: "Sign: Submit",
        videoUrl: "/videos/submit.mp4",
        question: "What action does this sign indicate?",
        options: ["Cancel", "Submit", "Delete", "Print"],
        correctAnswer: "Submit",
        order: 5,
        active: true,
      },
    ]);

    for (let i = 0; i < learners.length; i++) {
      const streak = streaks[i];
      for (let d = 0; d < Math.min(streak, modules.length); d++) {
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() - d);
        const dateStr = new Date(
          completionDate.getTime() + 5.5 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0];

        await Completion.create({
          userId: learners[i]._id,
          moduleId: modules[d]._id,
          date: dateStr,
          correct: Math.random() > 0.2,
        });
      }
    }

    return NextResponse.json({
      message: "Seed data created successfully",
      stats: {
        users: 14,
        learners: learners.length,
        modules: modules.length,
        completions: await Completion.countDocuments(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
