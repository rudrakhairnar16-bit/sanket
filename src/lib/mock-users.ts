const clerkSeeds = [
  ["ramesh", "Ramesh Patel", "Water Services", "Gujarat", "Vadodara"],
  ["sita", "Sita Sharma", "Citizen Certificates", "Gujarat", "Vadodara"],
  ["amit", "Amit Shah", "Property Services", "Gujarat", "Ahmedabad"],
  ["neha", "Neha Joshi", "Grievance & Complaints", "Maharashtra", "Mumbai"],
  ["arjun", "Arjun Mehta", "Revenue Services", "Rajasthan", "Jaipur"],
  ["pooja", "Pooja Nair", "Public Health Services", "Kerala", "Kochi"],
  ["rahul", "Rahul Verma", "Education Services", "Delhi", "New Delhi"],
  ["kavya", "Kavya Rao", "Social Welfare", "Karnataka", "Bengaluru"],
  ["imran", "Imran Khan", "General Citizen Services", "Maharashtra", "Pune"],
  ["meena", "Meena Das", "Transport Assistance", "West Bengal", "Kolkata"],
  ["vikas", "Vikas Singh", "Electricity & Utility Assistance", "Uttar Pradesh", "Lucknow"],
  ["anita", "Anita Iyer", "Public Information & Applications", "Tamil Nadu", "Chennai"],
] as const;

export const mockUsers = [
  ...clerkSeeds.map(([username, name, department, state, city], i) => ({
    _id: `demo-clerk-${i+1}`, username, name, department, role: "clerk" as const, designation: i < 4 ? "Senior Clerk" : "Citizen Service Clerk", employeeId: `EMP-${String(i+1).padStart(3,"0")}`, city, state, organizationId: "demo-municipal-vadodara", departmentId: `dept-${department.toLowerCase().replace(/[^a-z]+/g,"-").replace(/^-|-$/g,"")}`, deskId: `D-${String((i%8)+1).padStart(2,"0")}`, language: i % 3 === 0 ? "hi" as const : "en" as const, status: "active" as const, currentStreak: 3 + (i % 10), longestStreak: 7 + (i % 15), totalCompleted: 15 + i * 4, lastCompletedDate: new Date().toISOString().split("T")[0], isChampion: i === 0, islXp: 450 + i * 45, islLevel: 5 + (i % 7), islStreak: 3 + (i % 10), islBadges: ["first-sign", ...(i % 2 ? [] : ["7-day-streak"])], islSignsCompleted: ["help","please","wait","yes","no","document"],
  })),
  { _id: "demo-dept-admin", username: "wateradmin", name: "Water Department Admin", department: "Water Services", role: "dept_admin" as const, designation: "Department Head", employeeId: "ADM-001", city: "Vadodara", state: "Gujarat", organizationId: "demo-municipal-vadodara", departmentId: "dept-water", language: "en" as const, status: "active" as const, currentStreak: 0, longestStreak: 0, totalCompleted: 0, isChampion: false, islXp: 0, islLevel: 1, islStreak: 0, islBadges: [], islSignsCompleted: [] },
  { _id: "demo-org-admin", username: "orgadmin", name: "Municipal Operations Admin", department: "All Departments", role: "org_admin" as const, designation: "Organisation Admin", employeeId: "ORG-001", city: "Vadodara", state: "Gujarat", organizationId: "demo-municipal-vadodara", departmentId: "", language: "en" as const, status: "active" as const, currentStreak: 0, longestStreak: 0, totalCompleted: 0, isChampion: false, islXp: 0, islLevel: 1, islStreak: 0, islBadges: [], islSignsCompleted: [] },
  { _id: "demo-state-admin", username: "stateadmin", name: "Gujarat Accessibility Admin", department: "State Accessibility", role: "state_admin" as const, designation: "State Admin", employeeId: "STATE-001", city: "Gandhinagar", state: "Gujarat", organizationId: "demo-municipal-vadodara", departmentId: "", language: "gu" as const, status: "active" as const, currentStreak: 0, longestStreak: 0, totalCompleted: 0, isChampion: false, islXp: 0, islLevel: 1, islStreak: 0, islBadges: [], islSignsCompleted: [] },
  { _id: "demo-national-admin", username: "nationaladmin", name: "National Accessibility Admin", department: "National Operations", role: "national_admin" as const, designation: "National Admin", employeeId: "NAT-001", city: "New Delhi", state: "Delhi", organizationId: "", departmentId: "", language: "en" as const, status: "active" as const, currentStreak: 0, longestStreak: 0, totalCompleted: 0, isChampion: false, islXp: 0, islLevel: 1, islStreak: 0, islBadges: [], islSignsCompleted: [] },
  { _id: "demo-super-admin", username: "admin", name: "System Administrator", department: "Administration", role: "super_admin" as const, designation: "Super Admin", employeeId: "ADM-ROOT", city: "New Delhi", state: "Delhi", organizationId: "", departmentId: "", language: "en" as const, status: "active" as const, currentStreak: 0, longestStreak: 0, totalCompleted: 0, isChampion: false, islXp: 0, islLevel: 1, islStreak: 0, islBadges: [], islSignsCompleted: [] },
  { _id: "demo-interpreter", username: "interpreter", name: "Anjali Deshmukh", department: "Interpreter Services", role: "interpreter" as const, designation: "ISL Interpreter", employeeId: "INT-001", city: "Ahmedabad", state: "Gujarat", organizationId: "demo-municipal-vadodara", departmentId: "", language: "en" as const, status: "active" as const, currentStreak: 0, longestStreak: 0, totalCompleted: 0, isChampion: false, islXp: 0, islLevel: 1, islStreak: 0, islBadges: [], islSignsCompleted: [] },
];

export function findMockUser(username: string) { return mockUsers.find((u) => u.username === username.toLowerCase()); }
export function getMockLeaderboard() { return mockUsers.filter((u) => u.role === "clerk").sort((a,b)=>b.islXp-a.islXp).map((u,i)=>({rank:i+1,username:u.username,name:u.name,department:u.department,islXp:u.islXp,islLevel:u.islLevel,currentStreak:u.currentStreak,isChampion:u.isChampion})); }
