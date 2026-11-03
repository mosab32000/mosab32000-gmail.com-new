import { SystemClock } from "../../../../../../packages/shared/src/lib/clock";

export interface LivenessResponsePayload {
  readonly alive: true;
  readonly timestamp: string;
}

export async function GET(): Promise<{ status: number; body: LivenessResponsePayload }> {
  return {
    status: 200,
    body: Object.freeze({
      alive: true,
      timestamp: SystemClock.nowIso(),
    }),
  };
}
