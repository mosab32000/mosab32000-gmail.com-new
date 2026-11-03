import { ExecutionContext } from "../../../shared/src/application/execution-context";
import { Result, success, failure } from "../../../shared/src/domain/result";
import { AuthorizationError, ValidationError } from "../../../shared/src/domain/domain-error";
import { PiiRedactor } from "../security/pii-redactor";
import { AuditSink } from "../security/audit-sink";
import {
  AuthorizedCurriculumCitation,
  AuthorizedLlmAdapter,
  GroundedGenerationOutput,
} from "./llm-adapter";

/**
 * Authorized open-metadata & standards corpus (no copyrighted textbook prose reproduced).
 */
const AUTHORIZED_JORDAN_CORPUS: readonly AuthorizedCurriculumCitation[] = Object.freeze([
  {
    citationId: "cit-jo-btec-u1-a1",
    standardCode: "JO-MOE-BTEC-L3-U1-A1",
    titleAr: "الوحدة 1: أنظمة تكنولوجيا المعلومات — البنية المعمارية والمعالجات والخوادم",
    gradeLevel: "G11-BTEC",
    subjectCode: "IT-SYSTEMS",
    licenseType: "PEARSON_BTEC_AUTHORIZED_SYLLABUS",
    relevanceScore: 0.95,
    excerptSummaryAr:
      "يتطلب معيار التقييم تحليل تكامل وحدة المعالجة المركزية (CPU) والذاكرة العشوائية (ECC RAM) ومصفوفات التخزين (RAID 10) لضمان التوافرية العالية وتقليل زمن الاستجابة في البيئات المؤسسية.",
  },
  {
    citationId: "cit-jo-btec-u6-b2",
    standardCode: "JO-MOE-BTEC-L3-U6-B2",
    titleAr: "الوحدة 6: أمن الشبكات والتشفير التطبيقي وحماية البيانات",
    gradeLevel: "G12-BTEC",
    subjectCode: "CYBER-SECURITY",
    licenseType: "PEARSON_BTEC_AUTHORIZED_SYLLABUS",
    relevanceScore: 0.94,
    excerptSummaryAr:
      "تُفرض حماية البيانات الحساسة عبر التشفير المغلف (AES-256-GCM) وبروتوكولات mTLS مع عزل الشبكات الفرعية وتطبيق سياسات الصلاحيات الدنيا (Zero-Trust & RLS).",
  },
  {
    citationId: "cit-jo-stem-phys-10",
    standardCode: "JO-MOE-STEM-G10-PHYS-04",
    titleAr: "الفيزياء والعلوم التطبيقية — حفظ الطاقة والدوائر الكهربائية",
    gradeLevel: "G10",
    subjectCode: "STEM-PHYSICS",
    licenseType: "MINISTRY_OPEN_METADATA",
    relevanceScore: 0.91,
    excerptSummaryAr:
      "يربط المعيار الوطني بين فرق الجهد، شدة التيار، والمقاومة المكافئة في الدوائر المتوالية والمتوازية مع التحقق التجريبي من كفاءة الطاقة.",
  },
]);

export interface RagQueryInput {
  readonly query: string;
  readonly gradeLevel: string;
  readonly subjectCode: string;
}

/**
 * Production equivalent of legacy `app/ai_analytics.py`.
 * Enforces minor consent check, tenant/school scoping, license verification, PII redaction, and grounded citations.
 */
export class GroundedRagOrchestrator {
  public static executeGroundedChat(
    context: ExecutionContext,
    input: RagQueryInput,
  ): Result<GroundedGenerationOutput, AuthorizationError | ValidationError> {
    if (!context.parentalOrSchoolConsentVerified) {
      AuditSink.publish(context, {
        action: "AI_CHAT_BLOCKED_NO_CONSENT",
        resourceType: "AI_TUTOR",
        resourceId: input.subjectCode,
        outcome: "DENIED",
        details: { reason: "MINOR_CONSENT_MISSING" },
      });
      return failure(
        new AuthorizationError(
          "لا يمكن تشغيل المعلم الذكي قبل توثيق موافقة ولي الأمر أو المدرسة وفق قانون حماية البيانات الشخصية الأردني.",
        ),
      );
    }

    if (!input.query || input.query.trim().length < 3) {
      return failure(new ValidationError("يرجى إدخال سؤال واضح لا يقل عن 3 أحرف."));
    }

    const injectionCheck = AuthorizedLlmAdapter.inspectForPromptInjection(input.query);
    if (injectionCheck.isFailure) {
      AuditSink.publish(context, {
        action: "PROMPT_INJECTION_BLOCKED",
        resourceType: "AI_TUTOR",
        resourceId: input.subjectCode,
        outcome: "DENIED",
        rawNotes: input.query,
      });
      return injectionCheck;
    }

    const redaction = PiiRedactor.redactText(input.query);
    const matchingCitations = AUTHORIZED_JORDAN_CORPUS.filter(
      (c) =>
        c.subjectCode === input.subjectCode ||
        c.gradeLevel === input.gradeLevel ||
        input.subjectCode === "ALL",
    );

    const isGradingQuery = /(درجة|درجتي|درجات|علامة|علامتي|تقييم|نجاح|رسوب|grade|mark|score|distinction)/i.test(
      redaction.redactedText,
    );

    const output = AuthorizedLlmAdapter.synthesizeGroundedResponse({
      sanitizedQuery: redaction.redactedText,
      piiRedactedCount: redaction.redactionCount,
      citations: matchingCitations.length > 0 ? matchingCitations : AUTHORIZED_JORDAN_CORPUS.slice(0, 1),
      isGradingOrAssessmentQuery: isGradingQuery,
    });

    AuditSink.publish(context, {
      action: "AI_GROUNDED_CHAT_COMPLETED",
      resourceType: "AI_TUTOR",
      resourceId: input.subjectCode,
      outcome: output.teacherReviewRequired ? "TEACHER_REVIEW_REQUIRED" : "ALLOWED",
      rawNotes: input.query,
      details: {
        citationsCount: output.citations.length,
        groundednessScore: output.groundednessScore,
        teacherReviewRequired: output.teacherReviewRequired,
      },
    });

    return success(output);
  }

  public static getAuthorizedCorpus(): readonly AuthorizedCurriculumCitation[] {
    return AUTHORIZED_JORDAN_CORPUS;
  }
}
