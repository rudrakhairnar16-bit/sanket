"use client";

import { useEffect } from "react";
import LiveInterpreter from "@/components/LiveInterpreter";
import { useAuth } from "@/lib/auth-context";
import { autoCompleteTasks } from "@/lib/tasks";
import { loadGame } from "@/lib/game-storage";

export default function InterpreterPage() {
  const { user } = useAuth();

  useEffect(() => {
    autoCompleteTasks({
      hasProfile: !!(user?.name && user?.department),
      interpreterUsed: true,
      questXp: loadGame().xp,
    });
  }, [user]);

  return <LiveInterpreter />;
}
