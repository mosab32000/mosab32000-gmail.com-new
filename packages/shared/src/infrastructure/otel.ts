import { ExecutionContext } from "../application/execution-context";
import { generateUniqueId } from "../lib/id";
import { SystemClock } from "../lib/clock";

export interface TelemetrySpan {
  readonly spanId: string;
  readonly traceId: string;
  readonly correlationId: string;
  readonly operationName: string;
  readonly component: "HTTP" | "DB" | "REDIS" | "KAFKA" | "LLM" | "VISION" | "VAULT";
  readonly schoolId: string;
  readonly startTimeIso: string;
  readonly durationMs: number;
  readonly status: "OK" | "ERROR";
  readonly attributes: Readonly<Record<string, string | number | boolean>>;
}

export class OTelTracer {
  private static spans: TelemetrySpan[] = [];

  public static recordSpan(
    context: ExecutionContext,
    component: TelemetrySpan["component"],
    operationName: string,
    durationMs: number,
    status: "OK" | "ERROR" = "OK",
    attributes: Record<string, string | number | boolean> = {},
  ): TelemetrySpan {
    const span: TelemetrySpan = Object.freeze({
      spanId: generateUniqueId("spn"),
      traceId: context.traceId,
      correlationId: context.correlationId,
      operationName,
      component,
      schoolId: context.schoolId,
      startTimeIso: SystemClock.nowIso(),
      durationMs,
      status,
      attributes: Object.freeze({ ...attributes }),
    });
    this.spans.unshift(span);
    if (this.spans.length > 200) {
      this.spans.pop();
    }
    return span;
  }

  public static getRecentSpans(): readonly TelemetrySpan[] {
    return Object.freeze([...this.spans]);
  }
}
