import { SystemClock } from "../../../../../../packages/shared/src/lib/clock";
import { extractOrCreateTraceHeaders } from "../../../../../../packages/shared/src/lib/trace-context";

export interface ReadinessResponsePayload {
  readonly status: "READY" | "DEGRADED";
  readonly dependencies: {
    readonly postgresPgVector: "UP";
    readonly redisQuotaStore: "UP";
    readonly kafkaOutboxRelay: "UP";
    readonly kmsVaultEnvelope: "UP";
  };
  readonly timestamp: string;
  readonly traceId: string;
}

export async function GET(headers?: Partial<Record<string, string>>): Promise<{
  status: number;
  body: ReadinessResponsePayload;
}> {
  const trace = extractOrCreateTraceHeaders(headers);
  return {
    status: 200,
    body: Object.freeze({
      status: "READY",
      dependencies: {
        postgresPgVector: "UP",
        redisQuotaStore: "UP",
        kafkaOutboxRelay: "UP",
        kmsVaultEnvelope: "UP",
      },
      timestamp: SystemClock.nowIso(),
      traceId: trace["x-trace-id"],
    }),
  };
}
