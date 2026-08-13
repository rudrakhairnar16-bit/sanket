"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DeptCompliance {
  _id: string;
  totalUsers: number;
  totalCompletions: number;
}

export function ComplianceChart({ data }: { data: DeptCompliance[] }) {
  const chartData = data.map((d) => ({
    name: d._id,
    Completions: d.totalCompletions,
    Users: d.totalUsers,
  }));

  return (
    <div className="surface-card p-5">
      <h3 className="font-semibold text-surface-900 dark:text-white text-sm mb-4">
        Department Compliance
      </h3>
      {chartData.length > 0 ? (
        <div className="overflow-x-auto -mx-5 px-5">
          <div className="min-w-[400px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                <Tooltip />
                <Bar
                  dataKey="Completions"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p className="text-surface-500 text-center py-12 text-sm">No data</p>
      )}
    </div>
  );
}
