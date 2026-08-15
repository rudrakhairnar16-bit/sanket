import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export interface MockUser {
  id: string;
  username: string;
  password: string;
  name: string;
  department: string;
  role: "learner" | "admin" | "superadmin";
  isChampion: boolean;
  designation?: string;
  employeeId?: string;
  phone?: string;
  email?: string;
  officeLocation?: string;
  city?: string;
  bio?: string;
  profilePhoto?: string;
}

const DEMO_USERS: MockUser[] = [
  {
    id: "admin-1",
    username: "admin",
    password: bcrypt.hashSync("admin123", 10),
    name: "Admin",
    department: "Administration",
    role: "admin",
    isChampion: false,
  },
  {
    id: "ramesh-1",
    username: "ramesh",
    password: bcrypt.hashSync("admin123", 10),
    name: "Ramesh Kumar",
    department: "Revenue",
    role: "learner",
    isChampion: true,
  },
];

export async function mockFindByUsername(
  username: string
): Promise<MockUser | null> {
  return DEMO_USERS.find((u) => u.username === username) || null;
}

export async function mockCreateUser(data: {
  username: string;
  password: string;
  name: string;
  department: string;
  role?: "learner" | "admin" | "superadmin";
}): Promise<MockUser> {
  const user: MockUser = {
    id: randomUUID(),
    username: data.username,
    password: bcrypt.hashSync(data.password, 10),
    name: data.name,
    department: data.department,
    role: data.role || "learner",
    isChampion: false,
  };
  DEMO_USERS.push(user);
  return user;
}

export function mockToPublic(user: MockUser) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    department: user.department,
    role: user.role,
    isChampion: user.isChampion,
    designation: user.designation || "",
    employeeId: user.employeeId || "",
    phone: user.phone || "",
    email: user.email || "",
    officeLocation: user.officeLocation || "",
    city: user.city || "",
    bio: user.bio || "",
    profilePhoto: user.profilePhoto || "",
  };
}

export function updateMockProfile(
  id: string,
  data: Record<string, string>
): void {
  const user = DEMO_USERS.find((u) => u.id === id);
  if (!user) return;
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) (user as any)[key] = value;
  }
}

export function toggleMockChampion(
  id: string
): { isChampion: boolean; name: string } | null {
  const user = DEMO_USERS.find((u) => u.id === id);
  if (!user) return null;
  user.isChampion = !user.isChampion;
  return { isChampion: user.isChampion, name: user.name };
}

export function toggleMockChampionByUsername(
  username: string
): { isChampion: boolean; name: string } | null {
  const user = DEMO_USERS.find((u) => u.username === username);
  if (!user) return null;
  user.isChampion = !user.isChampion;
  return { isChampion: user.isChampion, name: user.name };
}
