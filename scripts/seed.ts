// Production seed script for MongoDB Atlas
// Usage: npx tsx scripts/seed.ts
// Requires MONGODB_URI environment variable (or .env file)

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sanket";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, enum: ["learner", "admin", "superadmin"], default: "learner" },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalCompleted: { type: Number, default: 0 },
  lastCompletedDate: { type: String, default: null },
  isChampion: { type: Boolean, default: false },
  islXp: { type: Number, default: 0 },
  islLevel: { type: Number, default: 1 },
  islStreak: { type: Number, default: 0 },
  islBadges: { type: [String], default: [] },
  islSignsCompleted: { type: [String], default: [] },
}, { timestamps: true });

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const CompletionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  date: { type: String, required: true },
  correct: { type: Boolean, required: true },
}, { timestamps: true });

CompletionSchema.index({ userId: 1, date: -1 });
CompletionSchema.index({ moduleId: 1, userId: 1 });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Module = mongoose.models.Module || mongoose.model("Module", ModuleSchema);
const Completion = mongoose.models.Completion || mongoose.model("Completion", CompletionSchema);

async function seed() {
  console.log(`Connecting to ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")}...`);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Clear existing data
  await User.deleteMany({});
  await Module.deleteMany({});
  await Completion.deleteMany({});

  // Admins
  await User.create([
    { username: "admin", password: hashedPassword, name: "Super Admin", department: "Municipal", role: "superadmin" },
    { username: "wateradmin", password: hashedPassword, name: "Water Tax Manager", department: "Water Tax", role: "admin" },
  ]);

  // Learners
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

  const today = new Date().toISOString().split("T")[0];
  const streaks = [12, 8, 5, 3, 1, 0, 7, 4, 2, 0, 6, 1];

  const learners = await User.create(
    learnersData.map((l, i) => ({
      ...l,
      password: hashedPassword,
      role: "learner",
      currentStreak: streaks[i],
      longestStreak: streaks[i] + Math.floor(Math.random() * 5),
      totalCompleted: streaks[i] + Math.floor(Math.random() * 3),
      lastCompletedDate: streaks[i] > 0 ? today : null,
    }))
  );

  // Modules
  const modules = await Module.create([
    { title: "Sign: Thank You", videoUrl: "/videos/thank-you.mp4", question: "What does this sign mean?", options: ["Please", "Thank You", "Sorry", "Hello"], correctAnswer: "Thank You", order: 1, active: true },
    { title: "Sign: Please Wait", videoUrl: "/videos/please-wait.mp4", question: "What does this sign mean?", options: ["Come Here", "Go Away", "Please Wait", "Sit Down"], correctAnswer: "Please Wait", order: 2, active: true },
    { title: "Sign: Sign Here", videoUrl: "/videos/sign-here.mp4", question: "This sign instructs the citizen to:", options: ["Pay Here", "Sign Here", "Stand Here", "Wait Here"], correctAnswer: "Sign Here", order: 3, active: true },
    { title: "Sign: Water Bill", videoUrl: "/videos/water-bill.mp4", question: "Which department does this sign relate to?", options: ["Property Tax", "Police", "Water Bill", "Health"], correctAnswer: "Water Bill", order: 4, active: true },
    { title: "Sign: Submit", videoUrl: "/videos/submit.mp4", question: "What action does this sign indicate?", options: ["Cancel", "Submit", "Delete", "Print"], correctAnswer: "Submit", order: 5, active: true },
  ]);

  // Completions
  const completions: any[] = [];
  for (let i = 0; i < learners.length; i++) {
    const streak = streaks[i];
    for (let d = 0; d < Math.min(streak, modules.length); d++) {
      const date = new Date(Date.now() - d * 86400000).toISOString().split("T")[0];
      completions.push({
        userId: learners[i]._id,
        moduleId: modules[d]._id,
        date,
        correct: Math.random() > 0.2,
      });
    }
  }
  if (completions.length > 0) {
    await Completion.insertMany(completions);
  }

  const counts = {
    users: await User.countDocuments(),
    learners: learners.length,
    modules: modules.length,
    completions: completions.length,
  };

  console.log("Seed complete:", counts);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
