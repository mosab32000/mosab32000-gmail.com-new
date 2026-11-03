export type SystemRole = 'student' | 'teacher' | 'assessor' | 'internal_verifier' | 'admin' | 'parent';

/**
 * Unified Zero-Trust Execution Context requiring traceId, correlationId, actorId, and tenantId.
 */
export interface ExecutionContext {
  readonly traceId: string;
  readonly correlationId: string;
  readonly actorId: string;
  readonly tenantId: string;
  readonly roles: readonly SystemRole[];
  readonly sessionTokenId: string;
  readonly tokenExpiresAtMs: number;
  readonly mfaVerified: boolean;
}

export function createExecutionContext(params: {
  actorId: string;
  tenantId: string;
  roles: readonly SystemRole[];
  sessionTokenId?: string;
  tokenExpiresAtMs?: number;
  mfaVerified?: boolean;
  traceId?: string;
  correlationId?: string;
}): ExecutionContext {
  const now = Date.now();
  return Object.freeze({
    traceId: params.traceId ?? `trc-${now}-${Math.random().toString(36).substring(2, 8)}`,
    correlationId: params.correlationId ?? `cor-${now}-${Math.random().toString(36).substring(2, 8)}`,
    actorId: params.actorId,
    tenantId: params.tenantId,
    roles: Object.freeze([...params.roles]),
    sessionTokenId: params.sessionTokenId ?? `tok-${now}`,
    tokenExpiresAtMs: params.tokenExpiresAtMs ?? now + 3600_000,
    mfaVerified: params.mfaVerified ?? false,
  });
}
