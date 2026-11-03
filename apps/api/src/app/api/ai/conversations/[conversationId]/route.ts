import { z } from "zod";
import { initialAIChatSliceState } from "../../../../../../../../features/ai-chat/model/chatSlice";

const conversationParamsSchema = z.object({
  conversationId: z.string().min(3),
  schoolId: z.string().min(3),
  requestingSchoolId: z.string().min(3),
});

export async function GET(rawParams: unknown) {
  const parsed = conversationParamsSchema.safeParse(rawParams);
  if (!parsed.success) {
    return {
      status: 400,
      body: {
        errorCode: "VALIDATION_ERROR",
        message: "معرف المحادثة أو المدرسة غير صالح.",
      },
    };
  }

  const { conversationId, schoolId, requestingSchoolId } = parsed.data;
  if (schoolId !== requestingSchoolId) {
    return {
      status: 403,
      body: {
        errorCode: "AUTHORIZATION_ERROR",
        message: "محاولة وصول عابر للمدارس مرفوضة بواسطة سياسة عزل البيانات (RLS).",
      },
    };
  }

  return {
    status: 200,
    body: Object.freeze({
      conversationId,
      schoolId,
      residencyRegion: "JO-AMMAN-1",
      messages: initialAIChatSliceState.messages,
    }),
  };
}
