let sequenceCounter = 1000;

/**
 * Generates collision-resistant identifiers with semantic prefixes (trc, cor, msg, job, aud).
 */
export function generateUniqueId(prefix = "id"): string {
  sequenceCounter += 1;
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${sequenceCounter}-${randomPart}`;
}
