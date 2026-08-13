"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

interface InterpreterSession {
  sessionId: string;
  role: "deaf" | "clerk";
  language: string;
  status: "connecting" | "connected" | "active" | "ended";
  startTime?: number;
}

export function useInterpreterSocket(userId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [session, setSession] = useState<InterpreterSession | null>(null);
  const [waiting, setWaiting] = useState(0);
  const [activeSessions, setActiveSessions] = useState(0);
  const [incomingSignals, setIncomingSignals] = useState<any[]>([]);

  useEffect(() => {
    const s = io(SOCKET_URL);
    socketRef.current = s;

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    s.on("interpreter:matched", ({ sessionId, role, language }) => {
      setSession({ sessionId, role, language, status: "active", startTime: Date.now() });
      setIncomingSignals([]);
    });

    s.on("interpreter:waiting", ({ position }) => {
      setSession((prev) => prev ? { ...prev, status: "connecting" } : null);
    });

    s.on("interpreter:no-match", () => {
      setSession(null);
    });

    s.on("interpreter:ended", ({ sessionId, reason }) => {
      setSession((prev) =>
        prev && prev.sessionId === sessionId ? { ...prev, status: "ended" } : prev
      );
    });

    s.on("interpreter:signal", ({ type, data, from }) => {
      setIncomingSignals((prev) => [...prev, { type, data, from, time: Date.now() }]);
    });

    s.on("interpreter:status", ({ waiting: w, activeSessions: a }) => {
      setWaiting(w);
      setActiveSessions(a);
    });

    return () => { s.disconnect(); };
  }, [userId]);

  const findInterpreter = useCallback((language = "en") => {
    socketRef.current?.emit("interpreter:find", { userId, language });
    setSession({ sessionId: "", role: "deaf", language, status: "connecting" });
  }, [userId]);

  const markAvailable = useCallback((languages = ["en"]) => {
    socketRef.current?.emit("interpreter:available", { userId, languages });
    setSession(null);
  }, [userId]);

  const sendSignal = useCallback((sessionId: string, type: string, data: any) => {
    socketRef.current?.emit("interpreter:signal", { sessionId, type, data });
  }, []);

  const endSession = useCallback((sessionId: string) => {
    socketRef.current?.emit("interpreter:end", { sessionId });
    setSession(null);
  }, []);

  const rateSession = useCallback((sessionId: string, rating: number) => {
    socketRef.current?.emit("interpreter:rate", { sessionId, rating });
  }, []);

  const clearSignals = useCallback(() => setIncomingSignals([]), []);

  return {
    connected,
    session,
    waiting,
    activeSessions,
    incomingSignals,
    findInterpreter,
    markAvailable,
    sendSignal,
    endSession,
    rateSession,
    clearSignals,
  };
}
