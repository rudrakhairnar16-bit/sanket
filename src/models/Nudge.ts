import mongoose, { Schema, Document } from "mongoose";

export interface INudge extends Document {
  clerkId: string;
  clerkName: string;
  department: string;
  type: "whatsapp" | "sms" | "email";
  sentAt: Date;
  delivered: boolean;
  reason: string;
}

const NudgeSchema = new Schema<INudge>(
  {
    clerkId: { type: String, required: true },
    clerkName: { type: String, required: true },
    department: { type: String, required: true },
    type: { type: String, enum: ["whatsapp", "sms", "email"], default: "whatsapp" },
    sentAt: { type: Date, default: Date.now },
    delivered: { type: Boolean, default: false },
    reason: { type: String, default: "missed-lesson" },
  },
  { timestamps: true }
);

export default mongoose.models.Nudge ||
  mongoose.model<INudge>("Nudge", NudgeSchema);
