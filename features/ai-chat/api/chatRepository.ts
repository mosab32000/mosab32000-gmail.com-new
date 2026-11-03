import { Result, success, failure } from "../../../packages/shared/src/domain/result";
import { DomainError, ValidationError } from "../../../packages/shared/src/domain/domain-error";
import { createPlatformExecutionContext } from "../../../packages/shared/src/application/execution-context";
import { GroundedRagOrchestrator } from "../../../packages/infrastructure/src/ai/rag-orchestrator";
import { PiiRedactor } from "../../../packages/infrastructure/src/security/pii-redactor";
import { generateUniqueId } from "../../../packages/shared/src/lib/id";
import { SystemClock } from "../../../packages/shared/src/lib/clock";
import { aiChatRequestSchema, ValidatedAIChatRequest } from "../lib/validation";
import { ChatMessageViewModel, mapGroundedOutputToAssistantMessage } from "../lib/mappers";

export interface SendGroundedChatResult {
  readonly studentMessage: ChatMessageViewModel;
  readonly assistantMessage: ChatMessageViewModel;
}

export class AIChatRepository {
  public static sendGroundedMessage(
    rawInput: ValidatedAIChatRequest,
  ): Result<SendGroundedChatResult, DomainError> {
    const parsed = aiChatRequestSchema.safeParse(rawInput);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? "بيانات الطلب غير صالحة.";
      return failure(new ValidationError(firstIssue));
    }

    const valid = parsed.data;
    const context = createPlatformExecutionContext({
      actorId: "student-amman-01",
      tenantId: valid.schoolId,
      schoolId: valid.schoolId,
      roles: ["student"],
      parentalOrSchoolConsentVerified: valid.consentVerified,
    });

    const piiScrubbedStudentText = PiiRedactor.redactText(valid.message);

    const ragResult = GroundedRagOrchestrator.executeGroundedChat(context, {
      query: valid.message,
      gradeLevel: valid.gradeLevel,
      subjectCode: valid.subjectCode,
    });

    if (ragResult.isFailure) {
      return failure(ragResult.error);
    }

    const studentMessage: ChatMessageViewModel = Object.freeze({
      id: generateUniqueId("msg"),
      sender: "student",
      contentAr: piiScrubbedStudentText.redactedText,
      timestampIso: SystemClock.nowIso(),
      traceId: context.traceId,
      piiRedactedCount: piiScrubbedStudentText.redactionCount,
      citations: [],
    });

    const assistantMessage = mapGroundedOutputToAssistantMessage(ragResult.value, context.traceId);

    return success(
      Object.freeze({
        studentMessage,
        assistantMessage,
      }),
    );
  }
}
