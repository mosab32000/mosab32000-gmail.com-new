import { z } from "zod";
import { createPlatformExecutionContext } from "../../../../../../../packages/shared/src/application/execution-context";
import { AuditSink } from "../../../../../../../packages/infrastructure/src/security/audit-sink";
import { generateUniqueId } from "../../../../../../../packages/shared/src/lib/id";

const lmsSyncSchema = z.object({
  schoolId: z.string().min(3),
  actorId: z.string().min(3),
  role: z.enum(["teacher", "admin"]),
  lmsProvider: z.enum(["MOE_EMIS_JORDAN", "PEARSON_BTEC_PORTAL", "MOODLE_LTI_1_3"]),
  syncScope: z.enum(["ROSTER_METADATA", "CURRICULUM_STANDARDS", "FORMATIVE_PROGRESS"]),
  idempotencyKey: z.string().min(6),
});

export async function POST(rawBody: unknown) {
  const parsed = lmsSyncSchema.safeParse(rawBody);
  if (!parsed.success) {
    return {
      status: 400,
      body: {
        errorCode: "VALIDATION_ERROR",
        message: "بيانات مزامنة نظام إدارة التعلم (LMS) غير صالحة.",
      },
    };
  }

  const data = parsed.data;
  const context = createPlatformExecutionContext({
    actorId: data.actorId,
    tenantId: data.schoolId,
    schoolId: data.schoolId,
    roles: [data.role],
    mfaVerified: true,
  });

  const syncJobId = generateUniqueId("lms-sync");
  AuditSink.publish(context, {
    action: "LMS_SYNC_INITIATED",
    resourceType: "LMS_INTEGRATION",
    resourceId: syncJobId,
    outcome: "ALLOWED",
    details: {
      lmsProvider: data.lmsProvider,
      syncScope: data.syncScope,
      idempotencyKey: data.idempotencyKey,
    },
  });

  return {
    status: 202,
    body: Object.freeze({
      syncJobId,
      status: "QUEUED_OUTBOX",
      lmsProvider: data.lmsProvider,
      syncScope: data.syncScope,
      traceId: context.traceId,
    }),
  };
}
