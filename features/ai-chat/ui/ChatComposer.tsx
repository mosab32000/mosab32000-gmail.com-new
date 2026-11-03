import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatComposerProps {
  readonly isSubmitting: boolean;
  readonly onSubmit: (message: string) => void;
}

const QUICK_PROMPTS = [
  "اشرح تكامل المعالج والذاكرة ECC RAM في خوادم المؤسسات حسب الوحدة 1",
  "كيف نحمي بيانات الطلاب عبر التشفير المغلف AES-256-GCM؟",
  "كم درجتي النهائية في الواجب؟ (اختبار بوابة منع التقييم الآلي النهائي)",
  "سؤالي مع رقم وطني 9981023456 وهاتف 0791234567 (اختبار تنقيح PII)",
];

export function ChatComposer({ isSubmitting, onSubmit }: ChatComposerProps) {
  const [text, setText] = useState("");

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) {
      return;
    }
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-wrap items-center gap-1.5">
        {QUICK_PROMPTS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setText(sample)}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-300 transition-colors"
          >
            {sample}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب سؤالك المنهجي هنا (يتم فحص حقن الأوامر وتنقيح البيانات الشخصية تلقائياً)..."
          className="flex-1 h-10 px-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <Button
          type="submit"
          disabled={isSubmitting || text.trim().length < 3}
          className="h-10 px-4 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium shrink-0"
        >
          <Send className="h-3.5 w-3.5 ml-1.5" />
          <span>إرسال موثق</span>
        </Button>
      </div>
    </form>
  );
}
