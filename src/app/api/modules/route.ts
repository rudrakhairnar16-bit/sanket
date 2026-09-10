import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Module from "@/models/Module";
import { requireRole } from "@/lib/api-helpers";

export async function GET() {
  try {
    try {
      await connectDB();
      const modules = await Module.find({ active: true }).sort({ order: 1 }).lean();
      return NextResponse.json({ success: true, modules });
    } catch {
      const { mockModules } = await import("@/lib/mock-modules");
      return NextResponse.json({ success: true, modules: mockModules });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { auth, error } = await requireRole('super_admin', 'dept_admin', 'org_admin');
    if (error) return error;

    const body = await request.json();
    try {
      await connectDB();
      const newModule = await Module.create(body);
      return NextResponse.json({ success: true, module: newModule });
    } catch {
      return NextResponse.json({ success: false, error: "Failed to create module" }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try { const { error } = await requireRole("super_admin","dept_admin","org_admin"); if(error)return error; const b=await request.json(); if(!b.id)return NextResponse.json({success:false,error:"id is required"},{status:400}); await connectDB(); const updated=await Module.findByIdAndUpdate(b.id,{$set:b},{new:true,runValidators:true}); if(!updated)return NextResponse.json({success:false,error:"Module not found"},{status:404}); return NextResponse.json({success:true,module:updated}); } catch { return NextResponse.json({success:false,error:"Unable to update module"},{status:503}); }
}
export async function DELETE(request: Request) {
  try { const { error } = await requireRole("super_admin","dept_admin","org_admin"); if(error)return error; const {searchParams}=new URL(request.url); const id=searchParams.get("id"); if(!id)return NextResponse.json({success:false,error:"id is required"},{status:400}); await connectDB(); await Module.findByIdAndDelete(id); return NextResponse.json({success:true}); } catch { return NextResponse.json({success:false,error:"Unable to delete module"},{status:503}); }
}
