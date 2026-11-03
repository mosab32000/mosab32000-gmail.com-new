import { ChatMessageViewModel } from "../lib/mappers";
import { CitationPanel } from "./CitationPanel";
import { ShieldAlert, CheckCircle2, User, Bot } from "lucide-react";

interface ChatMessageProps {
  readonly message: ChatMessageViewModel;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isStudent = message.sender === "student";

  return (
    <div
      className={`p-4 rounded-xl border ${
        isStudent
          ? "bg-sky-50/50 dark:bg-sky-950/20 border-sky-200/70 dark:border-sky-900/60"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {isStudent ? (
            <User className="h-3.5 w-3.5 text-sky-600" />
          ) : (
            <Bot className="h-3.5 w-3.5 text-emerald-600" />
          )}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {isStudent ? "الطالب" : "المعلم الذكي الموثق (Grounded AI Tutor)"}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[11px]">{message.traceId}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
          {typeof message.piiRedactedCount === "number" && message.piiRedactedCount > 0 && (
            <>
              <span className="text-amber-600 dark:text-amber-400">
                تم تنقيح {message.piiRedactedCount} بيانات شخصية (PII)
              </span>
              <span aria-hidden="true">·</span>
            </>
          )}
          {typeof message.groundednessScore === "number" && (
            <>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>التجذير: {Math.round(message.groundednessScore * 100)}%</span>
              </span>
              <span aria-hidden="true">·</span>
            </>
          )}
          {message.teacherReviewRequired && (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
              <ShieldAlert className="h-3 w-3" />
              <span>يتطلب مراجعة المعلم</span>
            </span>
          )}
        </div>
      </div>

      <p className="mt-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
        {message.contentAr}
      </p>

      <CitationPanel citations={message.citations} />
    </div>
  );
}
