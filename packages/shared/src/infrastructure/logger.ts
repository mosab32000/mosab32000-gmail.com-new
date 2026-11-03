import { ExecutionContext } from "../application/execution-context";
import { SystemClock } from "../lib/clock";

export interface StructuredLogEntry {
  readonly timestamp: string;
  readonly level: "INFO" | "WARN" | "ERROR";
  readonly traceId: string;
  readonly correlationId: string;
  readonly actorId: string;
  readonly schoolId: string;
  readonly feature: string;
  readonly message: string;
  readonly latencyMs?: number;
  readonly statusCode?: number;
  readonly errorCode?: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

const SENSITIVE_KEY_PATTERN = /(password|secret|token|authorization|api_key|apikey|private_key|national_id|phone)/i;

function scrubLogMetadata(meta: Record<string, unknown>): Record<string, unknown> {
  const safe: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(meta)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      safe[key] = "[REDACTED]";
    } else if (typeof val === "string" && /^Bearer\s+/i.test(val)) {
      safe[key] = "[REDACTED_TOKEN]";
    } else {
      safe[key] = val;
    }
  }
  return Object.freeze(safe);
}

export class StructuredLogger {
  private static entries: StructuredLogEntry[] = [];

  public static log(
    level: "INFO" | "WARN" | "ERROR",
    context: ExecutionContext,
    feature: string,
    message: string,
    extra?: {
      latencyMs?: number;
      statusCode?: number;
      errorCode?: string;
      metadata?: Record<string, unknown>;
    },
  ): StructuredLogEntry {
    const entry: StructuredLogEntry = Object.freeze({
      timestamp: SystemClock.nowIso(),
      level,
      traceId: context.traceId,
      correlationId: context.correlationId,
      actorId: context.actorId,
      schoolId: context.schoolId,
      feature,
      message,
      latencyMs: extra?.latencyMs,
      statusCode: extra?.statusCode,
      errorCode: extra?.errorCode,
      metadata: scrubLogMetadata(extra?.metadata ?? {}),
    });
    this.entries.unshift(entry);
    if (this.entries.length > 300) {
      this.entries.pop();
    }
    return entry;
  }

  public static getEntries(): readonly StructuredLogEntry[] {
    return Object.freeze([...this.entries]);
  }

  public static clear(): void {
    this.entries = [];
  }
}
