import { useState } from "react";
import { BTEC_UNITS, BtecUnit } from "@/domain/learning/btec-units";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Award, 
  ChevronRight, 
  Cpu, 
  Network, 
  Database, 
  ShieldCheck, 
  FileText 
} from "lucide-react";

interface Props {
  onSelectUnitLab?: (labType: 'network' | 'hardware' | 'database') => void;
}

export function BtecCurriculumExplorer({ onSelectUnitLab }: Props) {
  const [selectedUnit, setSelectedUnit] = useState<BtecUnit>(BTEC_UNITS[0]);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-4 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-sky-600" />
            <span>الدليل المنهجي المعتمد لمؤهلات Pearson BTEC International Level 3</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>معايير دولية معتمدة</span>
            <span aria-hidden="true">·</span>
            <span>وحدات دراسية تخصصية</span>
            <span aria-hidden="true">·</span>
            <span>مصفوفات التعلم والتقييم</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>SPECIFICATION: BTEC IT 2026</span>
          <span>|</span>
          <span>LEVEL 3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Units List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-1">
            الوحدات الدراسية (Units)
          </span>

          <div className="space-y-2">
            {BTEC_UNITS.map((unit) => {
              const isSelected = unit.id === selectedUnit.id;
              return (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit)}
                  className={`w-full text-right p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-sky-500 shadow-sm ring-1 ring-sky-500'
                      : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                      {unit.code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                      {unit.glh} GLH
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                    {unit.titleAr}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {unit.descriptionAr}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Area: Selected Unit Deep Dive */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            {/* Unit Header Lockup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {selectedUnit.code}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Pearson BTEC International</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedUnit.titleAr}
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  {selectedUnit.titleEn}
                </p>
              </div>

              {onSelectUnitLab && (
                <Button
                  onClick={() => onSelectUnitLab(selectedUnit.labType)}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs shrink-0"
                >
                  {selectedUnit.labType === 'network' && <Network className="h-4 w-4 mr-1.5" />}
                  {selectedUnit.labType === 'hardware' && <Cpu className="h-4 w-4 mr-1.5" />}
                  {selectedUnit.labType === 'database' && <Database className="h-4 w-4 mr-1.5" />}
                  <span>فتح المعمل التفاعلي للوحدة</span>
                </Button>
              )}
            </div>

            {/* Description */}
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              {selectedUnit.descriptionAr}
            </div>

            {/* Learning Aims (Aims A, B, C) */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Layers className="h-4 w-4 text-sky-600" />
                <span>أهداف التعلم الرئيسية (Learning Aims)</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedUnit.learningAims.map((aim) => (
                  <div
                    key={aim.aimId}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs"
                  >
                    <span className="font-mono text-sky-700 dark:text-sky-400 font-bold block">
                      {aim.aimId}: {aim.title}
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                      {aim.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment & Grading Criteria Grid */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Award className="h-4 w-4 text-sky-600" />
                <span>مصفوفة معايير التقييم والاعتماد (Assessment Criteria Matrix)</span>
              </span>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-right">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-medium">
                    <tr>
                      <th className="py-2.5 px-3">المعيار</th>
                      <th className="py-2.5 px-3">المستوى</th>
                      <th className="py-2.5 px-3">الهدف</th>
                      <th className="py-2.5 px-3">الوصف الأكاديمي المطلوب</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedUnit.criteria.map((crit) => (
                      <tr key={crit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                          {crit.id}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                            crit.level === 'Distinction'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : crit.level === 'Merit'
                              ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {crit.level}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                          {crit.learningAim}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                          {crit.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
