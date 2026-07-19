import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  clerkId: mongoose.Types.ObjectId;
  clerkName: string;
  department: string;
  attempted: boolean;
  comment?: string;
  date: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    clerkId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clerkName: { type: String, required: true },
    department: { type: String, required: true },
    attempted: { type: Boolean, required: true },
    comment: { type: String, default: "" },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

FeedbackSchema.index({ clerkId: 1, date: -1 });
FeedbackSchema.index({ department: 1, date: -1 });

export default mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);
