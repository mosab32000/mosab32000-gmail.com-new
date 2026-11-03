import {
  AuthorizedCurriculumCitation,
  GroundedGenerationOutput,
} from "../../../packages/infrastructure/src/ai/llm-adapter";
import { generateUniqueId } from "../../../packages/shared/src/lib/id";
import { SystemClock } from "../../../packages/shared/src/lib/clock";

export interface ChatMessageViewModel {
  readonly id: string;
  readonly sender: "student" | "assistant";
  readonly contentAr: string;
  readonly timestampIso: string;
  readonly traceId: string;
  readonly confidenceScore?: number;
  readonly groundednessScore?: number;
  readonly teacherReviewRequired?: boolean;
  readonly piiRedactedCount?: number;
  readonly citations: readonly AuthorizedCurriculumCitation[];
}

export function mapGroundedOutputToAssistantMessage(
  output: GroundedGenerationOutput,
  traceId: string,
): ChatMessageViewModel {
  return Object.freeze({
    id: generateUniqueId("msg"),
    sender: "assistant",
    contentAr: output.answerAr,
    timestampIso: SystemClock.nowIso(),
    traceId,
    confidenceScore: output.confidenceScore,
    groundednessScore: output.groundednessScore,
    teacherReviewRequired: output.teacherReviewRequired,
    piiRedactedCount: output.piiRedactedCount,
    citations: output.citations,
  });
}
