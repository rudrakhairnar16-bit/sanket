export interface Lesson {
  _id: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  category: string;
  signs: LessonSign[];
  quiz: QuizQuestion[];
  order: number;
  active: boolean;
  estimatedMinutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  serviceRelevance?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonSign {
  signId: string;
  name: string;
  nameHi?: string;
  description: string;
  handHint: string;
  image?: string;
  videoUrl?: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionHi?: string;
  options: string[];
  optionsHi?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Completion {
  _id: string;
  userId: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  timeSpent: number;
  completedAt: string;
}

export interface Flashcard {
  id: string;
  signId: string;
  name: string;
  nameHi?: string;
  description: string;
  handHint: string;
  category: string;
  image?: string;
  symbol?: string;
}

export interface PracticeAttempt {
  _id: string;
  userId: string;
  signId: string;
  predicted: string;
  confidence: number;
  correct: boolean;
  attemptedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  nameHi?: string;
  description: string;
  icon: string;
  requirement: string;
  xpRequired?: number;
  levelRequired?: number;
  streakRequired?: number;
  category: "learning" | "practice" | "service" | "streak" | "special";
}

export interface SpacedRepetitionItem {
  signId: string;
  nextReviewAt: string;
  mistakeCount: number;
  confidence: number;
  lastSeen: string;
  reviewCount: number;
}

export interface Certificate {
  _id: string;
  userId: string;
  userName: string;
  milestone: string;
  issuedAt: string;
  verificationId: string;
  organization?: string;
}
