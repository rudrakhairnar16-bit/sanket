import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  userId: string;
  userName: string;
  action: string;
  target: string;
  targetId?: string;
  result: "success" | "failure";
  details?: string;
  ipAddress?: string;
  organizationId?: string;
  state?: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    action: { type: String, required: true },
    target: { type: String, required: true },
    targetId: { type: String },
    result: { type: String, enum: ["success", "failure"], default: "success" },
    details: { type: String },
    ipAddress: { type: String },
    organizationId: { type: String, default: "" },
    state: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ organizationId: 1 });
AuditLogSchema.index({ state: 1 });
AuditLogSchema.index({ timestamp: -1 });

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
export default AuditLog;
