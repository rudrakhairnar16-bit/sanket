import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAssistSession extends Document {
  clerkId: mongoose.Types.ObjectId;
  clerkName: string;
  servicePackId: string;
  serviceName: string;
  conversation: {
    id: string;
    type: "citizen_sign" | "citizen_text" | "clerk_reply" | "system" | "interpreter";
    content: string;
    confidence?: number;
    timestamp: Date;
    language?: string;
    isVoice?: boolean;
  }[];
  outcome: "completed" | "escalated" | "abandoned";
  averageConfidence: number;
  interpreterUsed: boolean;
  duration: number;
  xpEarned: number;
  feedbackId?: string;
  organizationId?: string;
  state?: string;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
}

const AssistSessionSchema = new Schema<IAssistSession>(
  {
    clerkId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clerkName: { type: String, required: true },
    servicePackId: { type: String, required: true },
    serviceName: { type: String, required: true },
    conversation: [
      {
        id: { type: String, required: true },
        type: { type: String, enum: ["citizen_sign", "citizen_text", "clerk_reply", "system", "interpreter"], required: true },
        content: { type: String, required: true },
        confidence: { type: Number },
        timestamp: { type: Date, default: Date.now },
        language: { type: String, default: "en" },
        isVoice: { type: Boolean, default: false },
      },
    ],
    outcome: { type: String, enum: ["completed", "escalated", "abandoned"], default: "completed" },
    averageConfidence: { type: Number, default: 0 },
    interpreterUsed: { type: Boolean, default: false },
    duration: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 25 },
    feedbackId: { type: String },
    organizationId: { type: String, default: "" },
    state: { type: String, default: "" },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

AssistSessionSchema.index({ clerkId: 1 });
AssistSessionSchema.index({ organizationId: 1 });
AssistSessionSchema.index({ state: 1 });
AssistSessionSchema.index({ startedAt: -1 });
AssistSessionSchema.index({ outcome: 1 });

const AssistSession: Model<IAssistSession> =
  mongoose.models.AssistSession || mongoose.model<IAssistSession>("AssistSession", AssistSessionSchema);
export default AssistSession;
