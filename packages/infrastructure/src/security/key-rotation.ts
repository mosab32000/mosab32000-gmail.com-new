export interface MasterKeyVersion {
  readonly keyVersionId: string;
  readonly status: "ACTIVE" | "DECRYPT_ONLY" | "REVOKED";
  readonly rotatedAt: string;
  readonly secretMaterial: string;
}

/**
 * KMS / Vault Key Rotation Manager supporting zero-downtime envelope re-keying.
 */
export class KeyRotationManager {
  private static keys: MasterKeyVersion[] = [
    {
      keyVersionId: "kms-jo-kek-v1",
      status: "DECRYPT_ONLY",
      rotatedAt: "2026-01-15T00:00:00.000Z",
      secretMaterial: "jo-residency-kek-v1-material-9981234",
    },
    {
      keyVersionId: "kms-jo-kek-v2",
      status: "ACTIVE",
      rotatedAt: "2026-10-01T00:00:00.000Z",
      secretMaterial: "jo-residency-kek-v2-material-7745198",
    },
  ];

  public static getActiveMasterKey(): MasterKeyVersion {
    const active = this.keys.find((k) => k.status === "ACTIVE");
    if (!active) {
      return this.keys[this.keys.length - 1];
    }
    return active;
  }

  public static getKeyByVersion(keyVersionId: string): MasterKeyVersion | undefined {
    const found = this.keys.find((k) => k.keyVersionId === keyVersionId);
    if (!found || found.status === "REVOKED") {
      return undefined;
    }
    return found;
  }

  public static rotateMasterKey(newVersionId: string): MasterKeyVersion {
    this.keys = this.keys.map((k) =>
      k.status === "ACTIVE" ? { ...k, status: "DECRYPT_ONLY" as const } : k,
    );
    const created: MasterKeyVersion = Object.freeze({
      keyVersionId: newVersionId,
      status: "ACTIVE",
      rotatedAt: new Date().toISOString(),
      secretMaterial: `jo-residency-${newVersionId}-${Date.now()}`,
    });
    this.keys.push(created);
    return created;
  }

  public static listKeyVersions(): readonly Omit<MasterKeyVersion, "secretMaterial">[] {
    return Object.freeze(
      this.keys.map(({ keyVersionId, status, rotatedAt }) => ({
        keyVersionId,
        status,
        rotatedAt,
      })),
    );
  }
}
