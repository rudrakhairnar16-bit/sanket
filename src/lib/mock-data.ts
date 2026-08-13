export interface MockLearner {
  _id: string;
  name: string;
  username: string;
  department: string;
  role: "learner";
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  islXp: number;
  islLevel: number;
  islStreak: number;
  islBadges: string[];
  isChampion: boolean;
  isNewUser: boolean;
}

export const MOCK_LEARNERS: MockLearner[] = [
  {
    _id: "ml-1",
    name: "Priya Sharma",
    username: "priya",
    department: "Revenue",
    role: "learner",
    currentStreak: 42,
    longestStreak: 50,
    totalCompleted: 142,
    islXp: 3200,
    islLevel: 12,
    islStreak: 42,
    islBadges: ["first-sign", "level-20", "streak-30", "webcam-pro"],
    isChampion: true,
    isNewUser: false,
  },
  {
    _id: "ml-2",
    name: "Amit Patel",
    username: "amit",
    department: "Revenue",
    role: "learner",
    currentStreak: 38,
    longestStreak: 41,
    totalCompleted: 130,
    islXp: 2950,
    islLevel: 11,
    islStreak: 38,
    islBadges: ["first-sign", "level-5", "level-10", "streak-3", "streak-7"],
    isChampion: false,
    isNewUser: false,
  },
  {
    _id: "ml-3",
    name: "Sneha Reddy",
    username: "sneha",
    department: "Health",
    role: "learner",
    currentStreak: 31,
    longestStreak: 35,
    totalCompleted: 118,
    islXp: 2600,
    islLevel: 10,
    islStreak: 31,
    islBadges: ["first-sign", "level-5", "level-10", "streak-3", "streak-7"],
    isChampion: false,
    isNewUser: false,
  },
  {
    _id: "ml-4",
    name: "Rahul Verma",
    username: "rahul",
    department: "Health",
    role: "learner",
    currentStreak: 27,
    longestStreak: 30,
    totalCompleted: 104,
    islXp: 2200,
    islLevel: 9,
    islStreak: 27,
    islBadges: ["first-sign", "level-5", "streak-3", "streak-7"],
    isChampion: false,
    isNewUser: false,
  },
  {
    _id: "ml-5",
    name: "Kavya Nair",
    username: "kavya",
    department: "Education",
    role: "learner",
    currentStreak: 21,
    longestStreak: 25,
    totalCompleted: 88,
    islXp: 1850,
    islLevel: 8,
    islStreak: 21,
    islBadges: ["first-sign", "level-5", "streak-3"],
    isChampion: false,
    isNewUser: false,
  },
  {
    _id: "ml-6",
    name: "Vikram Singh",
    username: "vikram",
    department: "Education",
    role: "learner",
    currentStreak: 16,
    longestStreak: 20,
    totalCompleted: 70,
    islXp: 1500,
    islLevel: 7,
    islStreak: 16,
    islBadges: ["first-sign", "level-5", "streak-3"],
    isChampion: false,
    isNewUser: false,
  },
  {
    _id: "ml-7",
    name: "Meera Joshi",
    username: "meera",
    department: "Transport",
    role: "learner",
    currentStreak: 12,
    longestStreak: 15,
    totalCompleted: 54,
    islXp: 1150,
    islLevel: 6,
    islStreak: 12,
    islBadges: ["first-sign", "level-5", "streak-3"],
    isChampion: false,
    isNewUser: false,
  },
  {
    _id: "ml-8",
    name: "Arjun Mehta",
    username: "arjun",
    department: "Transport",
    role: "learner",
    currentStreak: 8,
    longestStreak: 10,
    totalCompleted: 38,
    islXp: 820,
    islLevel: 5,
    islStreak: 8,
    islBadges: ["first-sign", "level-5", "streak-3"],
    isChampion: false,
    isNewUser: false,
  },
  {
    _id: "ml-9",
    name: "Ananya Das",
    username: "ananya",
    department: "Revenue",
    role: "learner",
    currentStreak: 5,
    longestStreak: 6,
    totalCompleted: 22,
    islXp: 540,
    islLevel: 4,
    islStreak: 5,
    islBadges: [],
    isChampion: false,
    isNewUser: false,
  },
  {
    _id: "ml-10",
    name: "Rohan Kulkarni",
    username: "rohan",
    department: "Health",
    role: "learner",
    currentStreak: 3,
    longestStreak: 4,
    totalCompleted: 12,
    islXp: 300,
    islLevel: 3,
    islStreak: 3,
    islBadges: [],
    isChampion: false,
    isNewUser: false,
  },
  {
    _id: "ml-11",
    name: "Ishita Banerjee",
    username: "ishita",
    department: "Education",
    role: "learner",
    currentStreak: 1,
    longestStreak: 2,
    totalCompleted: 3,
    islXp: 90,
    islLevel: 2,
    islStreak: 1,
    islBadges: [],
    isChampion: false,
    isNewUser: true,
  },
];

export function getMockLeaderboard() {
  const users = MOCK_LEARNERS.filter((u) => u.role === "learner").sort(
    (a, b) => b.currentStreak - a.currentStreak
  );
  const deptMap = new Map<string, { totalUsers: number; totalCompleted: number; streakSum: number }>();
  for (const u of users) {
    const d = deptMap.get(u.department) || { totalUsers: 0, totalCompleted: 0, streakSum: 0 };
    d.totalUsers += 1;
    d.totalCompleted += u.totalCompleted;
    d.streakSum += u.currentStreak;
    deptMap.set(u.department, d);
  }
  const departments = Array.from(deptMap.entries())
    .map(([id, v]) => ({
      _id: id,
      totalUsers: v.totalUsers,
      totalCompleted: v.totalCompleted,
      avgStreak: v.totalUsers ? v.streakSum / v.totalUsers : 0,
    }))
    .sort((a, b) => b.avgStreak - a.avgStreak);

  return { users, departments };
}
