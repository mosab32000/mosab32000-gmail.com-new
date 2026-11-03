import { SystemClock } from "../../../../../../packages/shared/src/lib/clock";
import { extractOrCreateTraceHeaders } from "../../../../../../packages/shared/src/lib/trace-context";

export interface HealthResponsePayload {
  readonly status: "HEALTHY";
  readonly service: "jordan-edu-ai-api";
  readonly residencyRegion: "JO-AMMAN-1";
  readonly timestamp: string;
  readonly traceId: string;
}

export async function GET(headers?: Partial<Record<string, string>>): Promise<{
  status: number;
  body: HealthResponsePayload;
}> {
  const trace = extractOrCreateTraceHeaders(headers);
  return {
    status: 200,
    body: Object.freeze({
      status: "HEALTHY",
      service: "jordan-edu-ai-api",
      residencyRegion: "JO-AMMAN-1",
      timestamp: SystemClock.nowIso(),
      traceId: trace["x-trace-id"],
    }),
  };
}
