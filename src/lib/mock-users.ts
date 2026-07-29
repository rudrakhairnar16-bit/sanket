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
  };
}

export function updateMockProfile(
  id: string,
  data: { name?: string; department?: string }
): void {
  const user = DEMO_USERS.find((u) => u.id === id);
  if (!user) return;
  if (data.name) user.name = data.name;
  if (data.department) user.department = data.department;
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
