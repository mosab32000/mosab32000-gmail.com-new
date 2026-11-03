import { useAIChat } from "../model/useAIChat";
import { ChatMessage } from "./ChatMessage";
import { ChatComposer } from "./ChatComposer";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export function AIChat() {
  const { state, setGradeAndSubject, toggleConsentStatus, submitMessage } = useAIChat();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>JORDAN DATA RESIDENCY: JO-AMMAN-1</span>
            <span aria-hidden="true">·</span>
            <span>SCHOOL: {state.schoolId}</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            المعلم الذكي الموثق بالمناهج المعتمدة (Grounded Curriculum RAG Tutor)
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="المادة الدراسية"
            value={state.subjectCode}
            onChange={(e) =>
              setGradeAndSubject(
                state.gradeLevel,
                e.target.value as "IT-SYSTEMS" | "CYBER-SECURITY" | "STEM-PHYSICS",
              )
            }
            className="h-8 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
          >
            <option value="IT-SYSTEMS">أنظمة تكنولوجيا المعلومات (BTEC Unit 1)</option>
            <option value="CYBER-SECURITY">أمن الشبكات والتشفير (BTEC Unit 6)</option>
            <option value="STEM-PHYSICS">الفيزياء والعلوم التطبيقية (الصف العاشر)</option>
          </select>

          <button
            type="button"
            onClick={() => toggleConsentStatus(!state.consentVerified)}
            className={`h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors ${
              state.consentVerified
                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>
              {state.consentVerified ? "موافقة ولي الأمر: مفعّلة" : "موافقة ولي الأمر: موقوفة"}
            </span>
          </button>
        </div>
      </div>

      {state.errorBanner && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="font-mono">{state.errorBanner}</span>
        </div>
      )}

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {state.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <ChatComposer isSubmitting={state.isSubmitting} onSubmit={submitMessage} />
    </div>
  );
}
