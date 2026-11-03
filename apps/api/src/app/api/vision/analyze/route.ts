import { z } from "zod";
import { createPlatformExecutionContext } from "../../../../../../../packages/shared/src/application/execution-context";
import { AuthorizedLlmAdapter } from "../../../../../../../packages/infrastructure/src/ai/llm-adapter";
import { GroundedRagOrchestrator } from "../../../../../../../packages/infrastructure/src/ai/rag-orchestrator";
import { AuditSink } from "../../../../../../../packages/infrastructure/src/security/audit-sink";
import { generateUniqueId } from "../../../../../../../packages/shared/src/lib/id";

const visionAnalyzeSchema = z.object({
  schoolId: z.string().min(3),
  studentId: z.string().min(3),
  gradeLevel: z.enum(["G10", "G11-BTEC", "G12-BTEC"]),
  subjectCode: z.enum(["IT-SYSTEMS", "CYBER-SECURITY", "STEM-PHYSICS"]),
  mimeType: z.string().min(3),
  imageSizeBytes: z.number().int().positive().max(5 * 1024 * 1024),
  imageDigestSha256: z.string().min(8),
  studentNotes: z.string().max(1000),
  consentVerified: z.boolean(),
});

export type VisionAnalyzeRequest = z.infer<typeof visionAnalyzeSchema>;

export async function POST(rawBody: unknown) {
  const parsed = visionAnalyzeSchema.safeParse(rawBody);
  if (!parsed.success) {
    return {
      status: 400,
      body: {
        errorCode: "VALIDATION_ERROR",
        message: "بيانات تحليل صورة الواجب غير صالحة أو تتجاوز الحجم المسموح (5MB).",
      },
    };
  }

  const data = parsed.data;
  const context = createPlatformExecutionContext({
    actorId: data.studentId,
    tenantId: data.schoolId,
    schoolId: data.schoolId,
    roles: ["student"],
    parentalOrSchoolConsentVerified: data.consentVerified,
  });

  if (!context.parentalOrSchoolConsentVerified) {
    return {
      status: 403,
      body: {
        errorCode: "AUTHORIZATION_ERROR",
        message: "تحليل صور الواجبات يتطلب موافقة ولي الأمر أو المدرسة الفعّالة.",
      },
    };
  }

  const citations = GroundedRagOrchestrator.getAuthorizedCorpus().filter(
    (c) => c.subjectCode === data.subjectCode,
  );

  const analysisResult = AuthorizedLlmAdapter.analyzeHomeworkImageFormative({
    imageDigestSha256: data.imageDigestSha256,
    mimeType: data.mimeType,
    studentNotes: data.studentNotes,
    subjectCode: data.subjectCode,
    gradeLevel: data.gradeLevel,
    citations,
  });

  if (analysisResult.isFailure) {
    return {
      status: 400,
      body: {
        errorCode: analysisResult.error.code,
        message: analysisResult.error.message,
      },
    };
  }

  const visionJobId = generateUniqueId("vis-job");
  AuditSink.publish(context, {
    action: "VISION_HOMEWORK_FORMATIVE_ANALYSIS",
    resourceType: "VISION_JOB",
    resourceId: visionJobId,
    outcome: "TEACHER_REVIEW_REQUIRED",
    rawNotes: data.studentNotes,
    details: {
      ephemeralStorage: true,
      teacherReviewRequired: true,
      imageDigestSha256: data.imageDigestSha256,
    },
  });

  return {
    status: 200,
    body: Object.freeze({
      visionJobId,
      traceId: context.traceId,
      ephemeralProcessing: true,
      ...analysisResult.value,
    }),
  };
}
