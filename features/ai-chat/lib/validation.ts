import { z } from "zod";

export const aiChatRequestSchema = z.object({
  conversationId: z.string().min(3),
  schoolId: z.string().min(3),
  gradeLevel: z.enum(["G10", "G11-BTEC", "G12-BTEC"]),
  subjectCode: z.enum(["IT-SYSTEMS", "CYBER-SECURITY", "STEM-PHYSICS"]),
  message: z
    .string()
    .min(3, "يجب أن يحتوي السؤال على 3 أحرف على الأقل.")
    .max(1500, "الحد الأقصى لطول الرسالة هو 1500 حرف."),
  consentVerified: z.boolean(),
});

export type ValidatedAIChatRequest = z.infer<typeof aiChatRequestSchema>;
