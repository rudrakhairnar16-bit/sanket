import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Module from "@/models/Module";
import ServicePack from "@/models/ServicePack";
import Department from "@/models/Department";
import AssistSession from "@/models/AssistSession";
import Feedback from "@/models/Feedback";
import InterpreterRequest from "@/models/InterpreterRequest";
import AuditLog from "@/models/AuditLog";
import { mockUsers } from "@/lib/mock-users";
import { mockModules } from "@/lib/mock-modules";
import { demoDepartments, demoServicePacks } from "@/lib/demo-government-data";

async function main() {
  await connectDB();
  const password = await bcrypt.hash("demo123", 12);
  const users:any[] = [];
  for (const u of mockUsers) {
    const { _id, ...safe } = u as any;
    const doc = await User.findOneAndUpdate({ username: u.username }, { $set: { ...safe, password } }, { upsert:true, new:true, setDefaultsOnInsert:true });
    users.push(doc);
  }
  for (const m of mockModules) {
    const { _id, ...safe } = m as any;
    await Module.findOneAndUpdate({ title:m.title }, { $set:safe }, { upsert:true, new:true, setDefaultsOnInsert:true });
  }
  for (const d of demoDepartments) await Department.findOneAndUpdate({name:d.name,organizationId:d.organizationId},{$set:{name:d.name,state:d.state,organizationId:d.organizationId,active:true}},{upsert:true,new:true,setDefaultsOnInsert:true});
  for (const p of demoServicePacks) { const { _id, ...safe } = p as any; await ServicePack.findOneAndUpdate({serviceName:p.serviceName,department:p.department},{$set:safe},{upsert:true,new:true,setDefaultsOnInsert:true}); }

  if (await AssistSession.countDocuments() === 0) {
    const clerks = users.filter(u=>u.role==="clerk");
    const packs = await ServicePack.find().limit(12).lean();
    for (let i=0;i<Math.min(12,clerks.length);i++) {
      const c=clerks[i], p=packs[i%packs.length];
      await AssistSession.create({clerkId:c._id,clerkName:c.name,servicePackId:p._id.toString(),serviceName:p.serviceName,conversation:[{id:`seed-${i}`,type:"citizen_sign",content:"help",confidence:0.91,timestamp:new Date(),language:"en"}],outcome:i%4===0?"escalated":"completed",averageConfidence:0.84,interpreterUsed:i%4===0,duration:90+i*12,xpEarned:25,organizationId:c.organizationId,state:c.state});
    }
  }
  if (await Feedback.countDocuments() === 0) {
    const clerks=users.filter(u=>u.role==="clerk");
    for(let i=0;i<clerks.length;i++){const c=clerks[i];await Feedback.create({clerkId:c._id,clerkName:c.name,department:c.department,organizationId:c.organizationId,state:c.state,attempted:i%5!==0,rating:4+(i%2),comment:"Seeded prototype feedback for demonstration.",sessionId:`seed-session-${i}`});}
  }
  if (await InterpreterRequest.countDocuments() === 0) {
    const clerk=users.find(u=>u.role==="clerk"), interpreter=users.find(u=>u.role==="interpreter");
    if(clerk) await InterpreterRequest.create({clerkId:clerk._id,clerkName:clerk.name,sessionId:"seed-interpreter-session",serviceName:"Water Bill Assistance",reason:"Low AI confidence",status:"completed",interpreterId:interpreter?interpreter._id.toString():"demo-interpreter",interpreterName:interpreter?.name||"Anjali Deshmukh",duration:180,resolution:"Assisted service interaction"});
  }
  if (await AuditLog.countDocuments() === 0) {
    const admin=users.find(u=>u.role==="super_admin")||users[0];
    if(admin) await AuditLog.create([{userId:admin._id.toString(),userName:admin.name,action:"seed_completed",target:"demo_dataset",result:"success",details:`Seeded ${demoDepartments.length} departments, ${demoServicePacks.length} service packs and ${mockModules.length} learning modules.`}]);
  }
  console.log(`Sanket demo seed complete: ${mockUsers.length} users, ${demoDepartments.length} departments, ${mockModules.length} learning modules, ${demoServicePacks.length} service packs, demo sessions/feedback/interpreter data.`);
  console.log("Demo password for all seeded accounts: demo123");
  process.exit(0);
}
main().catch((e)=>{console.error(e);process.exit(1);});
