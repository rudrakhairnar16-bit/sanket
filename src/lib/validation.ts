import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3).max(50).trim().toLowerCase(),
  password: z.string().min(6).max(100),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(50).trim().toLowerCase(),
  password: z.string().min(6).max(100),
  name: z.string().min(2).max(100).trim(),
  department: z.string().min(2).max(100).trim(),
  role: z.enum(["clerk", "interpreter", "dept_admin"]).optional().default("clerk"),
});

export const feedbackSchema = z.object({
  clerkId: z.string().min(1).optional(),
  clerkName: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
  attempted: z.boolean().optional(),
  rating: z.union([z.number().min(1).max(5), z.enum(["yes", "partially", "no"])]).optional(),
  comment: z.string().max(500).optional(),
  sessionId: z.string().optional(),
});

export const assistSessionSchema = z.object({
  servicePackId: z.string().min(1),
  serviceName: z.string().min(1),
  conversation: z.array(z.object({
    id: z.string(),
    type: z.enum(["citizen_sign", "citizen_text", "clerk_reply", "system", "interpreter"]),
    content: z.string(),
    confidence: z.number().optional(),
    language: z.string().optional(),
    isVoice: z.boolean().optional(),
  })).optional(),
  outcome: z.enum(["completed", "escalated", "abandoned"]),
  averageConfidence: z.number().min(0).max(1),
  interpreterUsed: z.boolean(),
  duration: z.number().min(0),
});

export const moduleSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  titleHi: z.string().max(200).trim().optional(),
  description: z.string().max(1000).optional(),
  category: z.string().min(1).max(100),
  videoUrl: z.string().url().optional().or(z.literal("")),
  question: z.string().min(1).max(500),
  options: z.array(z.string()).min(2).max(6),
  correctAnswer: z.string().min(1),
  explanation: z.string().max(500).optional(),
  order: z.number().min(0).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  const errorMessage = result.error.errors.map((e) => e.message).join(", ");
  return { success: false, error: errorMessage };
}
