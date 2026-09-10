import { NextResponse } from "next/server";
import { demoServicePacks } from "@/lib/demo-government-data";
import { connectDB } from "@/lib/db";
import ServicePack from "@/models/ServicePack";
import { requireTenantRole, buildTenantFilter } from "@/lib/db/tenancy";

export async function GET() {
  try {
    const { tenantUser, error } = await requireTenantRole("dept_admin");
    if (error) return error;

    try {
      await connectDB();
      const filter = buildTenantFilter(tenantUser!);

      const packs = await ServicePack.find(filter)
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      const activePacks = packs.filter((p) => p.active).length;
      const totalSigns = packs.reduce((a, p) => a + p.supportedSigns.length, 0);
      const totalReplies = packs.reduce((a, p) => a + p.commonReplies.length, 0);

      return NextResponse.json({
        success: true,
        packs,
        stats: {
          total: packs.length,
          active: activePacks,
          totalSigns,
          totalReplies,
        },
      });
    } catch {
      return NextResponse.json({ success: true, packs: demoServicePacks, demo: true, stats: { total: demoServicePacks.length, active: demoServicePacks.filter(p=>p.active).length, totalSigns: demoServicePacks.reduce((a,p)=>a+p.supportedSigns.length,0), totalReplies: demoServicePacks.reduce((a,p)=>a+p.commonReplies.length,0) } });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  const { tenantUser, error } = await requireTenantRole("dept_admin");
  if (error) return error;
  try {
    const b = await request.json();
    if (!b.serviceName?.trim() || !b.department?.trim()) return NextResponse.json({success:false,error:"serviceName and department are required"},{status:400});
    await connectDB();
    const pack = await ServicePack.create({
      serviceName:b.serviceName.trim(), department:b.department.trim(), departmentId:b.departmentId||tenantUser!.departmentId||"",
      organizationId:b.organizationId||tenantUser!.organizationId||"", state:b.state||tenantUser!.state||"", language:b.language||"en",
      commonQuestions:Array.isArray(b.commonQuestions)?b.commonQuestions:[], commonReplies:Array.isArray(b.commonReplies)?b.commonReplies:[],
      supportedSigns:Array.isArray(b.supportedSigns)?b.supportedSigns:[], workflows:Array.isArray(b.workflows)?b.workflows:[],
      escalationRules:Array.isArray(b.escalationRules)?b.escalationRules:["Low AI confidence"], active:b.active!==false, createdBy:tenantUser!._id
    });
    return NextResponse.json({success:true,pack},{status:201});
  } catch { return NextResponse.json({success:false,error:"Unable to create service pack. Configure MongoDB for persistence."},{status:503}); }
}

export async function PATCH(request: Request) {
  const { tenantUser, error } = await requireTenantRole("dept_admin");
  if (error) return error;
  try {
    const b = await request.json(); if(!b.id) return NextResponse.json({success:false,error:"id is required"},{status:400});
    await connectDB(); const filter:any={_id:b.id}; Object.assign(filter, buildTenantFilter(tenantUser!));
    const allowed:any={}; ["serviceName","department","departmentId","state","language","commonQuestions","commonReplies","supportedSigns","workflows","escalationRules","active"].forEach(k=>{if(b[k]!==undefined)allowed[k]=b[k]});
    const pack=await ServicePack.findOneAndUpdate(filter,{$set:allowed},{new:true,runValidators:true});
    if(!pack)return NextResponse.json({success:false,error:"Service pack not found in your scope"},{status:404}); return NextResponse.json({success:true,pack});
  } catch { return NextResponse.json({success:false,error:"Unable to update service pack"},{status:503}); }
}

export async function DELETE(request: Request) {
  const { tenantUser, error } = await requireTenantRole("dept_admin");
  if (error) return error;
  try { const id=new URL(request.url).searchParams.get("id"); if(!id)return NextResponse.json({success:false,error:"id is required"},{status:400}); await connectDB(); const filter:any={_id:id}; Object.assign(filter,buildTenantFilter(tenantUser!)); const r=await ServicePack.deleteOne(filter); if(!r.deletedCount)return NextResponse.json({success:false,error:"Service pack not found in your scope"},{status:404}); return NextResponse.json({success:true}); }
  catch { return NextResponse.json({success:false,error:"Unable to delete service pack"},{status:503}); }
}
