import { ExecutionContext, SystemRole } from "@/application/execution-context";
import { Result, success, failure } from "@/domain/shared/result";
import {
  DomainError,
  UnauthorizedError,
  ForbiddenRoleError,
  TenantIsolationError,
  ValidationError,
} from "@/domain/shared/domain-error";
import { AuditLogger } from "@/infrastructure/observability/audit-logger";

export interface TenantScopedResource {
  readonly id: string;
  readonly tenantId: string;
  readonly ownerStudentId?: string;
}

/**
 * Multi-Tenancy & Session Revocation Registry
 * Enforces:
 * 1. Token expiration and revocation checks (prevents reuse of revoked sessions)
 * 2. Strict tenant isolation (prevents cross-tenant data leakage)
 * 3. Horizontal access control (prevents student A from accessing student B's records)
 * 4. Vertical RBAC + MFA enforcement for sensitive grading/admin operations
 */
export class TenancyAndSecurityGuard {
  private static revokedSessionTokens = new Set<string>();

  public static revokeSessionToken(tokenId: string): void {
    this.revokedSessionTokens.add(tokenId);
  }

  public static isTokenRevoked(tokenId: string): boolean {
    return this.revokedSessionTokens.has(tokenId);
  }

  public static clearRevokedTokensForTesting(): void {
    this.revokedSessionTokens.clear();
  }

  /**
   * Validates active session lifecycle (not expired, not revoked, valid tenantId)
   */
  public static verifySessionContext(
    context: ExecutionContext,
    nowMs: number = Date.now()
  ): Result<ExecutionContext, DomainError> {
    if (!context.actorId || !context.tenantId) {
      return failure(new ValidationError("سياق الجلسة يفتقر إلى معرف المستخدم أو معرف المؤسسة (tenantId)."));
    }

    if (this.revokedSessionTokens.has(context.sessionTokenId)) {
      AuditLogger.record({
        context,
        action: "SESSION_VALIDATION",
        resourceType: "SESSION",
        resourceId: context.sessionTokenId,
        outcome: "DENIED",
        reason: "REVOKED_SESSION_TOKEN_REUSE",
      });
      return failure(new UnauthorizedError("تم إبطال رمز الجلسة مسبقاً ولا يمكن إعادة استخدامه."));
    }

    if (context.tokenExpiresAtMs <= nowMs) {
      AuditLogger.record({
        context,
        action: "SESSION_VALIDATION",
        resourceType: "SESSION",
        resourceId: context.sessionTokenId,
        outcome: "DENIED",
        reason: "EXPIRED_ACCESS_TOKEN",
      });
      return failure(new UnauthorizedError("انتهت صلاحية رمز الجلسة (Access Token Expired)."));
    }

    return success(context);
  }

  /**
   * Enforces strict Multi-Tenancy Isolation and Horizontal/Vertical Access Control
   */
  public static authorizeResourceAccess(params: {
    context: ExecutionContext;
    resource: TenantScopedResource;
    resourceType: string;
    action: 'READ' | 'WRITE' | 'GRADE' | 'APPROVE_RESUBMISSION' | 'DELETE';
    allowedRoles: readonly SystemRole[];
    requireMfa?: boolean;
  }): Result<true, DomainError> {
    const sessionCheck = this.verifySessionContext(params.context);
    if (sessionCheck.isFailure) {
      return failure(sessionCheck.error);
    }

    // 1. Multi-Tenant Isolation Gate: Actor's tenantId MUST match resource's tenantId
    if (params.context.tenantId !== params.resource.tenantId) {
      AuditLogger.record({
        context: params.context,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resource.id,
        outcome: "DENIED",
        reason: `CROSS_TENANT_ACCESS_ATTEMPT (${params.context.tenantId} -> ${params.resource.tenantId})`,
      });
      return failure(
        new TenantIsolationError(
          `رفض الوصول العابر للمؤسسات: لا يحق للمنتسب إلى (${params.context.tenantId}) الوصول إلى موارد (${params.resource.tenantId}).`
        )
      );
    }

    // 2. Vertical Role-Based Access Control (RBAC)
    const hasRequiredRole = params.context.roles.some((role) =>
      params.allowedRoles.includes(role)
    );
    if (!hasRequiredRole) {
      AuditLogger.record({
        context: params.context,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resource.id,
        outcome: "DENIED",
        reason: "INSUFFICIENT_ROLE_PRIVILEGE",
        metadata: { actorRoles: params.context.roles, requiredRoles: params.allowedRoles },
      });
      return failure(
        new ForbiddenRoleError(
          `صلاحيات غير كافية لتنفيذ الإجراء (${params.action}) على المورد (${params.resourceType}).`
        )
      );
    }

    // 3. MFA Verification Gate for high-privilege operations (Grading, Resubmission Approval, Admin)
    if (params.requireMfa && !params.context.mfaVerified) {
      AuditLogger.record({
        context: params.context,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resource.id,
        outcome: "DENIED",
        reason: "MFA_STEP_UP_REQUIRED",
      });
      return failure(
        new UnauthorizedError("يتطلب هذا الإجراء الحساس تحققاً ثنائياً مفعلاً (2FA / MFA Required).")
      );
    }

    // 4. Horizontal Isolation for Students: A student can ONLY read/write their own record
    const isStaffOrAdmin = params.context.roles.some((r) =>
      ['teacher', 'assessor', 'internal_verifier', 'admin'].includes(r)
    );
    if (
      !isStaffOrAdmin &&
      params.resource.ownerStudentId &&
      params.resource.ownerStudentId !== params.context.actorId
    ) {
      AuditLogger.record({
        context: params.context,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resource.id,
        outcome: "DENIED",
        reason: "HORIZONTAL_PRIVILEGE_ESCALATION_ATTEMPT",
        metadata: {
          actorId: params.context.actorId,
          ownerStudentId: params.resource.ownerStudentId,
        },
      });
      return failure(
        new ForbiddenRoleError(
          "منع الوصول الأفقي: لا يُسمح للطالب بالاطلاع على درجات أو تسليمات طالب آخر."
        )
      );
    }

    AuditLogger.record({
      context: params.context,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resource.id,
      outcome: "ALLOWED",
    });

    return success(true);
  }
}
