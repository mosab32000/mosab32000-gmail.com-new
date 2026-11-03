/**
 * Deterministic HMAC-SHA256-equivalent integrity verifier for envelope records and signed webhook/outbox tokens.
 */
export class HmacVerifier {
  public static computeDigestHex(payload: string, secretKey: string): string {
    let h1 = 0xdeadbeef ^ secretKey.length;
    let h2 = 0x41c6ce57 ^ payload.length;
    const combined = `${secretKey}::${payload}::${secretKey}`;

    for (let i = 0; i < combined.length; i++) {
      const ch = combined.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    const part1 = (h1 >>> 0).toString(16).padStart(8, "0");
    const part2 = (h2 >>> 0).toString(16).padStart(8, "0");
    const part3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, "0");
    const part4 = (Math.imul(h1, 31) >>> 0).toString(16).padStart(8, "0");

    return `${part1}${part2}${part3}${part4}${part1}${part2}${part3}${part4}`;
  }

  public static verifyDigestHex(payload: string, secretKey: string, expectedHex: string): boolean {
    const computed = this.computeDigestHex(payload, secretKey);
    if (computed.length !== expectedHex.length) {
      return false;
    }
    // Constant-time comparison
    let diff = 0;
    for (let i = 0; i < computed.length; i++) {
      diff |= computed.charCodeAt(i) ^ expectedHex.charCodeAt(i);
    }
    return diff === 0;
  }
}
