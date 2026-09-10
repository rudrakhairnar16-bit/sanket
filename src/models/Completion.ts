import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompletion extends Document {
  userId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  answer: string;
  correct: boolean;
  score: number;
  xpEarned: number;
  timeSpent: number;
  organizationId?: string;
  state?: string;
  completedAt: Date;
  createdAt: Date;
}

const CompletionSchema = new Schema<ICompletion>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    answer: { type: String, default: "" },
    correct: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    organizationId: { type: String, default: "" },
    state: { type: String, default: "" },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CompletionSchema.index({ userId: 1 });
CompletionSchema.index({ moduleId: 1 });
CompletionSchema.index({ organizationId: 1 });
CompletionSchema.index({ state: 1 });
CompletionSchema.index({ completedAt: -1 });

const Completion: Model<ICompletion> = mongoose.models.Completion || mongoose.model<ICompletion>("Completion", CompletionSchema);
export default Completion;
