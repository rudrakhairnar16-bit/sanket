export type ConfidenceState = "UNKNOWN" | "PROCESSING" | "LOW" | "MEDIUM" | "HIGH" | "CONFIRMED";

export interface RecognitionResult {
  sign: string | null;
  confidence: number;
  state: ConfidenceState;
  alternatives?: { sign: string; confidence: number }[];
  timestamp: number;
}

export interface ConversationEvent {
  id: string;
  type: "citizen_sign" | "citizen_text" | "clerk_reply" | "system" | "interpreter";
  content: string;
  confidence?: number;
  timestamp: number;
  language?: string;
  isVoice?: boolean;
}

export interface ServicePack {
  _id: string;
  serviceName: string;
  department: string;
  departmentId?: string;
  language: string;
  commonQuestions: string[];
  commonReplies: string[];
  supportedSigns: string[];
  workflows?: string[];
  escalationRules?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssistSession {
  _id: string;
  clerkId: string;
  servicePackId: string;
  serviceName: string;
  conversation: ConversationEvent[];
  outcome: "completed" | "escalated" | "abandoned";
  averageConfidence: number;
  interpreterUsed: boolean;
  duration: number;
  xpEarned: number;
  feedbackId?: string;
  startedAt: string;
  endedAt?: string;
}

export interface ClerkReply {
  id: string;
  text: string;
  textHi?: string;
  textMr?: string;
  textGu?: string;
  category: "general" | "documents" | "service" | "escalation";
  icon?: string;
  islSymbols?: string[];
}
