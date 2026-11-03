import { describe, it, expect, beforeEach } from "vitest";
import { createExecutionContext } from "@/application/execution-context";
import { BtecGradingService } from "@/domain/learning/btec-grading-service";
import { AiLearningOrchestrator } from "@/services/ai-learning-orchestrator";
import { AuditLogger } from "@/infrastructure/observability/audit-logger";

describe("Phase 3 & 4: BTEC Grading Lifecycle, Optimistic Concurrency & Resubmission Rules", () => {
  let service: BtecGradingService;

  beforeEach(() => {
    AuditLogger.clearForTesting();
    service = new BtecGradingService();
  });

  it("enforces complete BTEC grading lifecycle: submit -> first grade -> prevent duplicate grade -> IV authorize resubmission -> resubmit -> final lock", () => {
    const studentCtx = createExecutionContext({
      actorId: "stu-100",
      tenantId: "btec-academy-1",
      roles: ["student"],
    });

    const assessorNoMfaCtx = createExecutionContext({
      actorId: "assessor-200",
      tenantId: "btec-academy-1",
      roles: ["assessor"],
      mfaVerified: false,
    });

    const assessorWithMfaCtx = createExecutionContext({
      actorId: "assessor-200",
      tenantId: "btec-academy-1",
      roles: ["assessor"],
      mfaVerified: true,
    });

    const internalVerifierCtx = createExecutionContext({
      actorId: "iv-300",
      tenantId: "btec-academy-1",
      roles: ["internal_verifier"],
      mfaVerified: true,
    });

    // 1. Student submits evidence
    const submitRes = service.submitWork(studentCtx, {
      unitCode: "Unit 1",
      criterionId: "M1",
      evidenceContent: "تحليل شامل لأثر سرعة ناقل PCIe 5.0 وذاكرة DDR5 على خوادم المؤسسات.",
    });
    expect(submitRes.isSuccess).toBe(true);
    if (!submitRes.isSuccess) return;

    const submissionId = submitRes.value.id;
    expect(submitRes.value.data.version).toBe(1);

    // 2. Assessor without MFA is blocked from grading
    const noMfaGrade = service.gradeSubmission(assessorNoMfaCtx, {
      submissionId,
      expectedVersion: 1,
      awardedGrade: "PASS",
      feedback: "استيفاء معيار P1 فقط.",
    });
    expect(noMfaGrade.isFailure).toBe(true);

    // 3. Assessor with MFA grades first attempt
    const firstGrade = service.gradeSubmission(assessorWithMfaCtx, {
      submissionId,
      expectedVersion: 1,
      awardedGrade: "PASS",
      feedback: "تم استيفاء معيار النجاح، ينقص التحليل الكمي لبلوغ الجدارة.",
    });
    expect(firstGrade.isSuccess).toBe(true);
    if (!firstGrade.isSuccess) return;
    expect(firstGrade.value.data.status).toBe("GRADED_FIRST_ATTEMPT");
    expect(firstGrade.value.data.version).toBe(2);

    // 4. Attempting to grade again without IV resubmission authorization fails
    const duplicateGrade = service.gradeSubmission(assessorWithMfaCtx, {
      submissionId,
      expectedVersion: 2,
      awardedGrade: "MERIT",
      feedback: "تعديل غير مصرح به.",
    });
    expect(duplicateGrade.isFailure).toBe(true);
    if (duplicateGrade.isFailure) {
      expect(duplicateGrade.error.code).toBe("CONFLICT_ERROR");
    }

    // 5. Internal Verifier authorizes 1 resubmission
    const ivAuth = service.authorizeResubmission(internalVerifierCtx, submissionId);
    expect(ivAuth.isSuccess).toBe(true);
    if (!ivAuth.isSuccess) return;
    expect(ivAuth.value.data.status).toBe("RESUBMISSION_AUTHORIZED");
    expect(ivAuth.value.data.resubmissionCount).toBe(1);

    // 6. Student submits revised work
    const resubWork = service.submitResubmissionEvidence(studentCtx, {
      submissionId,
      revisedEvidence: "تحليل كمي مفصل يقارن بين 64 GB/s في PCIe 5.0 و 32 GB/s في الجيل الرابع مع حساب زمن التأخير.",
    });
    expect(resubWork.isSuccess).toBe(true);
    if (!resubWork.isSuccess) return;
    expect(resubWork.value.data.status).toBe("RESUBMITTED");

    // 7. Assessor grades resubmission -> transitions to FINAL_LOCKED
    const finalGrade = service.gradeSubmission(assessorWithMfaCtx, {
      submissionId,
      expectedVersion: resubWork.value.data.version,
      awardedGrade: "DISTINCTION",
      feedback: "استيفاء كامل لمعايير التميز مع أدلة كمية.",
    });
    expect(finalGrade.isSuccess).toBe(true);
    if (!finalGrade.isSuccess) return;
    expect(finalGrade.value.data.status).toBe("FINAL_LOCKED");

    // 8. Second resubmission authorization is strictly rejected per BTEC rules
    const secondResub = service.authorizeResubmission(internalVerifierCtx, submissionId);
    expect(secondResub.isFailure).toBe(true);
  });

  it("evaluates BTEC rubric submissions deterministically via AiLearningOrchestrator", () => {
    const shortSubmission = AiLearningOrchestrator.evaluateSubmission("unit-1", "P1", "قصير جداً");
    expect(shortSubmission.isFailure).toBe(true);

    const distinctionSubmission = AiLearningOrchestrator.evaluateSubmission(
      "unit-1",
      "D1",
      "بسبب استخدام معالج الخادم مع ذاكرة DDR5 وناقل PCIe وشريحة chipset في شبكة TCP/IP مع router و switch وجدار حماية firewall ومصفوفة RAID لتعزيز التوسع والكفاءة، يؤدي إلى تحسين الأداء مقارنة بالبدائل وتقليل latency وزيادة bandwidth مع تبرير هندسي ونتيجة إثبات."
    );
    expect(distinctionSubmission.isSuccess).toBe(true);
    if (distinctionSubmission.isSuccess) {
      expect(distinctionSubmission.value.awardedLevel).toBe("Distinction");
      expect(distinctionSubmission.value.score).toBeGreaterThanOrEqual(85);
    }
  });
});
