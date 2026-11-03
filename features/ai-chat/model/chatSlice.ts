import { ChatMessageViewModel } from "../lib/mappers";

export interface AIChatSliceState {
  readonly conversationId: string;
  readonly schoolId: string;
  readonly gradeLevel: "G10" | "G11-BTEC" | "G12-BTEC";
  readonly subjectCode: "IT-SYSTEMS" | "CYBER-SECURITY" | "STEM-PHYSICS";
  readonly consentVerified: boolean;
  readonly messages: readonly ChatMessageViewModel[];
  readonly isSubmitting: boolean;
  readonly errorBanner: string | null;
}

export const initialAIChatSliceState: AIChatSliceState = Object.freeze({
  conversationId: "conv-jo-amman-101",
  schoolId: "school-amman-01",
  gradeLevel: "G11-BTEC",
  subjectCode: "IT-SYSTEMS",
  consentVerified: true,
  messages: [
    {
      id: "msg-welcome-01",
      sender: "assistant",
      contentAr:
        "مرحباً بك في المعلم الذكي الموثق لمنصة التعليم الأردنية. جميع الإجابات مستندة حصرياً إلى المعايير المعتمدة (وزارة التربية والتعليم / Pearson BTEC) مع تنقيح تلقائي للبيانات الشخصية وإشراف المعلم على أي تقييم.",
      timestampIso: "2026-11-03T08:00:00.000Z",
      traceId: "trc-init-001",
      confidenceScore: 0.98,
      groundednessScore: 1.0,
      teacherReviewRequired: false,
      piiRedactedCount: 0,
      citations: [],
    },
  ],
  isSubmitting: false,
  errorBanner: null,
});
