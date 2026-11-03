/**
 * Playwright E2E configuration for Jordan Edu AI Platform (Arabic RTL + WCAG AA verification).
 */
export interface PlaywrightConfigContract {
  readonly testDir: string;
  readonly timeoutMs: number;
  readonly retries: number;
  readonly baseURL: string;
  readonly locale: string;
}

export const playwrightConfig: PlaywrightConfigContract = {
  testDir: "./e2e",
  timeoutMs: 30000,
  retries: 2,
  baseURL: "http://localhost:3000",
  locale: "ar-JO",
};

export default playwrightConfig;
