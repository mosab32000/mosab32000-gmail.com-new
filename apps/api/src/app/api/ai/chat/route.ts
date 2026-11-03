import { AIChatRepository } from "../../../../../../../features/ai-chat/api/chatRepository";
import { ValidatedAIChatRequest } from "../../../../../../../features/ai-chat/lib/validation";

export async function POST(rawBody: ValidatedAIChatRequest) {
  const result = AIChatRepository.sendGroundedMessage(rawBody);
  if (result.isFailure) {
    const status = result.error.code === "AUTHORIZATION_ERROR" ? 403 : 400;
    return {
      status,
      body: {
        errorCode: result.error.code,
        message: result.error.message,
      },
    };
  }

  return {
    status: 200,
    body: result.value,
  };
}
