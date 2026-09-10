import mongoose, { Schema, Document, Model } from "mongoose";
export interface IDepartment extends Document { name:string; state:string; organizationId:string; active:boolean; createdAt:Date; updatedAt:Date; }
const DepartmentSchema = new Schema<IDepartment>({ name:{type:String,required:true,trim:true}, state:{type:String,default:""}, organizationId:{type:String,default:""}, active:{type:Boolean,default:true} }, {timestamps:true});
DepartmentSchema.index({name:1,organizationId:1},{unique:true});
const Department: Model<IDepartment> = mongoose.models.Department || mongoose.model<IDepartment>("Department",DepartmentSchema);
export default Department;
