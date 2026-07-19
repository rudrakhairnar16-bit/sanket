import mongoose, { Schema, Document } from "mongoose";

export interface ICompletion extends Document {
  userId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  date: string;
  correct: boolean;
  createdAt: Date;
}

const CompletionSchema = new Schema<ICompletion>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    date: { type: String, required: true },
    correct: { type: Boolean, required: true },
  },
  { timestamps: true }
);

CompletionSchema.index({ userId: 1, date: -1 });
CompletionSchema.index({ moduleId: 1, userId: 1 });

export default mongoose.models.Completion ||
  mongoose.model<ICompletion>("Completion", CompletionSchema);
