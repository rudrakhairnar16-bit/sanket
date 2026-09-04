import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  department: string;
  role: "clerk" | "interpreter" | "dept_admin" | "org_admin" | "state_admin" | "national_admin" | "super_admin";
  designation?: string;
  employeeId?: string;
  phone?: string;
  email?: string;
  officeLocation?: string;
  city?: string;
  state?: string;
  organizationId?: string;
  departmentId?: string;
  deskId?: string;
  language: "en" | "hi" | "mr" | "gu";
  status: "active" | "inactive" | "suspended";
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  lastCompletedDate?: string;
  isChampion: boolean;
  islXp: number;
  islLevel: number;
  islStreak: number;
  islBadges: string[];
  islSignsCompleted: string[];
  feedbackGiven: number;
  qrScanned: number;
  lastNudgeDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["clerk", "interpreter", "dept_admin", "org_admin", "state_admin", "national_admin", "super_admin"],
      default: "clerk",
    },
    designation: { type: String, default: "" },
    employeeId: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    officeLocation: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    organizationId: { type: String, default: "" },
    departmentId: { type: String, default: "" },
    deskId: { type: String, default: "" },
    language: { type: String, enum: ["en", "hi", "mr", "gu"], default: "en" },
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalCompleted: { type: Number, default: 0 },
    lastCompletedDate: { type: String, default: "" },
    isChampion: { type: Boolean, default: false },
    islXp: { type: Number, default: 0 },
    islLevel: { type: Number, default: 1 },
    islStreak: { type: Number, default: 0 },
    islBadges: [{ type: String }],
    islSignsCompleted: [{ type: String }],
    feedbackGiven: { type: Number, default: 0 },
    qrScanned: { type: Number, default: 0 },
    lastNudgeDate: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.index({ department: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ organizationId: 1 });
UserSchema.index({ state: 1 });
UserSchema.index({ organizationId: 1, role: 1 });
UserSchema.index({ islXp: -1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
