import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeedback extends Document {
  clerkId: mongoose.Types.ObjectId;
  clerkName: string;
  department: string;
  organizationId?: string;
  state?: string;
  attempted: boolean;
  rating?: number;
  comment?: string;
  sessionId?: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    clerkId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clerkName: { type: String, required: true },
    department: { type: String, required: true },
    organizationId: { type: String, default: "" },
    state: { type: String, default: "" },
    attempted: { type: Boolean, required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: "" },
    sessionId: { type: String, default: "" },
  },
  { timestamps: true }
);

FeedbackSchema.index({ clerkId: 1 });
FeedbackSchema.index({ department: 1 });
FeedbackSchema.index({ organizationId: 1 });
FeedbackSchema.index({ state: 1 });
FeedbackSchema.index({ organizationId: 1, department: 1 });
FeedbackSchema.index({ createdAt: -1 });

const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);
export default Feedback;
