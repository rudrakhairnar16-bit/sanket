export const demoDepartments = [
  { id: "dept-water", name: "Water Services", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
  { id: "dept-property", name: "Property Services", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
  { id: "dept-certificates", name: "Citizen Certificates", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
  { id: "dept-grievance", name: "Grievance & Complaints", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
  { id: "dept-revenue", name: "Revenue Services", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
  { id: "dept-health", name: "Public Health Services", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
  { id: "dept-education", name: "Education Services", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
  { id: "dept-social", name: "Social Welfare", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
  { id: "dept-general", name: "General Citizen Services", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
  { id: "dept-transport", name: "Transport Assistance", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
  { id: "dept-electricity", name: "Electricity & Utility Assistance", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
  { id: "dept-public-info", name: "Public Information & Applications", state: "Gujarat", organizationId: "demo-municipal-vadodara" },
] as const;

const serviceSeeds: Record<string, string[]> = {
  "Water Services": ["Water Bill Assistance", "New Water Connection", "Water Complaint"],
  "Property Services": ["Property Tax Assistance", "Property Record Request", "Mutation Application"],
  "Citizen Certificates": ["Birth Certificate", "Death Certificate", "Residence Certificate"],
  "Grievance & Complaints": ["Register Complaint", "Track Complaint", "Escalate Complaint"],
  "Revenue Services": ["Revenue Certificate", "Land Record Assistance", "Tax Payment Help"],
  "Public Health Services": ["Health Scheme Help", "Clinic Information", "Public Health Complaint"],
  "Education Services": ["Scholarship Assistance", "School Certificate Help", "Education Application"],
  "Social Welfare": ["Pension Assistance", "Social Scheme Help", "Disability Support Application"],
  "General Citizen Services": ["Application Assistance", "Document Verification", "Counter Information"],
  "Transport Assistance": ["Transport Information", "Permit Application Help", "Public Transport Complaint"],
  "Electricity & Utility Assistance": ["Electricity Bill Help", "Connection Assistance", "Utility Complaint"],
  "Public Information & Applications": ["Information Request", "Application Status", "Document Submission Help"],
};

export const demoServicePacks = demoDepartments.flatMap((d) => serviceSeeds[d.name].map((serviceName, i) => ({
  _id: `demo-pack-${d.id}-${i}`,
  serviceName, department: d.name, departmentId: d.id, organizationId: d.organizationId, state: d.state, language: "en",
  commonQuestions: ["How can I apply?", "What documents are required?"],
  commonReplies: ["Please wait a moment.", "Please show your document.", "I will call an interpreter."],
  supportedSigns: ["help", "please", "wait", "document", "yes", "no"],
  workflows: ["Verify request", "Collect documents", "Complete service / escalate"],
  escalationRules: ["Low AI confidence", "Citizen requests interpreter"], active: true,
})));

export function demoDepartmentStats() {
  return demoDepartments.map((d, i) => ({ id: d.id, name: d.name, staffCount: 2 + (i % 3), activeStaff: 2 + (i % 2), totalXp: 800 + i * 135, avgLevel: 6 + (i % 5), feedbackCount: 4 + (i % 4), positiveFeedback: 3 + (i % 3), avgRating: 4.1 + ((i % 5) * 0.15), satisfaction: 78 + (i % 6) * 3 }));
}

export function demoDesks() {
  return demoDepartments.slice(0, 8).map((d, i) => ({ _id: `D-${String(i + 1).padStart(2, "0")}`, clerks: [{ _id: `demo-clerk-${i+1}`, name: `Demo Clerk ${i+1}`, username: `clerk${i+1}`, status: "active" }], clerkCount: 1, activeClerks: 1 }));
}
