'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketSessionOptions {
  sessionId: string;
  role: 'interpreter' | 'clerk';
  enabled?: boolean;
}

interface SignDataPayload {
  landmarks: number[];
  label?: string;
  confidence?: number;
  timestamp?: string;
}

interface TextMessagePayload {
  text: string;
  sender?: string;
}

interface ReactionPayload {
  emoji: string;
}

interface UserCount {
  interpreters: number;
  clerks: number;
  total: number;
}

export function useSocketSession({ sessionId, role, enabled = true }: SocketSessionOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState<UserCount>({ interpreters: 0, clerks: 0, total: 0 });
  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef({
    onSignData: null as ((data: any) => void) | null,
    onTextMessage: null as ((data: any) => void) | null,
    onReaction: null as ((data: any) => void) | null,
    onTyping: null as ((data: any) => void) | null,
    onSessionEnd: null as ((data: any) => void) | null,
  });

  useEffect(() => {
    if (!enabled || !sessionId) return;

    const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const socket = io(url, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-session', { sessionId, userRole: role });
    });

    socket.on('session-joined', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('reconnect', () => {
      socket.emit('join-session', { sessionId, userRole: role });
    });

    socket.on('user-count', (count: UserCount) => {
      setUserCount(count);
    });

    socket.on('sign-data', (data: any) => {
      callbacksRef.current.onSignData?.(data);
    });

    socket.on('text-message', (data: any) => {
      callbacksRef.current.onTextMessage?.(data);
    });

    socket.on('reaction', (data: any) => {
      callbacksRef.current.onReaction?.(data);
    });

    socket.on('typing', (data: any) => {
      callbacksRef.current.onTyping?.(data);
    });

    socket.on('session-ended', (data: any) => {
      callbacksRef.current.onSessionEnd?.(data);
    });

    return () => {
      socket.emit('leave-session', { sessionId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, role, enabled]);

  const joinSession = useCallback((newSessionId?: string, newRole?: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-session', {
        sessionId: newSessionId || sessionId,
        userRole: newRole || role,
      });
    }
  }, [sessionId, role]);

  const leaveSession = useCallback((targetSessionId?: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave-session', {
        sessionId: targetSessionId || sessionId,
      });
      setIsConnected(false);
    }
  }, [sessionId]);

  const sendSignData = useCallback((payload: SignDataPayload) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('sign-data', {
        sessionId,
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString(),
      });
    }
  }, [sessionId]);

  const sendTextMessage = useCallback((text: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('text-message', {
        sessionId,
        text,
        sender: role,
      });
    }
  }, [sessionId, role]);

  const sendReaction = useCallback((emoji: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('reaction', {
        sessionId,
        emoji,
      });
    }
  }, [sessionId]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', {
        sessionId,
        isTyping,
      });
    }
  }, [sessionId]);

  const endSession = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('session-end', { sessionId });
    }
  }, [sessionId]);

  const onSignData = useCallback((callback: (data: any) => void) => {
    callbacksRef.current.onSignData = callback;
  }, []);

  const onTextMessage = useCallback((callback: (data: any) => void) => {
    callbacksRef.current.onTextMessage = callback;
  }, []);

  const onReaction = useCallback((callback: (data: any) => void) => {
    callbacksRef.current.onReaction = callback;
  }, []);

  const onTyping = useCallback((callback: (data: any) => void) => {
    callbacksRef.current.onTyping = callback;
  }, []);

  const onSessionEnd = useCallback((callback: (data: any) => void) => {
    callbacksRef.current.onSessionEnd = callback;
  }, []);

  return {
    isConnected,
    userCount,
    joinSession,
    leaveSession,
    sendSignData,
    sendTextMessage,
    sendReaction,
    sendTyping,
    endSession,
    onSignData,
    onTextMessage,
    onReaction,
    onTyping,
    onSessionEnd,
  };
}
