import { describe, it, expect, beforeEach } from "vitest";
import { createExecutionContext } from "@/application/execution-context";
import { TenancyAndSecurityGuard } from "@/lib/tenancy";
import { AuditLogger, redactSensitiveMetadata } from "@/infrastructure/observability/audit-logger";

describe("Phase 3 & 5: Multi-Tenancy Isolation, RBAC, Session Lifecycle & Audit Redaction", () => {
  beforeEach(() => {
    AuditLogger.clearForTesting();
    TenancyAndSecurityGuard.clearRevokedTokensForTesting();
  });

  it("blocks cross-tenant access when a user from Institution A tries to access Institution B data", () => {
    const contextTenantA = createExecutionContext({
      actorId: "teacher-101",
      tenantId: "inst-riyadh-01",
      roles: ["teacher"],
      mfaVerified: true,
    });

    const resourceInTenantB = {
      id: "sub-999",
      tenantId: "inst-jeddah-02",
      ownerStudentId: "student-500",
    };

    const result = TenancyAndSecurityGuard.authorizeResourceAccess({
      context: contextTenantA,
      resource: resourceInTenantB,
      resourceType: "BTEC_SUBMISSION",
      action: "READ",
      allowedRoles: ["teacher", "admin"],
    });

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.code).toBe("TENANT_ISOLATION_VIOLATION");
    }

    const logs = AuditLogger.getLogs("inst-riyadh-01");
    expect(logs.length).toBe(1);
    expect(logs[0].outcome).toBe("DENIED");
    expect(logs[0].reason).toContain("CROSS_TENANT_ACCESS_ATTEMPT");
  });

  it("blocks horizontal privilege escalation when Student A attempts to view Student B's submission in the same institution", () => {
    const studentAContext = createExecutionContext({
      actorId: "student-A",
      tenantId: "inst-riyadh-01",
      roles: ["student"],
    });

    const studentBResource = {
      id: "sub-202",
      tenantId: "inst-riyadh-01",
      ownerStudentId: "student-B",
    };

    const result = TenancyAndSecurityGuard.authorizeResourceAccess({
      context: studentAContext,
      resource: studentBResource,
      resourceType: "BTEC_SUBMISSION",
      action: "READ",
      allowedRoles: ["student", "teacher"],
    });

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.code).toBe("FORBIDDEN_ROLE_ERROR");
    }
  });

  it("allows a student to read their own submission within the same tenant", () => {
    const studentAContext = createExecutionContext({
      actorId: "student-A",
      tenantId: "inst-riyadh-01",
      roles: ["student"],
    });

    const ownResource = {
      id: "sub-201",
      tenantId: "inst-riyadh-01",
      ownerStudentId: "student-A",
    };

    const result = TenancyAndSecurityGuard.authorizeResourceAccess({
      context: studentAContext,
      resource: ownResource,
      resourceType: "BTEC_SUBMISSION",
      action: "READ",
      allowedRoles: ["student", "teacher"],
    });

    expect(result.isSuccess).toBe(true);
  });

  it("blocks vertical privilege escalation when a student or parent attempts to grade a submission", () => {
    const parentContext = createExecutionContext({
      actorId: "parent-01",
      tenantId: "inst-riyadh-01",
      roles: ["parent"],
      mfaVerified: true,
    });

    const resource = {
      id: "sub-201",
      tenantId: "inst-riyadh-01",
      ownerStudentId: "student-A",
    };

    const result = TenancyAndSecurityGuard.authorizeResourceAccess({
      context: parentContext,
      resource,
      resourceType: "BTEC_SUBMISSION",
      action: "GRADE",
      allowedRoles: ["assessor", "teacher", "admin"],
      requireMfa: true,
    });

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.code).toBe("FORBIDDEN_ROLE_ERROR");
    }
  });

  it("rejects reuse of a revoked session token and expired access tokens", () => {
    const context = createExecutionContext({
      actorId: "admin-01",
      tenantId: "inst-riyadh-01",
      roles: ["admin"],
      sessionTokenId: "tok-compromised-99",
      mfaVerified: true,
    });

    TenancyAndSecurityGuard.revokeSessionToken("tok-compromised-99");

    const checkRevoked = TenancyAndSecurityGuard.verifySessionContext(context);
    expect(checkRevoked.isFailure).toBe(true);
    if (checkRevoked.isFailure) {
      expect(checkRevoked.error.code).toBe("UNAUTHORIZED_ERROR");
    }

    const expiredContext = createExecutionContext({
      actorId: "admin-01",
      tenantId: "inst-riyadh-01",
      roles: ["admin"],
      tokenExpiresAtMs: Date.now() - 5000,
    });

    const checkExpired = TenancyAndSecurityGuard.verifySessionContext(expiredContext);
    expect(checkExpired.isFailure).toBe(true);
  });

  it("redacts passwords, bearer tokens, and secret keys from structured audit logs", () => {
    const rawMetadata = {
      userPassword: "SuperSecretPassword123!",
      authorizationHeader: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      apiKey: "sk-live-999999",
      nested: {
        refreshToken: "tok_secret_abc",
        safeCourseCode: "BTEC-UNIT-1",
      },
    };

    const redacted = redactSensitiveMetadata(rawMetadata);
    expect(redacted.userPassword).toBe("[REDACTED_SECRET]");
    expect(redacted.authorizationHeader).toBe("[REDACTED_SECRET]");
    expect(redacted.apiKey).toBe("[REDACTED_SECRET]");
    expect((redacted.nested as Record<string, unknown>).refreshToken).toBe("[REDACTED_SECRET]");
    expect((redacted.nested as Record<string, unknown>).safeCourseCode).toBe("BTEC-UNIT-1");
  });
});
