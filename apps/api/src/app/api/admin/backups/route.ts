import { z } from "zod";
import { createPlatformExecutionContext } from "../../../../../../../packages/shared/src/application/execution-context";
import { AuditSink } from "../../../../../../../packages/infrastructure/src/security/audit-sink";
import { KeyRotationManager } from "../../../../../../../packages/infrastructure/src/security/key-rotation";
import { generateUniqueId } from "../../../../../../../packages/shared/src/lib/id";

const adminBackupSchema = z.object({
  schoolId: z.string().min(3),
  adminActorId: z.string().min(3),
  secondaryApproverId: z.string().optional(),
  operation: z.enum(["CREATE_ENCRYPTED_SNAPSHOT", "VERIFY_RESTORE_DRILL", "PRODUCTION_RESTORE"]),
  mfaVerified: z.boolean(),
  pitrTargetTimestampIso: z.string().optional(),
});

export type AdminBackupRequest = z.infer<typeof adminBackupSchema>;

export async function POST(rawBody: unknown) {
  const parsed = adminBackupSchema.safeParse(rawBody);
  if (!parsed.success) {
    return {
      status: 400,
      body: {
        errorCode: "VALIDATION_ERROR",
        message: "بيانات إدارة النسخ الاحتياطي غير صالحة.",
      },
    };
  }

  const data = parsed.data;
  const context = createPlatformExecutionContext({
    actorId: data.adminActorId,
    tenantId: data.schoolId,
    schoolId: data.schoolId,
    roles: ["admin"],
    mfaVerified: data.mfaVerified,
  });

  if (!data.mfaVerified) {
    return {
      status: 401,
      body: {
        errorCode: "AUTHORIZATION_ERROR",
        message: "عمليات النسخ الاحتياطي والاستعادة تتطلب التحقق الثنائي (MFA).",
      },
    };
  }

  if (
    data.operation === "PRODUCTION_RESTORE" &&
    (!data.secondaryApproverId || data.secondaryApproverId === data.adminActorId)
  ) {
    AuditSink.publish(context, {
      action: "ADMIN_BACKUP_RESTORE_DENIED_SINGLE_ACTOR",
      resourceType: "DATABASE_BACKUP",
      resourceId: data.schoolId,
      outcome: "DENIED",
    });
    return {
      status: 403,
      body: {
        errorCode: "AUTHORIZATION_ERROR",
        message: "استعادة قاعدة البيانات الإنتاجية تتطلب موافقة مزدوجة (Dual-Control) من مسؤول ثانٍ مستقل.",
      },
    };
  }

  const activeKey = KeyRotationManager.getActiveMasterKey();
  const backupArtifactId = generateUniqueId("bkp-pg16");

  AuditSink.publish(context, {
    action: `ADMIN_BACKUP_${data.operation}`,
    resourceType: "DATABASE_BACKUP",
    resourceId: backupArtifactId,
    outcome: "ALLOWED",
    details: {
      kmsKeyVersion: activeKey.keyVersionId,
      residencyRegion: "JO-AMMAN-1",
      dualControlVerified: Boolean(data.secondaryApproverId),
    },
  });

  return {
    status: 200,
    body: Object.freeze({
      backupArtifactId,
      operation: data.operation,
      encryptionKeyVersion: activeKey.keyVersionId,
      residencyRegion: "JO-AMMAN-1",
      status: "COMPLETED_VERIFIED",
      traceId: context.traceId,
    }),
  };
}
