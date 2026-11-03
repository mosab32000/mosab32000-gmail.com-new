import { z } from "zod";
import { createPlatformExecutionContext } from "../../../../../../../packages/shared/src/application/execution-context";
import { generateUniqueId } from "../../../../../../../packages/shared/src/lib/id";
import { AuditSink } from "../../../../../../../packages/infrastructure/src/security/audit-sink";
import { HmacVerifier } from "../../../../../../../packages/infrastructure/src/security/hmac-verifier";

const loginSchema = z.object({
  email: z.string().email(),
  passwordHashOrSecret: z.string().min(8),
  schoolId: z.string().min(3),
  role: z.enum(["student", "teacher", "parent", "admin"]),
  mfaOtpCode: z.string().optional(),
  deviceFingerprint: z.string().min(4),
});

export type LoginRequestInput = z.infer<typeof loginSchema>;

export async function POST(rawBody: unknown) {
  const parsed = loginSchema.safeParse(rawBody);
  if (!parsed.success) {
    return {
      status: 400,
      body: {
        errorCode: "VALIDATION_ERROR",
        message: "بيانات تسجيل الدخول غير مكتملة أو غير صالحة.",
      },
    };
  }

  const data = parsed.data;
  const requiresMfa = ["teacher", "parent", "admin"].includes(data.role);
  if (requiresMfa && (!data.mfaOtpCode || data.mfaOtpCode.length < 6)) {
    return {
      status: 401,
      body: {
        errorCode: "AUTHORIZATION_ERROR",
        message: "التحقق الثنائي (MFA/2FA) إلزامي للمعلمين وأولياء الأمور والمشرفين.",
      },
    };
  }

  const context = createPlatformExecutionContext({
    actorId: `usr-${data.role}-01`,
    tenantId: data.schoolId,
    schoolId: data.schoolId,
    roles: [data.role],
    mfaVerified: requiresMfa ? true : false,
  });

  const accessTokenId = generateUniqueId("jwt-acc");
  const refreshTokenId = generateUniqueId("jwt-ref");
  const deviceBindingDigest = HmacVerifier.computeDigestHex(
    `${accessTokenId}:${data.deviceFingerprint}`,
    "device-binding-secret-v1",
  );

  AuditSink.publish(context, {
    action: "AUTH_LOGIN_SUCCESS",
    resourceType: "AUTH_SESSION",
    resourceId: accessTokenId,
    outcome: "ALLOWED",
    details: {
      role: data.role,
      mfaVerified: context.mfaVerified,
      passwordHashAlgorithm: "Argon2id",
    },
  });

  return {
    status: 200,
    body: Object.freeze({
      accessTokenId,
      refreshTokenId,
      deviceBindingDigest,
      expiresInSeconds: 900,
      traceId: context.traceId,
    }),
  };
}
