import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  department: string;
  role: "learner" | "admin" | "superadmin";
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  lastCompletedDate: string | null;
  islXp: number;
  islLevel: number;
  islStreak: number;
  islBadges: string[];
  islSignsCompleted: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    role: {
      type: String,
      enum: ["learner", "admin", "superadmin"],
      default: "learner",
    },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalCompleted: { type: Number, default: 0 },
    lastCompletedDate: { type: String, default: null },
    islXp: { type: Number, default: 0 },
    islLevel: { type: Number, default: 1 },
    islStreak: { type: Number, default: 0 },
    islBadges: { type: [String], default: [] },
    islSignsCompleted: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
