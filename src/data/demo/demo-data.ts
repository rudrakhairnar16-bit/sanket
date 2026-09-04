export const demoOrganizations = [
  {
    id: "org-1",
    name: "Municipal Citizen Service Center — DEMO",
    nameHi: "नागरिक सेवा केंद्र — डेमो",
    type: "municipal",
    state: "Gujarat",
    city: "Vadodara",
  },
];

export const demoDepartments = [
  { id: "dept-1", organizationId: "org-1", name: "Water Services", nameHi: "जल सेवाएं" },
  { id: "dept-2", organizationId: "org-1", name: "Citizen Certificates", nameHi: "नागरिक प्रमाणपत्र" },
  { id: "dept-3", organizationId: "org-1", name: "Property Services", nameHi: "संपत्ति सेवाएं" },
  { id: "dept-4", organizationId: "org-1", name: "General Services", nameHi: "सामान्य सेवाएं" },
];

export const demoDesks = [
  { id: "desk-1", officeId: "office-1", name: "Desk 01", clerkId: "demo-clerk-1", department: "Water Services" },
  { id: "desk-2", officeId: "office-1", name: "Desk 02", clerkId: "demo-clerk-2", department: "Citizen Certificates" },
  { id: "desk-3", officeId: "office-1", name: "Desk 03", clerkId: "demo-clerk-3", department: "Property Services" },
  { id: "desk-4", officeId: "office-1", name: "Desk 04", clerkId: "demo-clerk-4", department: "Water Services" },
];

export const demoSessions = [
  {
    _id: "session-1",
    clerkId: "demo-clerk-1",
    clerkName: "Ramesh Patel",
    serviceName: "Water Tax",
    outcome: "completed",
    averageConfidence: 0.87,
    interpreterUsed: false,
    duration: 45,
    xpEarned: 25,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45000).toISOString(),
  },
  {
    _id: "session-2",
    clerkId: "demo-clerk-1",
    clerkName: "Ramesh Patel",
    serviceName: "Birth Certificate",
    outcome: "escalated",
    averageConfidence: 0.32,
    interpreterUsed: true,
    duration: 120,
    xpEarned: 25,
    startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 120000).toISOString(),
  },
  {
    _id: "session-3",
    clerkId: "demo-clerk-2",
    clerkName: "Sita Sharma",
    serviceName: "Birth Certificate",
    outcome: "completed",
    averageConfidence: 0.91,
    interpreterUsed: false,
    duration: 35,
    xpEarned: 25,
    startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 35000).toISOString(),
  },
  {
    _id: "session-4",
    clerkId: "demo-clerk-3",
    clerkName: "Amit Shah",
    serviceName: "Property Tax",
    outcome: "completed",
    averageConfidence: 0.78,
    interpreterUsed: false,
    duration: 60,
    xpEarned: 25,
    startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 3 * 60 * 60 * 1000 + 60000).toISOString(),
  },
  {
    _id: "session-5",
    clerkId: "demo-clerk-4",
    clerkName: "Neha Joshi",
    serviceName: "Water Tax",
    outcome: "completed",
    averageConfidence: 0.82,
    interpreterUsed: false,
    duration: 50,
    xpEarned: 25,
    startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 50000).toISOString(),
  },
];

export const demoFeedback = [
  { _id: "fb-1", clerkName: "Ramesh Patel", department: "Water Services", attempted: true, rating: 5, comment: "Very helpful staff.", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { _id: "fb-2", clerkName: "Sita Sharma", department: "Citizen Certificates", attempted: true, rating: 4, comment: "Good communication.", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { _id: "fb-3", clerkName: "Ramesh Patel", department: "Water Services", attempted: true, rating: 5, comment: "Excellent service.", createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { _id: "fb-4", clerkName: "Amit Shah", department: "Property Services", attempted: false, rating: 2, comment: "No sign language used.", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { _id: "fb-5", clerkName: "Neha Joshi", department: "Water Services", attempted: true, rating: 4, comment: "Tried to communicate.", createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
];

export const demoInterpreterRequests = [
  {
    _id: "ir-1",
    clerkName: "Ramesh Patel",
    serviceName: "Birth Certificate",
    reason: "Low AI confidence",
    status: "completed",
    interpreterName: "Demo Interpreter 01",
    duration: 180,
    rating: 4,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export function getSugamyaScoreData() {
  const totalStaff = 4;
  const activeLearners = 4;
  const totalSessions = demoSessions.length;
  const completedSessions = demoSessions.filter((s) => s.outcome === "completed").length;
  const escalatedSessions = demoSessions.filter((s) => s.interpreterUsed).length;
  const totalFeedback = demoFeedback.length;
  const positiveFeedback = demoFeedback.filter((f) => f.attempted).length;
  const avgRating = demoFeedback.reduce((acc, f) => acc + (f.rating || 0), 0) / totalFeedback;

  const compliance = Math.round((activeLearners / totalStaff) * 100);
  const satisfaction = totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 0;
  const participation = Math.round((completedSessions / Math.max(totalSessions, 1)) * 100);
  const safetyNet = totalSessions > 0 ? Math.round((escalatedSessions / totalSessions) * 100) : 0;

  const overall = Math.round(compliance * 0.45 + satisfaction * 0.30 + participation * 0.15 + safetyNet * 0.10);

  return {
    overall,
    compliance,
    satisfaction,
    participation,
    safetyNet,
    breakdown: {
      compliance: { lessonCompletionRate: compliance, dailyActiveLearners: activeLearners, totalStaff, weight: 0.45 },
      satisfaction: { positiveFeedback, totalFeedback, averageRating: avgRating, weight: 0.30 },
      participation: { activeLearners, totalEnrolled: totalStaff, completions: completedSessions, weight: 0.15 },
      safetyNet: { escalationsHandled: escalatedSessions, totalSessions, interpreterAvailable: true, weight: 0.10 },
    },
  };
}
