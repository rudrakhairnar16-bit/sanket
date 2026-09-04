"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

const mockRecentRequests = [
  { id: "rr-1", citizen: "Sunita Devi", service: "Water Tax", urgency: "high", time: "2m ago" },
  { id: "rr-2", citizen: "Rajesh Kumar", service: "Birth Certificate", urgency: "high", time: "5m ago" },
  { id: "rr-3", citizen: "Meena Bai", service: "Property Tax", urgency: "medium", time: "8m ago" },
  { id: "rr-4", citizen: "Harish Patel", service: "Water Connection", urgency: "low", time: "12m ago" },
  { id: "rr-5", citizen: "Kavita Sharma", service: "Document Verification", urgency: "medium", time: "18m ago" },
];

export default function InterpreterPage() {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-1">Interpreter Dashboard</h1>
          <p className="text-white/50">Manage your availability and review incoming requests</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card variant="spatial" className="lg:col-span-1">
            <h3 className="font-bold text-white mb-4">Your Status</h3>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-3 h-3 rounded-full ${isAvailable ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              <span className={`text-lg font-semibold ${isAvailable ? "text-green-400" : "text-red-400"}`}>
                {isAvailable ? "Available" : "Not Available"}
              </span>
            </div>
            <Button
              className="w-full"
              variant={isAvailable ? "danger" : "primary"}
              onClick={() => setIsAvailable(!isAvailable)}
            >
              {isAvailable ? "Go Offline" : "Go Online"}
            </Button>
          </Card>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard label="Active Sessions" value="0" icon="🤝" trend="neutral" trendValue="No active sessions" />
            <StatCard label="Queue Length" value="3" icon="📋" trend="up" trendValue="3 waiting" />
            <StatCard label="Today's Sessions" value="12" icon="📊" trend="up" trendValue="+2 from yesterday" />
            <StatCard label="Avg Response Time" value="2m 30s" icon="⏱️" trend="neutral" trendValue="Stable" />
          </div>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Recent Requests</h3>
            <Badge variant="teal">{mockRecentRequests.length} today</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-medium uppercase tracking-wider pb-3">Citizen</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase tracking-wider pb-3">Service</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase tracking-wider pb-3">Urgency</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase tracking-wider pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockRecentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-sm text-white">{req.citizen}</td>
                    <td className="py-3 text-sm text-white/60">{req.service}</td>
                    <td className="py-3">
                      <Badge variant={req.urgency === "high" ? "red" : req.urgency === "medium" ? "gold" : "blue"}>
                        {req.urgency}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-white/40">{req.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
