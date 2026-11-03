import { generateUniqueId } from "../lib/id";
import { SystemClock } from "../lib/clock";

export type PlatformRole = "student" | "teacher" | "parent" | "admin" | "assessor" | "internal_verifier" | "service";

/**
 * Immutable ExecutionContext propagated across every API request, domain event, and audit record.
 * Enforces Jordan Data Residency, school/tenant isolation, and minor consent status.
 */
export interface ExecutionContext {
  readonly traceId: string;
  readonly correlationId: string;
  readonly actorId: string;
  readonly tenantId: string;
  readonly schoolId: string;
  readonly roles: readonly PlatformRole[];
  readonly mfaVerified: boolean;
  readonly parentalOrSchoolConsentVerified: boolean;
  readonly residencyRegion: "JO-AMMAN-1";
  readonly timestamp: string;
}

export interface CreateExecutionContextInput {
  readonly actorId: string;
  readonly tenantId: string;
  readonly schoolId?: string;
  readonly roles: readonly PlatformRole[];
  readonly traceId?: string;
  readonly correlationId?: string;
  readonly mfaVerified?: boolean;
  readonly parentalOrSchoolConsentVerified?: boolean;
}

export function createPlatformExecutionContext(input: CreateExecutionContextInput): ExecutionContext {
  const schoolId = input.schoolId ?? input.tenantId;
  return Object.freeze({
    traceId: input.traceId ?? generateUniqueId("trc"),
    correlationId: input.correlationId ?? generateUniqueId("cor"),
    actorId: input.actorId,
    tenantId: input.tenantId,
    schoolId,
    roles: Object.freeze([...input.roles]),
    mfaVerified: input.mfaVerified ?? false,
    parentalOrSchoolConsentVerified: input.parentalOrSchoolConsentVerified ?? true,
    residencyRegion: "JO-AMMAN-1",
    timestamp: SystemClock.nowIso(),
  });
}
