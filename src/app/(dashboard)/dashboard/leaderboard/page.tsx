"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LeaderboardUser {
  _id: string;
  name: string;
  department: string;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  islXp: number;
  islLevel: number;
  islStreak: number;
  islBadges: string[];
  isChampion?: boolean;
}

interface DeptStat {
  _id: string;
  totalUsers: number;
  totalCompleted: number;
  avgStreak: number;
}

type Tab = "daily" | "quest";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [departments, setDepartments] = useState<DeptStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("daily");

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setDepartments(data.departments || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sortedByModule = [...users].sort((a, b) => b.currentStreak - a.currentStreak);
  const sortedByQuest = [...users].sort((a, b) => b.islXp - a.islXp);

  const topDept = departments[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Leaderboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Department standings and top learners
        </p>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab("daily")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "daily" ? "bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          📚 Daily Lessons
        </button>
        <button
          onClick={() => setTab("quest")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "quest" ? "bg-white dark:bg-gray-700 text-amber-700 dark:text-amber-300 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          🎮 ISL Quest
        </button>
      </div>

      {topDept && (
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-3xl p-6 sm:p-8 text-center">
          <span className="text-4xl block mb-2">🏆</span>
          <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300">
            {topDept._id} Leads This Week
          </h2>
          <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">
            Average streak: {topDept.avgStreak.toFixed(1)} days
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {departments.slice(0, 3).map((dept, i) => (
              <span
                key={dept._id}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  i === 0
                    ? "bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200"
                    : "bg-white/70 dark:bg-gray-700/70 text-gray-600 dark:text-gray-300"
                }`}
              >
                {i === 0 ? "🥇 " : i === 1 ? "🥈 " : "🥉 "}
                {dept._id}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {tab === "daily" ? "Top Learners (Streak)" : "Top ISL Quest Players"}
              </h3>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {(tab === "daily" ? sortedByModule : sortedByQuest).length > 0 ? (
                (tab === "daily" ? sortedByModule : sortedByQuest).map((user, index) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold ${
                        index === 0
                          ? "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300"
                          : index === 1
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
                          : index === 2
                          ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300"
                          : "bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                        {user.isChampion && <span className="ml-1.5 text-sm" title="ISL Champion">👑</span>}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.department}</p>
                    </div>
                    <div className="text-right">
                      {tab === "daily" ? (
                        <>
                          <p className="font-bold text-gray-900 dark:text-white">{user.currentStreak}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">day streak</p>
                        </>
                      ) : (
                        <>
                          <p className="font-bold text-amber-600 dark:text-amber-400">{user.islXp || 0}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Lv.{user.islLevel || 1} • {user.islStreak || 0}d
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                  {tab === "quest" ? (
                    <div>
                      <p className="mb-2">No ISL Quest data yet</p>
                      <Link
                        href="/learn"
                        className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-medium"
                      >
                        🎮 Play ISL Quest to appear here
                      </Link>
                    </div>
                  ) : (
                    "No learners yet"
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Department Rankings
              </h3>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {departments.map((dept, i) => (
                <div
                  key={dept._id}
                  className="flex items-center gap-3 p-4"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                      i === 0
                        ? "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {dept._id}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {dept.totalUsers} learners
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {dept.avgStreak.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">avg streak</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
