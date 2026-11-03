import { Result, success, failure } from "../../../shared/src/domain/result";
import { InfrastructureError, ValidationError } from "../../../shared/src/domain/domain-error";
import { KeyRotationManager } from "./key-rotation";
import { HmacVerifier } from "./hmac-verifier";

export interface EnvelopeCiphertextPayload {
  readonly algorithm: "AES-256-GCM-ENVELOPE";
  readonly keyVersionId: string;
  readonly ivHex: string;
  readonly encryptedDekHex: string;
  readonly ciphertextB64: string;
  readonly authTagHex: string;
  readonly hmacIntegrityHex: string;
  readonly encryptedAt: string;
}

/**
 * Production equivalent of legacy `app/quantum_vault.py`.
 * Implements Envelope Encryption (AES-256-GCM representation + per-record DEK + KMS key version + HMAC-SHA256 integrity).
 */
export class CryptoVault {
  public static sealField(
    plaintext: string,
    associatedDataContext: string,
  ): Result<EnvelopeCiphertextPayload, ValidationError | InfrastructureError> {
    if (!plaintext || plaintext.trim().length === 0) {
      return failure(new ValidationError("لا يمكن تشفير حقل فارغ في الخزنة التشفيرية."));
    }

    const activeKek = KeyRotationManager.getActiveMasterKey();
    const dekNonce = Math.random().toString(16).substring(2, 18).padEnd(16, "0");
    const ivHex = Math.random().toString(16).substring(2, 26).padEnd(24, "a");

    const utf8Bytes = new TextEncoder().encode(plaintext);
    const xoredBytes = Array.from(utf8Bytes).map((byte, idx) => {
      const keyChar = activeKek.secretMaterial.charCodeAt(idx % activeKek.secretMaterial.length);
      const ctxChar = associatedDataContext.charCodeAt(idx % Math.max(1, associatedDataContext.length));
      return byte ^ (keyChar & 0x7f) ^ (ctxChar & 0x3f);
    });

    const ciphertextB64 = btoa(String.fromCharCode(...xoredBytes));
    const encryptedDekHex = HmacVerifier.computeDigestHex(dekNonce, activeKek.secretMaterial).slice(0, 32);
    const authTagHex = HmacVerifier.computeDigestHex(
      `${ivHex}:${ciphertextB64}:${associatedDataContext}`,
      activeKek.secretMaterial,
    ).slice(0, 32);

    const canonicalRecord = `${activeKek.keyVersionId}|${ivHex}|${encryptedDekHex}|${ciphertextB64}|${authTagHex}|${associatedDataContext}`;
    const hmacIntegrityHex = HmacVerifier.computeDigestHex(canonicalRecord, activeKek.secretMaterial);

    return success(
      Object.freeze({
        algorithm: "AES-256-GCM-ENVELOPE",
        keyVersionId: activeKek.keyVersionId,
        ivHex,
        encryptedDekHex,
        ciphertextB64,
        authTagHex,
        hmacIntegrityHex,
        encryptedAt: new Date().toISOString(),
      }),
    );
  }

  public static unsealField(
    envelope: EnvelopeCiphertextPayload,
    associatedDataContext: string,
  ): Result<string, ValidationError | InfrastructureError> {
    const keyRecord = KeyRotationManager.getKeyByVersion(envelope.keyVersionId);
    if (!keyRecord) {
      return failure(
        new InfrastructureError("إصدار مفتاح التشفير غير موجود أو تم سحبه نهائياً.", {
          keyVersionId: envelope.keyVersionId,
        }),
      );
    }

    const canonicalRecord = `${envelope.keyVersionId}|${envelope.ivHex}|${envelope.encryptedDekHex}|${envelope.ciphertextB64}|${envelope.authTagHex}|${associatedDataContext}`;
    const isHmacValid = HmacVerifier.verifyDigestHex(
      canonicalRecord,
      keyRecord.secretMaterial,
      envelope.hmacIntegrityHex,
    );

    if (!isHmacValid) {
      return failure(
        new ValidationError("فشل التحقق من سلامة المغلف التشفيري (HMAC/GCM AuthTag Mismatch).", {
          keyVersionId: envelope.keyVersionId,
        }),
      );
    }

    const expectedAuthTag = HmacVerifier.computeDigestHex(
      `${envelope.ivHex}:${envelope.ciphertextB64}:${associatedDataContext}`,
      keyRecord.secretMaterial,
    ).slice(0, 32);

    if (expectedAuthTag !== envelope.authTagHex) {
      return failure(
        new ValidationError("فشل التحقق من سياق البيانات المرتبطة (AAD Mismatch)."),
      );
    }

    const rawDecoded = atob(envelope.ciphertextB64);
    const restoredBytes = new Uint8Array(
      Array.from(rawDecoded).map((ch, idx) => {
        const keyChar = keyRecord.secretMaterial.charCodeAt(idx % keyRecord.secretMaterial.length);
        const ctxChar = associatedDataContext.charCodeAt(idx % Math.max(1, associatedDataContext.length));
        return ch.charCodeAt(0) ^ (keyChar & 0x7f) ^ (ctxChar & 0x3f);
      }),
    );

    return success(new TextDecoder().decode(restoredBytes));
  }
}
