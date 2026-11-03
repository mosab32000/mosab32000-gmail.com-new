export interface PiiRedactionResult {
  readonly redactedText: string;
  readonly redactionCount: number;
  readonly detectedCategories: readonly string[];
}

/**
 * Redacts Jordanian National IDs (10 digits), Jordanian mobile numbers (+962 / 077 / 078 / 079),
 * email addresses, and Bearer tokens before AI embedding, Vision processing, or audit logging.
 */
export class PiiRedactor {
  public static redactText(input: string): PiiRedactionResult {
    let redacted = input;
    let count = 0;
    const categories = new Set<string>();

    // 1. Bearer / JWT tokens
    redacted = redacted.replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, () => {
      count += 1;
      categories.add("AUTH_TOKEN");
      return "[REDACTED_TOKEN]";
    });

    // 2. Email addresses
    redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, () => {
      count += 1;
      categories.add("EMAIL_ADDRESS");
      return "[REDACTED_EMAIL]";
    });

    // 3. Jordanian phone numbers (+9627... or 07[789]...)
    redacted = redacted.replace(/(?:\+962|00962|0)?7[789]\d{7}\b/g, () => {
      count += 1;
      categories.add("JORDAN_PHONE");
      return "[REDACTED_JO_PHONE]";
    });

    // 4. Jordanian 10-digit National ID
    redacted = redacted.replace(/\b(?:9\d{9}|2\d{9}|1\d{9})\b/g, () => {
      count += 1;
      categories.add("JORDAN_NATIONAL_ID");
      return "[REDACTED_NATIONAL_ID]";
    });

    return Object.freeze({
      redactedText: redacted,
      redactionCount: count,
      detectedCategories: Object.freeze(Array.from(categories)),
    });
  }
}
