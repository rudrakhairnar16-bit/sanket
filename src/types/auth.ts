export type UserRole = "clerk" | "interpreter" | "dept_admin" | "org_admin" | "state_admin" | "national_admin" | "super_admin";

export interface User {
  _id: string;
  username: string;
  name: string;
  department: string;
  role: UserRole;
  designation?: string;
  employeeId?: string;
  phone?: string;
  email?: string;
  officeLocation?: string;
  city?: string;
  state?: string;
  organizationId?: string;
  departmentId?: string;
  deskId?: string;
  language: "en" | "hi" | "mr" | "gu";
  status: "active" | "inactive" | "suspended";
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  lastCompletedDate?: string;
  isChampion: boolean;
  islXp: number;
  islLevel: number;
  islStreak: number;
  islBadges: string[];
  islSignsCompleted: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  department: string;
  role?: UserRole;
}
