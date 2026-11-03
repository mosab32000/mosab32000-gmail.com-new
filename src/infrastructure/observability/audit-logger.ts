import { ExecutionContext } from "@/application/execution-context";

export interface StructuredAuditRecord {
  readonly id: string;
  readonly timestamp: string;
  readonly traceId: string;
  readonly correlationId: string;
  readonly actorId: string;
  readonly tenantId: string;
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly outcome: 'ALLOWED' | 'DENIED' | 'ERROR';
  readonly reason?: string;
  readonly metadata: Record<string, unknown>;
}

const SENSITIVE_FIELD_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /authorization/i,
  /api[-_]?key/i,
  /private[-_]?key/i,
  /credit[-_]?card/i,
  /ssn/i,
  /national[-_]?id/i,
];

/**
 * Deeply redacts any sensitive credentials, tokens, passwords, or PII keys before logging.
 */
export function redactSensitiveMetadata(input: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    const isSensitiveKey = SENSITIVE_FIELD_PATTERNS.some((pattern) => pattern.test(key));
    if (isSensitiveKey) {
      sanitized[key] = "[REDACTED_SECRET]";
    } else if (typeof value === "string" && (value.startsWith("eyJ") || value.startsWith("Bearer "))) {
      sanitized[key] = "[REDACTED_TOKEN]";
    } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = redactSensitiveMetadata(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Immutable Structured Audit Logger with PII/Secret Redaction and Correlation Tracing.
 */
export class AuditLogger {
  private static logs: StructuredAuditRecord[] = [];

  public static record(params: {
    context: ExecutionContext;
    action: string;
    resourceType: string;
    resourceId: string;
    outcome: 'ALLOWED' | 'DENIED' | 'ERROR';
    reason?: string;
    metadata?: Record<string, unknown>;
  }): StructuredAuditRecord {
    const sanitizedMetadata = redactSensitiveMetadata(params.metadata ?? {});
    const entry: StructuredAuditRecord = Object.freeze({
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      traceId: params.context.traceId,
      correlationId: params.context.correlationId,
      actorId: params.context.actorId,
      tenantId: params.context.tenantId,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      outcome: params.outcome,
      reason: params.reason,
      metadata: Object.freeze(sanitizedMetadata),
    });

    this.logs.unshift(entry);
    return entry;
  }

  public static getLogs(tenantId?: string): readonly StructuredAuditRecord[] {
    if (tenantId) {
      return this.logs.filter((l) => l.tenantId === tenantId);
    }
    return [...this.logs];
  }

  public static clearForTesting(): void {
    this.logs = [];
  }
}
