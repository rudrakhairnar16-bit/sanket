import { NextResponse } from "next/server";
import Module from "@/models/Module";
import { connectDB } from "@/lib/db";
import { requireTenantRole } from "@/lib/db/tenancy";

export async function GET() {
  const { error } = await requireTenantRole("dept_admin"); if (error) return error;
  try { await connectDB(); const modules = await Module.find({}).sort({ order: 1 }).lean(); return NextResponse.json({ success: true, modules }); }
  catch { return NextResponse.json({ success: false, error: "Unable to load content" }, { status: 503 }); }
}
export async function POST(request: Request) {
  const { error } = await requireTenantRole("dept_admin"); if (error) return error;
  try { await connectDB(); const b = await request.json(); const created = await Module.create(b); return NextResponse.json({ success: true, module: created }, { status: 201 }); }
  catch { return NextResponse.json({ success: false, error: "Unable to create content" }, { status: 503 }); }
}
export async function PATCH(request: Request) {
  const { error } = await requireTenantRole("dept_admin"); if (error) return error;
  try { await connectDB(); const b = await request.json(); if (!b.id) return NextResponse.json({ success:false,error:"id is required" },{status:400}); const {id,...updates}=b; const updated=await Module.findByIdAndUpdate(id,{$set:updates},{new:true,runValidators:true}); if(!updated)return NextResponse.json({success:false,error:"Module not found"},{status:404}); return NextResponse.json({success:true,module:updated}); }
  catch { return NextResponse.json({ success: false, error: "Unable to update content" }, { status: 503 }); }
}
export async function DELETE(request: Request) {
  const { error } = await requireTenantRole("dept_admin"); if (error) return error;
  try { await connectDB(); const id=new URL(request.url).searchParams.get("id"); if(!id)return NextResponse.json({success:false,error:"id is required"},{status:400}); const r=await Module.findByIdAndDelete(id); if(!r)return NextResponse.json({success:false,error:"Module not found"},{status:404}); return NextResponse.json({success:true}); }
  catch { return NextResponse.json({ success: false, error: "Unable to delete content" }, { status: 503 }); }
}
