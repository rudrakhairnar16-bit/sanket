'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

type ConfidenceUIState = 'UNKNOWN' | 'PROCESSING' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CONFIRMED';

interface SahayakUIState {
  selectedPack: string | null;
  showInterpreterOption: boolean;
  replyFilter: string;
  replySignGuidance: any[];
  confidenceState: ConfidenceUIState;
  lastConfidence: number;
  setSelectedPack: (pack: string | null) => void;
  setShowInterpreterOption: (show: boolean) => void;
  setReplyFilter: (filter: string) => void;
  setReplySignGuidance: (guidance: any[]) => void;
  setConfidenceState: (state: ConfidenceUIState) => void;
  setLastConfidence: (confidence: number) => void;
}

const SahayakContext = createContext<SahayakUIState | null>(null);

export function SahayakProvider({ children }: { children: React.ReactNode }) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [showInterpreterOption, setShowInterpreterOption] = useState(false);
  const [replyFilter, setReplyFilter] = useState('all');
  const [replySignGuidance, setReplySignGuidance] = useState<any[]>([]);
  const [confidenceState, setConfidenceState] = useState<ConfidenceUIState>('UNKNOWN');
  const [lastConfidence, setLastConfidence] = useState(0);

  return (
    <SahayakContext.Provider value={{
      selectedPack, setSelectedPack,
      showInterpreterOption, setShowInterpreterOption,
      replyFilter, setReplyFilter,
      replySignGuidance, setReplySignGuidance,
      confidenceState, setConfidenceState,
      lastConfidence, setLastConfidence,
    }}>
      {children}
    </SahayakContext.Provider>
  );
}

export function useSahayakUI() {
  const ctx = useContext(SahayakContext);
  if (!ctx) throw new Error('useSahayakUI must be used within SahayakProvider');
  return ctx;
}
