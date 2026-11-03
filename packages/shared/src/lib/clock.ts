/**
 * Deterministic-ready Clock abstraction for auditability and testing.
 */
export class SystemClock {
  private static overrideTimeMs: number | null = null;

  public static nowMs(): number {
    return this.overrideTimeMs ?? Date.now();
  }

  public static nowIso(): string {
    return new Date(this.nowMs()).toISOString();
  }

  public static setFixedTimeForTesting(epochMs: number | null): void {
    this.overrideTimeMs = epochMs;
  }
}
