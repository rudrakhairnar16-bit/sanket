import mongoose, { Schema, Document } from "mongoose";

export interface IModule extends Document {
  title: string;
  videoUrl: string;
  question: string;
  options: string[];
  correctAnswer: string;
  active: boolean;
  order: number;
  createdAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Module ||
  mongoose.model<IModule>("Module", ModuleSchema);
