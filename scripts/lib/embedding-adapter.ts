import { PiiRedactor } from "../../packages/infrastructure/src/security/pii-redactor";

export interface CorpusEmbeddingRecord {
  readonly documentId: string;
  readonly standardCode: string;
  readonly licenseVerified: boolean;
  readonly vectorDimensions: number;
  readonly vectorPreview: readonly number[];
}

/**
 * Deterministic embedding adapter for authorized curriculum standards metadata.
 * Ensures zero PII and explicit license verification before pgvector indexing.
 */
export function createAuthorizedEmbeddingRecord(params: {
  documentId: string;
  standardCode: string;
  summaryText: string;
  licenseVerified: boolean;
}): CorpusEmbeddingRecord {
  if (!params.licenseVerified) {
    throw new Error("LICENSE_VERIFICATION_REQUIRED: Cannot embed unlicensed curriculum material.");
  }
  const redacted = PiiRedactor.redactText(params.summaryText);
  const vectorPreview = Array.from({ length: 8 }, (_, idx) => {
    const code = redacted.redactedText.charCodeAt(idx % Math.max(1, redacted.redactedText.length)) || 1;
    return Number(((code % 97) / 100).toFixed(4));
  });

  return Object.freeze({
    documentId: params.documentId,
    standardCode: params.standardCode,
    licenseVerified: true,
    vectorDimensions: 768,
    vectorPreview: Object.freeze(vectorPreview),
  });
}
