export type InterpreterStatus = "available" | "busy" | "offline";
export type RequestStatus = "pending" | "accepted" | "active" | "completed" | "cancelled";

export interface Interpreter {
  _id: string;
  userId: string;
  name: string;
  status: InterpreterStatus;
  languages: string[];
  specialties?: string[];
  activeSessionId?: string;
  totalSessions: number;
  averageRating: number;
  createdAt: string;
}

export interface InterpreterRequest {
  _id: string;
  clerkId: string;
  clerkName: string;
  sessionId: string;
  serviceName: string;
  reason: string;
  status: RequestStatus;
  interpreterId?: string;
  interpreterName?: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  resolution?: string;
  rating?: number;
  notes?: string;
}
