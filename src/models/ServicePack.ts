import mongoose, { Schema, Document, Model } from "mongoose";

export interface IServicePack extends Document {
  serviceName: string;
  department: string;
  departmentId?: string;
  organizationId?: string;
  state?: string;
  language: string;
  commonQuestions: string[];
  commonReplies: string[];
  supportedSigns: string[];
  workflows: string[];
  escalationRules: string[];
  active: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ServicePackSchema = new Schema<IServicePack>(
  {
    serviceName: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    departmentId: { type: String, default: "" },
    organizationId: { type: String, default: "" },
    state: { type: String, default: "" },
    language: { type: String, default: "en" },
    commonQuestions: [{ type: String }],
    commonReplies: [{ type: String }],
    supportedSigns: [{ type: String }],
    workflows: [{ type: String }],
    escalationRules: [{ type: String }],
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ServicePackSchema.index({ department: 1 });
ServicePackSchema.index({ organizationId: 1 });
ServicePackSchema.index({ state: 1 });
ServicePackSchema.index({ active: 1 });

const ServicePack: Model<IServicePack> =
  mongoose.models.ServicePack || mongoose.model<IServicePack>("ServicePack", ServicePackSchema);
export default ServicePack;
