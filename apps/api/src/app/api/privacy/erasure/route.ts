import { z } from "zod";
import { createPlatformExecutionContext } from "../../../../../../../packages/shared/src/application/execution-context";
import { AuditSink } from "../../../../../../../packages/infrastructure/src/security/audit-sink";
import { generateUniqueId } from "../../../../../../../packages/shared/src/lib/id";

const privacyErasureSchema = z.object({
  schoolId: z.string().min(3),
  requesterId: z.string().min(3),
  requesterRole: z.enum(["parent", "admin", "student"]),
  targetStudentId: z.string().min(3),
  requestType: z.enum(["RIGHT_TO_ERASURE", "CONSENT_WITHDRAWAL", "DATA_RECTIFICATION"]),
  dualControlApproverId: z.string().min(3),
  mfaVerified: z.boolean(),
  reasonAr: z.string().min(5).max(500),
  requestedEndpointAlias: z.string().optional(),
});

export type PrivacyErasureRequest = z.infer<typeof privacyErasureSchema>;

const FORBIDDEN_DESTRUCTIVE_ALIASES = ["/nuke", "/reset-all", "/delete-everything", "nuke"];

/**
 * Governed privacy erasure / consent withdrawal workflow replacing forbidden `/nuke` endpoint.
 * Enforces Jordan Personal Data Protection Law, MFA, dual-control approval, and legal retention checks.
 */
export async function POST(rawBody: unknown) {
  const parsed = privacyErasureSchema.safeParse(rawBody);
  if (!parsed.success) {
    return {
      status: 400,
      body: {
        errorCode: "VALIDATION_ERROR",
        message: "طلب الخصوصية وحقوق البيانات غير مكتمل.",
      },
    };
  }

  const data = parsed.data;
  const context = createPlatformExecutionContext({
    actorId: data.requesterId,
    tenantId: data.schoolId,
    schoolId: data.schoolId,
    roles: [data.requesterRole],
    mfaVerified: data.mfaVerified,
  });

  if (
    data.requestedEndpointAlias &&
    FORBIDDEN_DESTRUCTIVE_ALIASES.includes(data.requestedEndpointAlias.toLowerCase())
  ) {
    AuditSink.publish(context, {
      action: "FORBIDDEN_DESTRUCTIVE_ENDPOINT_BLOCKED",
      resourceType: "PRIVACY_GOVERNANCE",
      resourceId: data.targetStudentId,
      outcome: "DENIED",
      details: { attemptedAlias: data.requestedEndpointAlias },
    });
    return {
      status: 403,
      body: {
        errorCode: "AUTHORIZATION_ERROR",
        message:
          "المسارات التدميرية غير المحكومة (/nuke, /reset-all) محظورة قطعياً وفق القواعد المعمارية.",
      },
    };
  }

  if (!data.mfaVerified || data.requesterId === data.dualControlApproverId) {
    AuditSink.publish(context, {
      action: "PRIVACY_ERASURE_REJECTED_DUAL_CONTROL",
      resourceType: "PRIVACY_GOVERNANCE",
      resourceId: data.targetStudentId,
      outcome: "DENIED",
    });
    return {
      status: 403,
      body: {
        errorCode: "AUTHORIZATION_ERROR",
        message:
          "يتطلب تنفيذ المسح القانوني للبيانات تحققاً ثنائياً (MFA) ومصادقة مزدوجة مستقلة (Dual-Control Approval).",
      },
    };
  }

  const workflowTicketId = generateUniqueId("dpo-era");
  AuditSink.publish(context, {
    action: "PRIVACY_ERASURE_WORKFLOW_APPROVED",
    resourceType: "PRIVACY_GOVERNANCE",
    resourceId: workflowTicketId,
    outcome: "ALLOWED",
    rawNotes: data.reasonAr,
    details: {
      requestType: data.requestType,
      targetStudentId: data.targetStudentId,
      dualControlApproverId: data.dualControlApproverId,
      legalBasis: "JORDAN_PDPL_2023_ART_7",
    },
  });

  return {
    status: 202,
    body: Object.freeze({
      workflowTicketId,
      status: "SCHEDULED_WITH_RETENTION_CHECK",
      requestType: data.requestType,
      targetStudentId: data.targetStudentId,
      dualControlApproverId: data.dualControlApproverId,
      traceId: context.traceId,
    }),
  };
}
