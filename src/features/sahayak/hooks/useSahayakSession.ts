'use client';
import { useState, useCallback } from 'react';
import type { SahayakSession, CommunicationEvent, SessionFeedback, ConfidenceState } from '../types';

let eventCounter = 0;
function createEventId(): string {
  return `evt-${Date.now()}-${++eventCounter}`;
}

function createSessionId(): string {
  return `ses-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useSahayakSession(clerkId: string, servicePackId: string) {
  const [session, setSession] = useState<SahayakSession>({
    id: createSessionId(),
    clerkId,
    servicePackId,
    status: 'created',
    startedAt: new Date().toISOString(),
    language: 'en',
    recognitionCount: 0,
    highConfidenceCount: 0,
    confirmedCount: 0,
    interpreterRequested: false,
    events: [],
  });

  const addEvent = useCallback((event: Omit<CommunicationEvent, 'id' | 'sessionId' | 'timestamp'>) => {
    const fullEvent: CommunicationEvent = {
      ...event,
      id: createEventId(),
      sessionId: session.id,
      timestamp: new Date().toISOString(),
    };
    setSession(prev => ({ ...prev, events: [...prev.events, fullEvent] }));
    return fullEvent;
  }, [session.id]);

  const startSession = useCallback(() => {
    setSession(prev => ({ ...prev, status: 'active', startedAt: new Date().toISOString() }));
    addEvent({ sender: 'system', receiver: 'clerk', direction: 'citizen_to_clerk', channel: 'text', text: 'Session started' });
  }, [addEvent]);

  const endSession = useCallback(() => {
    setSession(prev => ({ ...prev, status: 'completed', endedAt: new Date().toISOString() }));
    addEvent({ sender: 'system', receiver: 'clerk', direction: 'citizen_to_clerk', channel: 'text', text: 'Session completed' });
  }, [addEvent]);

  const requestInterpreter = useCallback(() => {
    setSession(prev => ({ ...prev, status: 'interpreter_requested', interpreterRequested: true }));
    addEvent({ sender: 'system', receiver: 'clerk', direction: 'citizen_to_clerk', channel: 'text', text: 'Interpreter requested' });
  }, [addEvent]);

  const interpreterConnected = useCallback(() => {
    setSession(prev => ({ ...prev, status: 'interpreter_connected' }));
    addEvent({ sender: 'interpreter', receiver: 'clerk', direction: 'interpreter_to_clerk', channel: 'interpreter', text: 'Interpreter connected' });
  }, [addEvent]);

  const addCitizenSign = useCallback((signId: string, label: string, confidence: number, confidenceState: ConfidenceState) => {
    setSession(prev => ({
      ...prev,
      recognitionCount: prev.recognitionCount + 1,
      highConfidenceCount: confidenceState === 'high' ? prev.highConfidenceCount + 1 : prev.highConfidenceCount,
    }));
    return addEvent({
      sender: 'citizen',
      receiver: 'clerk',
      direction: 'citizen_to_clerk',
      channel: 'isl',
      text: label,
      signId,
      confidence,
      confidenceState,
    });
  }, [addEvent]);

  const confirmSign = useCallback(() => {
    setSession(prev => ({ ...prev, confirmedCount: prev.confirmedCount + 1 }));
  }, []);

  const addClerkReply = useCallback((text: string) => {
    return addEvent({
      sender: 'clerk',
      receiver: 'citizen',
      direction: 'clerk_to_citizen',
      channel: 'text',
      text,
    });
  }, [addEvent]);

  const addInterpreterMessage = useCallback((text: string) => {
    return addEvent({
      sender: 'interpreter',
      receiver: 'citizen',
      direction: 'interpreter_to_citizen',
      channel: 'interpreter',
      text,
    });
  }, [addEvent]);

  const submitFeedback = useCallback((feedback: SessionFeedback) => {
    setSession(prev => ({ ...prev, feedback }));
  }, []);

  return {
    session,
    startSession,
    endSession,
    requestInterpreter,
    interpreterConnected,
    addCitizenSign,
    confirmSign,
    addClerkReply,
    addInterpreterMessage,
    submitFeedback,
    addEvent,
  };
}
