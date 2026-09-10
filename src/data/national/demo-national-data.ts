export interface NationalState {
  name: string;
  abbreviation: string;
  region: "North" | "South" | "East" | "West" | "Central";
  score: number;
  status: "active" | "pilot" | "planned";
  clerks: number;
  sessions: number;
  cities: string[];
}

export const NATIONAL_STATES: NationalState[] = [
  { name: "Jammu & Kashmir", abbreviation: "JK", region: "North", score: 0, status: "planned", clerks: 0, sessions: 0, cities: [] },
  { name: "Punjab", abbreviation: "PB", region: "North", score: 0, status: "planned", clerks: 0, sessions: 0, cities: [] },
  { name: "Delhi", abbreviation: "DL", region: "North", score: 79, status: "active", clerks: 65, sessions: 180, cities: ["New Delhi"] },
  { name: "Rajasthan", abbreviation: "RJ", region: "North", score: 68, status: "pilot", clerks: 28, sessions: 62, cities: ["Jaipur", "Jodhpur"] },
  { name: "Uttar Pradesh", abbreviation: "UP", region: "North", score: 0, status: "planned", clerks: 0, sessions: 0, cities: [] },
  { name: "Madhya Pradesh", abbreviation: "MP", region: "Central", score: 61, status: "pilot", clerks: 18, sessions: 38, cities: ["Bhopal", "Indore"] },
  { name: "Chhattisgarh", abbreviation: "CG", region: "Central", score: 0, status: "planned", clerks: 0, sessions: 0, cities: [] },
  { name: "Gujarat", abbreviation: "GJ", region: "West", score: 87, status: "active", clerks: 145, sessions: 320, cities: ["Vadodara", "Ahmedabad", "Surat"] },
  { name: "Maharashtra", abbreviation: "MH", region: "West", score: 82, status: "active", clerks: 98, sessions: 210, cities: ["Mumbai", "Pune", "Nagpur"] },
  { name: "Goa", abbreviation: "GA", region: "West", score: 0, status: "planned", clerks: 0, sessions: 0, cities: [] },
  { name: "Karnataka", abbreviation: "KA", region: "South", score: 75, status: "pilot", clerks: 42, sessions: 95, cities: ["Bangalore", "Mysore"] },
  { name: "Tamil Nadu", abbreviation: "TN", region: "South", score: 73, status: "pilot", clerks: 38, sessions: 88, cities: ["Chennai", "Coimbatore"] },
  { name: "Kerala", abbreviation: "KL", region: "South", score: 0, status: "planned", clerks: 0, sessions: 0, cities: [] },
  { name: "Andhra Pradesh", abbreviation: "AP", region: "South", score: 0, status: "planned", clerks: 0, sessions: 0, cities: [] },
  { name: "West Bengal", abbreviation: "WB", region: "East", score: 64, status: "pilot", clerks: 22, sessions: 45, cities: ["Kolkata"] },
  { name: "Odisha", abbreviation: "OD", region: "East", score: 0, status: "planned", clerks: 0, sessions: 0, cities: [] },
  { name: "Bihar", abbreviation: "BR", region: "East", score: 0, status: "planned", clerks: 0, sessions: 0, cities: [] },
  { name: "Assam", abbreviation: "AS", region: "East", score: 0, status: "planned", clerks: 0, sessions: 0, cities: [] },
];

export function getNationalAverages() {
  const active = NATIONAL_STATES.filter((s) => s.status !== "planned");
  const totalClerks = active.reduce((sum, s) => sum + s.clerks, 0);
  const totalSessions = active.reduce((sum, s) => sum + s.sessions, 0);
  const avgScore = active.length > 0 ? Math.round(active.reduce((sum, s) => sum + s.score, 0) / active.length) : 0;
  return { totalClerks, totalSessions, avgScore, stateCount: active.length };
}

export function getStatesByRegion(region: string): NationalState[] {
  return NATIONAL_STATES.filter((s) => s.region === region);
}
