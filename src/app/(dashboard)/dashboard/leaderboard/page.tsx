"use client";

import { useEffect, useState } from "react";

interface LeaderboardUser {
  _id: string;
  name: string;
  department: string;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
}

interface DeptStat {
  _id: string;
  totalUsers: number;
  totalCompleted: number;
  avgStreak: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [departments, setDepartments] = useState<DeptStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setDepartments(data.departments || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  const topDept = departments[0];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Leaderboard
        </h1>
        <p className="text-gray-500 mt-1">
          Department standings and top learners
        </p>
      </div>

      {topDept && (
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 text-center">
          <span className="text-4xl block mb-2">🏆</span>
          <h2 className="text-xl font-bold text-amber-800">
            {topDept._id} Leads This Week
          </h2>
          <p className="text-amber-600 text-sm mt-1">
            Average streak: {topDept.avgStreak.toFixed(1)} days
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {departments.slice(0, 3).map((dept, i) => (
              <span
                key={dept._id}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  i === 0
                    ? "bg-amber-200 text-amber-800"
                    : "bg-white/70 text-gray-600"
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
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Top Learners</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold ${
                        index === 0
                          ? "bg-amber-100 text-amber-600"
                          : index === 1
                          ? "bg-gray-100 text-gray-500"
                          : index === 2
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {user.currentStreak}
                      </p>
                      <p className="text-xs text-gray-400">day streak</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  No learners yet
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                Department Rankings
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {departments.map((dept, i) => (
                <div
                  key={dept._id}
                  className="flex items-center gap-3 p-4"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                      i === 0
                        ? "bg-amber-100 text-amber-600"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {dept._id}
                    </p>
                    <p className="text-xs text-gray-400">
                      {dept.totalUsers} learners
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">
                      {dept.avgStreak.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-400">avg streak</p>
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
