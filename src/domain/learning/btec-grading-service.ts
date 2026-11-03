import { Entity } from "@/domain/shared/entity";
import { Result, success, failure } from "@/domain/shared/result";
import {
  DomainError,
  ValidationError,
  ConflictError,
  NotFoundError,
} from "@/domain/shared/domain-error";
import { ExecutionContext } from "@/application/execution-context";
import { TenancyAndSecurityGuard } from "@/lib/tenancy";
import { AuditLogger } from "@/infrastructure/observability/audit-logger";

export type BtecGradeAward = 'UNGRADED' | 'REFER' | 'PASS' | 'MERIT' | 'DISTINCTION';
export type SubmissionLifecycleStatus =
  | 'SUBMITTED'
  | 'UNDER_ASSESSMENT'
  | 'GRADED_FIRST_ATTEMPT'
  | 'RESUBMISSION_AUTHORIZED'
  | 'RESUBMITTED'
  | 'FINAL_LOCKED';

export interface BtecSubmissionProps {
  readonly tenantId: string;
  readonly studentId: string;
  readonly unitCode: string;
  readonly criterionId: string;
  readonly evidenceContent: string;
  readonly status: SubmissionLifecycleStatus;
  readonly awardedGrade: BtecGradeAward;
  readonly assessorId?: string;
  readonly assessorFeedback?: string;
  readonly internalVerifierId?: string;
  readonly resubmissionCount: number;
  readonly version: number;
  readonly updatedAt: string;
}

export class BtecSubmissionEntity extends Entity<BtecSubmissionProps> {
  private constructor(props: BtecSubmissionProps, id?: string) {
    super(props, id);
  }

  public static create(
    params: {
      tenantId: string;
      studentId: string;
      unitCode: string;
      criterionId: string;
      evidenceContent: string;
    },
    id?: string
  ): Result<BtecSubmissionEntity, ValidationError> {
    if (!params.tenantId.trim() || !params.studentId.trim()) {
      return failure(new ValidationError("معرف المؤسسة ومعرف الطالب إلزاميان لإنشاء التسليم."));
    }
    if (params.evidenceContent.trim().length < 20) {
      return failure(new ValidationError("محتوى الدليل المقدم قصير جداً ولا يستوفي الحد الأدنى للتسليم الأكاديمي."));
    }

    return success(
      new BtecSubmissionEntity(
        {
          tenantId: params.tenantId,
          studentId: params.studentId,
          unitCode: params.unitCode,
          criterionId: params.criterionId,
          evidenceContent: params.evidenceContent,
          status: 'SUBMITTED',
          awardedGrade: 'UNGRADED',
          resubmissionCount: 0,
          version: 1,
          updatedAt: new Date().toISOString(),
        },
        id
      )
    );
  }

  public get data(): Readonly<BtecSubmissionProps> {
    return this.props;
  }
}

/**
 * Production BTEC Assessment & Resubmission Service
 * Enforces:
 * - Multi-tenancy & RBAC checks via TenancyAndSecurityGuard
 * - Optimistic concurrency control (version check) to prevent concurrent/duplicate grading
 * - Pearson BTEC Resubmission Rule: maximum 1 Lead IV-authorized resubmission; locked once finalized
 */
export class BtecGradingService {
  private submissions = new Map<string, BtecSubmissionEntity>();

  public submitWork(
    context: ExecutionContext,
    input: {
      unitCode: string;
      criterionId: string;
      evidenceContent: string;
    }
  ): Result<BtecSubmissionEntity, DomainError> {
    const sessionResult = TenancyAndSecurityGuard.verifySessionContext(context);
    if (sessionResult.isFailure) {
      return failure(sessionResult.error);
    }

    const entityResult = BtecSubmissionEntity.create({
      tenantId: context.tenantId,
      studentId: context.actorId,
      unitCode: input.unitCode,
      criterionId: input.criterionId,
      evidenceContent: input.evidenceContent,
    });

    if (entityResult.isFailure) {
      return failure(entityResult.error);
    }

    const submission = entityResult.value;
    this.submissions.set(submission.id, submission);

    AuditLogger.record({
      context,
      action: "CREATE_BTEC_SUBMISSION",
      resourceType: "BTEC_SUBMISSION",
      resourceId: submission.id,
      outcome: "ALLOWED",
      metadata: {
        unitCode: input.unitCode,
        criterionId: input.criterionId,
        version: submission.data.version,
      },
    });

    return success(submission);
  }

  public getSubmission(
    context: ExecutionContext,
    submissionId: string
  ): Result<BtecSubmissionEntity, DomainError> {
    const existing = this.submissions.get(submissionId);
    if (!existing) {
      return failure(new NotFoundError(`التسليم رقم (${submissionId}) غير موجود.`));
    }

    const authResult = TenancyAndSecurityGuard.authorizeResourceAccess({
      context,
      resource: {
        id: existing.id,
        tenantId: existing.data.tenantId,
        ownerStudentId: existing.data.studentId,
      },
      resourceType: "BTEC_SUBMISSION",
      action: "READ",
      allowedRoles: ['student', 'teacher', 'assessor', 'internal_verifier', 'admin'],
    });

    if (authResult.isFailure) {
      return failure(authResult.error);
    }

    return success(existing);
  }

  /**
   * Grades a submission with strict role, MFA, and optimistic concurrency checks.
   */
  public gradeSubmission(
    context: ExecutionContext,
    input: {
      submissionId: string;
      expectedVersion: number;
      awardedGrade: BtecGradeAward;
      feedback: string;
    }
  ): Result<BtecSubmissionEntity, DomainError> {
    const existing = this.submissions.get(input.submissionId);
    if (!existing) {
      return failure(new NotFoundError(`التسليم رقم (${input.submissionId}) غير موجود.`));
    }

    const authResult = TenancyAndSecurityGuard.authorizeResourceAccess({
      context,
      resource: {
        id: existing.id,
        tenantId: existing.data.tenantId,
        ownerStudentId: existing.data.studentId,
      },
      resourceType: "BTEC_SUBMISSION",
      action: "GRADE",
      allowedRoles: ['assessor', 'teacher', 'admin'],
      requireMfa: true,
    });

    if (authResult.isFailure) {
      return failure(authResult.error);
    }

    // Prevent grading if already locked or already graded without resubmission
    if (existing.data.status === 'FINAL_LOCKED') {
      return failure(
        new ConflictError("هذا التسليم مقفل نهائياً (FINAL_LOCKED) ولا يمكن تعديل درجته.")
      );
    }

    if (existing.data.status === 'GRADED_FIRST_ATTEMPT') {
      return failure(
        new ConflictError(
          "منع التقييم المكرر: تم تقييم المحاولة الأولى مسبقاً؛ يلزم اعتماد إعادة تسليم رسمية من المدقق الداخلي (Internal Verifier) أولاً."
        )
      );
    }

    // Optimistic concurrency lock check
    if (existing.data.version !== input.expectedVersion) {
      return failure(
        new ConflictError(
          `تعارض تزامن (Optimistic Lock Failure): النسخة المتوقعة (${input.expectedVersion}) لا تطابق النسخة الفعلية (${existing.data.version}).`
        )
      );
    }

    const nextStatus: SubmissionLifecycleStatus =
      existing.data.status === 'RESUBMITTED' ? 'FINAL_LOCKED' : 'GRADED_FIRST_ATTEMPT';

    const updatedProps: BtecSubmissionProps = {
      ...existing.data,
      awardedGrade: input.awardedGrade,
      assessorId: context.actorId,
      assessorFeedback: input.feedback,
      status: nextStatus,
      version: existing.data.version + 1,
      updatedAt: new Date().toISOString(),
    };

    const updated = new (BtecSubmissionEntity as unknown as {
      new (props: BtecSubmissionProps, id: string): BtecSubmissionEntity;
    })(updatedProps, existing.id);

    this.submissions.set(updated.id, updated);

    AuditLogger.record({
      context,
      action: "GRADE_BTEC_SUBMISSION",
      resourceType: "BTEC_SUBMISSION",
      resourceId: updated.id,
      outcome: "ALLOWED",
      metadata: {
        previousGrade: existing.data.awardedGrade,
        newGrade: input.awardedGrade,
        newStatus: nextStatus,
        version: updatedProps.version,
      },
    });

    return success(updated);
  }

  /**
   * Authorizes a single BTEC resubmission (requires Internal Verifier or Admin role + MFA).
   */
  public authorizeResubmission(
    context: ExecutionContext,
    submissionId: string
  ): Result<BtecSubmissionEntity, DomainError> {
    const existing = this.submissions.get(submissionId);
    if (!existing) {
      return failure(new NotFoundError(`التسليم رقم (${submissionId}) غير موجود.`));
    }

    const authResult = TenancyAndSecurityGuard.authorizeResourceAccess({
      context,
      resource: {
        id: existing.id,
        tenantId: existing.data.tenantId,
        ownerStudentId: existing.data.studentId,
      },
      resourceType: "BTEC_SUBMISSION",
      action: "APPROVE_RESUBMISSION",
      allowedRoles: ['internal_verifier', 'admin'],
      requireMfa: true,
    });

    if (authResult.isFailure) {
      return failure(authResult.error);
    }

    if (existing.data.resubmissionCount >= 1 || existing.data.status === 'FINAL_LOCKED') {
      return failure(
        new ConflictError(
          "تجاوز الحد الأقصى لإعادة التسليم: تسمح لوائح Pearson BTEC بإعادة تسليم واحدة فقط لكل مهمة."
        )
      );
    }

    if (existing.data.status !== 'GRADED_FIRST_ATTEMPT') {
      return failure(
        new ConflictError("لا يمكن فتح إعادة التسليم قبل تقييم المحاولة الأولى.")
      );
    }

    const updatedProps: BtecSubmissionProps = {
      ...existing.data,
      status: 'RESUBMISSION_AUTHORIZED',
      internalVerifierId: context.actorId,
      resubmissionCount: existing.data.resubmissionCount + 1,
      version: existing.data.version + 1,
      updatedAt: new Date().toISOString(),
    };

    const updated = new (BtecSubmissionEntity as unknown as {
      new (props: BtecSubmissionProps, id: string): BtecSubmissionEntity;
    })(updatedProps, existing.id);

    this.submissions.set(updated.id, updated);

    AuditLogger.record({
      context,
      action: "AUTHORIZE_RESUBMISSION",
      resourceType: "BTEC_SUBMISSION",
      resourceId: updated.id,
      outcome: "ALLOWED",
      metadata: {
        internalVerifierId: context.actorId,
        resubmissionCount: updatedProps.resubmissionCount,
      },
    });

    return success(updated);
  }

  /**
   * Student submits revised evidence after Lead IV authorization.
   */
  public submitResubmissionEvidence(
    context: ExecutionContext,
    input: {
      submissionId: string;
      revisedEvidence: string;
    }
  ): Result<BtecSubmissionEntity, DomainError> {
    const existing = this.submissions.get(input.submissionId);
    if (!existing) {
      return failure(new NotFoundError(`التسليم رقم (${input.submissionId}) غير موجود.`));
    }

    const authResult = TenancyAndSecurityGuard.authorizeResourceAccess({
      context,
      resource: {
        id: existing.id,
        tenantId: existing.data.tenantId,
        ownerStudentId: existing.data.studentId,
      },
      resourceType: "BTEC_SUBMISSION",
      action: "WRITE",
      allowedRoles: ['student'],
    });

    if (authResult.isFailure) {
      return failure(authResult.error);
    }

    if (existing.data.status !== 'RESUBMISSION_AUTHORIZED') {
      return failure(
        new ConflictError("إعادة التسليم غير مصرح بها حالياً لهذا الواجب.")
      );
    }

    const updatedProps: BtecSubmissionProps = {
      ...existing.data,
      evidenceContent: input.revisedEvidence,
      status: 'RESUBMITTED',
      version: existing.data.version + 1,
      updatedAt: new Date().toISOString(),
    };

    const updated = new (BtecSubmissionEntity as unknown as {
      new (props: BtecSubmissionProps, id: string): BtecSubmissionEntity;
    })(updatedProps, existing.id);

    this.submissions.set(updated.id, updated);

    return success(updated);
  }
}
