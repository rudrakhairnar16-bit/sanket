"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface QueueRequest {
  id: string;
  citizenName: string;
  servicePack: string;
  urgency: "high" | "medium" | "low";
  waitingTime: string;
  reason: string;
}

const initialQueue: QueueRequest[] = [
  { id: "q-1", citizenName: "Sunita Devi", servicePack: "Water Tax Payment", urgency: "high", waitingTime: "6m 45s", reason: "Citizen requires Hindi translation for water bill inquiry" },
  { id: "q-2", citizenName: "Rajesh Kumar", servicePack: "Birth Certificate", urgency: "high", waitingTime: "5m 10s", reason: "Gujarati interpreter needed for certificate application" },
  { id: "q-3", citizenName: "Meena Bai", servicePack: "Property Tax", urgency: "medium", waitingTime: "3m 05s", reason: "Hindi translation for property tax dispute" },
  { id: "q-4", citizenName: "Harish Patel", servicePack: "Water Connection", urgency: "medium", waitingTime: "1m 35s", reason: "Marathi speaker needs assistance with connection request" },
  { id: "q-5", citizenName: "Kavita Sharma", servicePack: "Document Verification", urgency: "low", waitingTime: "0m 42s", reason: "Hindi speaker needs help verifying submitted documents" },
];

export default function InterpreterQueuePage() {
  const [queue, setQueue] = useState(initialQueue);

  const handleAccept = (id: string) => {
    setQueue((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDecline = (id: string) => {
    setQueue((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-1">Session Queue</h1>
          <p className="text-white/50">Pending interpreter requests sorted by urgency</p>
        </div>

        <div className="space-y-4">
          {queue.map((request, i) => {
            const urgencyColor = request.urgency === "high" ? "red" : request.urgency === "medium" ? "gold" : "blue";
            return (
              <Card key={request.id} variant="spatial">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      request.urgency === "high" ? "bg-red-500/20 text-red-400" : request.urgency === "medium" ? "bg-gold-400/20 text-gold-400" : "bg-blue-400/20 text-blue-400"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white">{request.citizenName}</p>
                        <Badge variant={urgencyColor}>{request.urgency}</Badge>
                      </div>
                      <p className="text-xs text-white/50 mt-0.5">{request.servicePack}</p>
                      <p className="text-xs text-white/40 mt-1">{request.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-white/40 mb-0.5">Waiting</p>
                      <p className={`text-sm font-semibold ${
                        request.urgency === "high" ? "text-red-400" : request.urgency === "medium" ? "text-gold-400" : "text-white/70"
                      }`}>
                        {request.waitingTime}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAccept(request.id)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDecline(request.id)}>
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {queue.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-4xl mb-3">🎉</p>
              <p className="text-white/60 text-sm">Queue is clear. No pending requests.</p>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
