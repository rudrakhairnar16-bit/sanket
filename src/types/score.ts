export interface SugamyaScore {
  overall: number;
  compliance: number;
  satisfaction: number;
  participation: number;
  safetyNet: number;
  breakdown: ScoreBreakdown;
  trend: "improving" | "stable" | "declining";
  lastUpdated: string;
}

export interface ScoreBreakdown {
  compliance: {
    lessonCompletionRate: number;
    dailyActiveLearners: number;
    totalStaff: number;
    weight: number;
  };
  satisfaction: {
    positiveFeedback: number;
    totalFeedback: number;
    averageRating: number;
    weight: number;
  };
  participation: {
    activeLearners: number;
    totalEnrolled: number;
    completions: number;
    weight: number;
  };
  safetyNet: {
    escalationsHandled: number;
    totalSessions: number;
    interpreterAvailable: boolean;
    weight: number;
  };
}

export interface AccessibilityMetric {
  _id: string;
  organizationId: string;
  departmentId: string;
  date: string;
  totalSessions: number;
  successfulResolutions: number;
  interpreterEscalations: number;
  averageConfidence: number;
  feedbackCount: number;
  positiveFeedback: number;
  learningCompletions: number;
  activeLearners: number;
  sugamyaScore: number;
}

export interface AnalyticsData {
  period: "daily" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
  metrics: AccessibilityMetric[];
  summary: {
    totalSessions: number;
    averageConfidence: number;
    escalationRate: number;
    satisfactionRate: number;
    learningParticipation: number;
    sugamyaScoreTrend: number[];
  };
}

export interface AuditLog {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  targetId?: string;
  result: "success" | "failure";
  details?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface Feedback {
  _id: string;
  clerkId: string;
  clerkName: string;
  department: string;
  organizationId?: string;
  attempted: boolean;
  rating?: number;
  comment?: string;
  sessionId?: string;
  createdAt: string;
}

export interface ReportExport {
  format: "csv" | "pdf";
  data: Record<string, unknown>[];
  filename: string;
  generatedAt: string;
}
