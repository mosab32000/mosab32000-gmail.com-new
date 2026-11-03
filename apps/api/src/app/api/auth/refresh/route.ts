import { z } from "zod";
import { createPlatformExecutionContext } from "../../../../../../../packages/shared/src/application/execution-context";
import { generateUniqueId } from "../../../../../../../packages/shared/src/lib/id";
import { AuditSink } from "../../../../../../../packages/infrastructure/src/security/audit-sink";

const refreshSchema = z.object({
  refreshTokenId: z.string().min(6),
  schoolId: z.string().min(3),
  actorId: z.string().min(3),
  deviceFingerprint: z.string().min(4),
});

const rotatedTokens = new Set<string>();

export async function POST(rawBody: unknown) {
  const parsed = refreshSchema.safeParse(rawBody);
  if (!parsed.success) {
    return {
      status: 400,
      body: {
        errorCode: "VALIDATION_ERROR",
        message: "طلب تدوير رمز التحديث غير صالح.",
      },
    };
  }

  const data = parsed.data;
  const context = createPlatformExecutionContext({
    actorId: data.actorId,
    tenantId: data.schoolId,
    schoolId: data.schoolId,
    roles: ["student"],
  });

  if (rotatedTokens.has(data.refreshTokenId)) {
    AuditSink.publish(context, {
      action: "AUTH_REFRESH_REUSE_DETECTED",
      resourceType: "AUTH_SESSION",
      resourceId: data.refreshTokenId,
      outcome: "DENIED",
    });
    return {
      status: 401,
      body: {
        errorCode: "AUTHORIZATION_ERROR",
        message: "تم رصد إعادة استخدام رمز تحديث مدوّر مسبقاً؛ تم إبطال الجلسة أمنياً.",
      },
    };
  }

  rotatedTokens.add(data.refreshTokenId);
  const nextAccessTokenId = generateUniqueId("jwt-acc");
  const nextRefreshTokenId = generateUniqueId("jwt-ref");

  AuditSink.publish(context, {
    action: "AUTH_REFRESH_ROTATED",
    resourceType: "AUTH_SESSION",
    resourceId: nextRefreshTokenId,
    outcome: "ALLOWED",
  });

  return {
    status: 200,
    body: Object.freeze({
      accessTokenId: nextAccessTokenId,
      refreshTokenId: nextRefreshTokenId,
      traceId: context.traceId,
    }),
  };
}
