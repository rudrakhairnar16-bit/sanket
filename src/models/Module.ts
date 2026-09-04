import mongoose, { Schema, Document, Model } from "mongoose";

export interface IModule extends Document {
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  category: string;
  videoUrl: string;
  question: string;
  questionHi?: string;
  options: string[];
  optionsHi?: string[];
  correctAnswer: string;
  explanation?: string;
  active: boolean;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  signsIncluded: string[];
  serviceRelevance: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true, trim: true },
    titleHi: { type: String, default: "" },
    description: { type: String, default: "" },
    descriptionHi: { type: String, default: "" },
    category: { type: String, default: "general" },
    videoUrl: { type: String, default: "" },
    question: { type: String, required: true },
    questionHi: { type: String, default: "" },
    options: [{ type: String }],
    optionsHi: [{ type: String }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, default: "" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    estimatedMinutes: { type: Number, default: 3 },
    signsIncluded: [{ type: String }],
    serviceRelevance: [{ type: String }],
  },
  { timestamps: true }
);

ModuleSchema.index({ order: 1 });
ModuleSchema.index({ active: 1 });
ModuleSchema.index({ category: 1 });

const Module: Model<IModule> = mongoose.models.Module || mongoose.model<IModule>("Module", ModuleSchema);
export default Module;
