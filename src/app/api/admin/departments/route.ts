import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Department from "@/models/Department";
import { requireTenantRole, buildTenantFilter } from "@/lib/db/tenancy";
import { demoDepartmentStats, demoDepartments } from "@/lib/demo-government-data";

export async function GET() {
  const { tenantUser, error } = await requireTenantRole("dept_admin"); if (error) return error;
  try { await connectDB(); const filter=buildTenantFilter(tenantUser!); const rows=await Department.find(filter).sort({name:1}).lean();
    if(rows.length) return NextResponse.json({success:true,departments:rows.map(d=>({id:d._id.toString(),name:d.name,staffCount:0,activeStaff:0,totalXp:0,avgLevel:0,feedbackCount:0,positiveFeedback:0,avgRating:0,satisfaction:0,state:d.state,organizationId:d.organizationId}))});
  } catch {}
  return NextResponse.json({success:true,departments:demoDepartmentStats(),demo:true});
}

export async function POST(request:Request){ const {tenantUser,error}=await requireTenantRole("dept_admin"); if(error)return error; try{const b=await request.json(); if(!b.name?.trim())return NextResponse.json({success:false,error:"Department name is required"},{status:400}); await connectDB(); const d=await Department.create({name:b.name.trim(),state:b.state||tenantUser!.state,organizationId:b.organizationId||tenantUser!.organizationId,active:true}); return NextResponse.json({success:true,department:d},{status:201});}catch{return NextResponse.json({success:false,error:"Unable to create department. Configure MongoDB for persistent CRUD."},{status:503});}}
export async function PATCH(request:Request){const {tenantUser,error}=await requireTenantRole("dept_admin");if(error)return error;try{const b=await request.json();if(!b.id||!b.name?.trim())return NextResponse.json({success:false,error:"id and name are required"},{status:400});await connectDB();const d=await Department.findByIdAndUpdate(b.id,{$set:{name:b.name.trim()}},{new:true});if(!d)return NextResponse.json({success:false,error:"Department not found"},{status:404});return NextResponse.json({success:true,department:d});}catch{return NextResponse.json({success:false,error:"Unable to update department"},{status:503});}}
export async function DELETE(request:Request){const {tenantUser,error}=await requireTenantRole("dept_admin");if(error)return error;try{const {searchParams}=new URL(request.url);const id=searchParams.get("id");if(!id)return NextResponse.json({success:false,error:"id is required"},{status:400});await connectDB();await Department.findByIdAndDelete(id);return NextResponse.json({success:true});}catch{return NextResponse.json({success:false,error:"Unable to delete department"},{status:503});}}
