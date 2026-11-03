import { ExecutionContext } from "../../../shared/src/application/execution-context";
import { generateUniqueId } from "../../../shared/src/lib/id";
import { SystemClock } from "../../../shared/src/lib/clock";
import { PiiRedactor } from "./pii-redactor";

export interface ImmutableAuditEvent {
  readonly eventId: string;
  readonly timestamp: string;
  readonly traceId: string;
  readonly correlationId: string;
  readonly actorId: string;
  readonly schoolId: string;
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly outcome: "ALLOWED" | "DENIED" | "TEACHER_REVIEW_REQUIRED";
  readonly piiRedactedCount: number;
  readonly details: Readonly<Record<string, string | number | boolean>>;
}

export class AuditSink {
  private static events: ImmutableAuditEvent[] = [];

  public static publish(
    context: ExecutionContext,
    params: {
      action: string;
      resourceType: string;
      resourceId: string;
      outcome: ImmutableAuditEvent["outcome"];
      rawNotes?: string;
      details?: Record<string, string | number | boolean>;
    },
  ): ImmutableAuditEvent {
    const redaction = params.rawNotes
      ? PiiRedactor.redactText(params.rawNotes)
      : { redactedText: "", redactionCount: 0, detectedCategories: [] };

    const event: ImmutableAuditEvent = Object.freeze({
      eventId: generateUniqueId("aud"),
      timestamp: SystemClock.nowIso(),
      traceId: context.traceId,
      correlationId: context.correlationId,
      actorId: context.actorId,
      schoolId: context.schoolId,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      outcome: params.outcome,
      piiRedactedCount: redaction.redactionCount,
      details: Object.freeze({
        ...(params.details ?? {}),
        ...(params.rawNotes ? { notes: redaction.redactedText } : {}),
      }),
    });

    this.events.unshift(event);
    if (this.events.length > 500) {
      this.events.pop();
    }
    return event;
  }

  public static getEvents(schoolId?: string): readonly ImmutableAuditEvent[] {
    if (!schoolId) {
      return Object.freeze([...this.events]);
    }
    return Object.freeze(this.events.filter((e) => e.schoolId === schoolId));
  }

  public static clearForTesting(): void {
    this.events = [];
  }
}
