"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useSocketSession } from "@/features/sahayak/hooks/useSocketSession";

interface ChatMessage {
  id: string;
  sender: "clerk" | "interpreter" | "system";
  content: string;
  timestamp: string;
  isRemote?: boolean;
}

const mockSession = {
  id: "sess-active-1",
  citizenName: "Sunita Devi",
  serviceType: "Water Tax",
};

const initialChat: ChatMessage[] = [
  { id: "m1", sender: "system", content: "Session started — Water Tax service", timestamp: "0:00" },
  { id: "m2", sender: "clerk", content: "Namaste! How can I help you today?", timestamp: "0:15" },
  { id: "m3", sender: "interpreter", content: "The citizen is asking about paying their water bill.", timestamp: "0:20" },
  { id: "m4", sender: "clerk", content: "Sure, I can help with that. Do you have your account number?", timestamp: "0:30" },
  { id: "m5", sender: "interpreter", content: "I have translated the request. The citizen will provide their account number.", timestamp: "0:35" },
];

export default function InterpreterSessionPage() {
  const [elapsed, setElapsed] = useState(0);
  const [chat, setChat] = useState(initialChat);
  const [inputText, setInputText] = useState("");
  const [transportMode, setTransportMode] = useState<"demo" | "real">(
    typeof window !== "undefined"
      ? (localStorage.getItem("interpreter-transport") as "demo" | "real") || "demo"
      : "demo"
  );
  const chatRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);

  const {
    isConnected,
    userCount,
    sendTextMessage,
    sendReaction,
    endSession,
    onTextMessage,
    onReaction,
    onSessionEnd,
  } = useSocketSession({
    sessionId: mockSession.id,
    role: "interpreter",
    enabled: transportMode === "real",
  });

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    onTextMessage((data: { text: string; sender: string }) => {
      setChat((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-${Math.random()}`,
          sender: data.sender as "clerk" | "interpreter" | "system",
          content: data.text,
          timestamp: formatTime(elapsedRef.current),
          isRemote: true,
        },
      ]);
    });
  }, [onTextMessage, formatTime]);

  useEffect(() => {
    onReaction((emoji: string) => {
      setChat((prev) => [
        ...prev,
        {
          id: `rx-${Date.now()}-${Math.random()}`,
          sender: "system",
          content: `Reacted: ${emoji}`,
          timestamp: formatTime(elapsedRef.current),
        },
      ]);
    });
  }, [onReaction, formatTime]);

  useEffect(() => {
    onSessionEnd(() => {
      setChat((prev) => [
        ...prev,
        {
          id: `end-${Date.now()}`,
          sender: "system",
          content: "Session has been ended by remote user",
          timestamp: formatTime(elapsedRef.current),
        },
      ]);
    });
  }, [onSessionEnd, formatTime]);

  const toggleTransport = () => {
    const next = transportMode === "demo" ? "real" : "demo";
    setTransportMode(next);
    localStorage.setItem("interpreter-transport", next);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "interpreter",
      content: inputText,
      timestamp: formatTime(elapsed),
    };
    setChat((prev) => [...prev, newMsg]);

    if (transportMode === "real") {
      sendTextMessage(inputText);
    }

    setInputText("");
  };

  const handleEndSession = () => {
    if (transportMode === "real") {
      endSession();
    }
    setChat((prev) => [
      ...prev,
      {
        id: `end-local-${Date.now()}`,
        sender: "system",
        content: "Session ended",
        timestamp: formatTime(elapsed),
      },
    ]);
  };

  return (
    <AppShell>
      <div className="page-container">
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Active Session</h1>
              <p className="text-white/50 text-sm">{mockSession.serviceType} — {mockSession.citizenName}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="green">In Progress</Badge>
              {transportMode === "real" && (
                <Badge variant={isConnected ? "green" : "red"}>
                  {isConnected ? "Socket Connected" : "Socket Disconnected"}
                </Badge>
              )}
              <Badge variant="blue">{transportMode === "real" ? "Live" : "Demo"}</Badge>
              {transportMode === "real" && userCount.total > 0 && (
                <span className="text-xs text-white/40">{userCount.total} user{userCount.total !== 1 ? "s" : ""} in room</span>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-mono text-white/70">{formatTime(elapsed)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Button size="sm" variant="secondary" onClick={toggleTransport}>
            Switch to {transportMode === "demo" ? "Live Socket" : "Demo Mode"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card variant="spatial" className="h-full">
              <h3 className="font-bold text-white mb-4">Video Feed</h3>
              <div className="bg-black/60 rounded-xl aspect-video flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent" />
                <svg className="w-16 h-16 text-white/20 mb-3 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="text-white/30 text-sm relative z-10">Video feed would appear here</p>
                <p className="text-white/20 text-xs mt-1 relative z-10">Connecting to citizen video...</p>
              </div>
            </Card>
          </div>

          <Card variant="spatial" className="flex flex-col">
            <h3 className="font-bold text-white mb-3">Chat Panel</h3>
            <div ref={chatRef} className="flex-1 overflow-y-auto max-h-[400px] space-y-2 mb-3 p-2 rounded-xl bg-white/5">
              {chat.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "interpreter" ? "items-end" : msg.sender === "system" ? "items-center" : "items-start"}`}>
                  {msg.sender === "system" ? (
                    <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{msg.content}</span>
                  ) : (
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                      msg.sender === "interpreter"
                        ? "bg-gold-400/15 text-gold-200 border border-gold-400/20"
                        : "bg-white/10 text-white/80 border border-white/10"
                    }`}>
                      <p>{msg.content}</p>
                      <p className="text-[10px] text-white/30 mt-1">{msg.timestamp}{msg.isRemote ? " (remote)" : ""}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type message..."
                className="input-field flex-1"
              />
              <Button size="sm" onClick={sendMessage}>Send</Button>
            </div>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="danger" onClick={handleEndSession}>End Session</Button>
        </div>
      </div>
    </AppShell>
  );
}
