import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInterpreterRequest extends Document {
  clerkId: mongoose.Types.ObjectId;
  clerkName: string;
  sessionId: string;
  serviceName: string;
  reason: string;
  status: "pending" | "accepted" | "active" | "completed" | "cancelled";
  interpreterId?: string;
  interpreterName?: string;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  resolution?: string;
  rating?: number;
  notes?: string;
  createdAt: Date;
}

const InterpreterRequestSchema = new Schema<IInterpreterRequest>(
  {
    clerkId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clerkName: { type: String, required: true },
    sessionId: { type: String, required: true },
    serviceName: { type: String, required: true },
    reason: { type: String, default: "Low AI confidence" },
    status: { type: String, enum: ["pending", "accepted", "active", "completed", "cancelled"], default: "pending" },
    interpreterId: { type: String },
    interpreterName: { type: String },
    startedAt: { type: Date },
    endedAt: { type: Date },
    duration: { type: Number },
    resolution: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    notes: { type: String },
  },
  { timestamps: true }
);

InterpreterRequestSchema.index({ status: 1 });
InterpreterRequestSchema.index({ clerkId: 1 });
InterpreterRequestSchema.index({ createdAt: -1 });

const InterpreterRequest: Model<IInterpreterRequest> =
  mongoose.models.InterpreterRequest || mongoose.model<IInterpreterRequest>("InterpreterRequest", InterpreterRequestSchema);
export default InterpreterRequest;
