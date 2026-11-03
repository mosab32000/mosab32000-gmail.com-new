import { AuthorizedCurriculumCitation } from "../../../packages/infrastructure/src/ai/llm-adapter";
import { BookOpenCheck } from "lucide-react";

interface CitationPanelProps {
  readonly citations: readonly AuthorizedCurriculumCitation[];
}

export function CitationPanel({ citations }: CitationPanelProps) {
  if (citations.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <BookOpenCheck className="h-3.5 w-3.5 text-sky-600" />
        <span>المصادر والمعايير المرجعية الموثقة (Grounded Citations)</span>
      </div>
      <div className="space-y-2">
        {citations.map((citation) => (
          <div
            key={citation.citationId}
            className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1"
          >
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500">
              <span className="text-sky-600 dark:text-sky-400 font-semibold">
                {citation.standardCode}
              </span>
              <span aria-hidden="true">·</span>
              <span>{citation.gradeLevel}</span>
              <span aria-hidden="true">·</span>
              <span>{citation.licenseType}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                التطابق: {Math.round(citation.relevanceScore * 100)}%
              </span>
            </div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{citation.titleAr}</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {citation.excerptSummaryAr}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
