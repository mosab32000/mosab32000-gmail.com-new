import { generateUniqueId } from "./id";

export interface TraceContextHeaders {
  readonly "x-trace-id": string;
  readonly "x-correlation-id": string;
  readonly "x-school-id": string;
  readonly "x-actor-id": string;
}

export function extractOrCreateTraceHeaders(
  headers?: Partial<Record<string, string>>,
): TraceContextHeaders {
  return Object.freeze({
    "x-trace-id": headers?.["x-trace-id"] || generateUniqueId("trc"),
    "x-correlation-id": headers?.["x-correlation-id"] || generateUniqueId("cor"),
    "x-school-id": headers?.["x-school-id"] || "school-amman-01",
    "x-actor-id": headers?.["x-actor-id"] || "anonymous",
  });
}
