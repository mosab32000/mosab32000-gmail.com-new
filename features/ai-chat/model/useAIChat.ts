import { useState, useCallback } from "react";
import { AIChatSliceState, initialAIChatSliceState } from "./chatSlice";
import { AIChatRepository } from "../api/chatRepository";

export function useAIChat() {
  const [state, setState] = useState<AIChatSliceState>(initialAIChatSliceState);

  const setGradeAndSubject = useCallback(
    (
      gradeLevel: AIChatSliceState["gradeLevel"],
      subjectCode: AIChatSliceState["subjectCode"],
    ) => {
      setState((prev) => ({
        ...prev,
        gradeLevel,
        subjectCode,
        errorBanner: null,
      }));
    },
    [],
  );

  const toggleConsentStatus = useCallback((consentVerified: boolean) => {
    setState((prev) => ({
      ...prev,
      consentVerified,
      errorBanner: null,
    }));
  }, []);

  const submitMessage = useCallback(
    (messageText: string) => {
      setState((prev) => ({ ...prev, isSubmitting: true, errorBanner: null }));

      const result = AIChatRepository.sendGroundedMessage({
        conversationId: state.conversationId,
        schoolId: state.schoolId,
        gradeLevel: state.gradeLevel,
        subjectCode: state.subjectCode,
        message: messageText,
        consentVerified: state.consentVerified,
      });

      if (result.isFailure) {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          errorBanner: `${result.error.code}: ${result.error.message}`,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        errorBanner: null,
        messages: [...prev.messages, result.value.studentMessage, result.value.assistantMessage],
      }));
    },
    [state.conversationId, state.schoolId, state.gradeLevel, state.subjectCode, state.consentVerified],
  );

  return {
    state,
    setGradeAndSubject,
    toggleConsentStatus,
    submitMessage,
  };
}
