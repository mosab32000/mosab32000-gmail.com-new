import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ShieldCheck, 
  FileCheck, 
  Download, 
  Target 
} from "lucide-react";

export function LearningAnalyticsView() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const competencies = [
    { name: "معمارية العتاد والنواقل (Hardware & PCIe)", score: 92, target: 90, status: "Distinction Level" },
    { name: "توجيه الشبكات وبروتوكول TCP/IP", score: 85, target: 80, status: "Distinction Level" },
    { name: "تطبيع قواعد البيانات 3NF و SQL", score: 78, target: 75, status: "Merit Level" },
    { name: "الجدران النارية وأمان النظم (Firewalls & Security)", score: 88, target: 85, status: "Distinction Level" },
    { name: "التشخيص وحل المشكلات (POST & Diagnostics)", score: 70, target: 70, status: "Pass Level" },
  ];

  const handleDownloadTranscript = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-sky-600" />
            <span>لوحة تحليلات الإتقان الأكاديمي والجاهزية المهنية (Mastery Analytics)</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>تتبع فوري لمخرجات التعلم</span>
            <span aria-hidden="true">·</span>
            <span>تحليل كمي للأداء</span>
            <span aria-hidden="true">·</span>
            <span>معدل اجتياز المعايير الدولية</span>
          </div>
        </div>

        <Button
          onClick={handleDownloadTranscript}
          variant="outline"
          size="sm"
          className="text-xs shrink-0"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          <span>{downloadSuccess ? "تم استخراج السجل بنجاح ✓" : "تصدير السجل الأكاديمي (PDF)"}</span>
        </Button>
      </div>

      {/* 4-KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500">إجمالي المعايير المجتازة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">18 / 22</span>
            <span className="text-[11px] text-emerald-600 font-medium">81.8%</span>
          </div>
          <span className="text-[10px] text-slate-400 block">7 Distinction · 8 Merit · 3 Pass</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500">ساعات المعمل التفاعلي</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">42.5</span>
            <span className="text-[11px] text-sky-600 font-medium">ساعة تطبيقية</span>
          </div>
          <span className="text-[10px] text-slate-400 block">34 تجربة محاكاة ناجحة</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500">معدل الدقة المعيارية</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">89.4%</span>
            <span className="text-[11px] text-emerald-600 font-medium">+4.2% هذا الشهر</span>
          </div>
          <span className="text-[10px] text-slate-400 block">ثقة استيفاء الأدلة الأكاديمية</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500">أيام الالتزام المستمر</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-500">14</span>
            <span className="text-[11px] text-amber-600 font-medium">أيام متتالية</span>
          </div>
          <span className="text-[10px] text-slate-400 block">شعلة النشاط الأكاديمي</span>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Competencies Breakdown */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="h-4 w-4 text-sky-600" />
              <span>مصفوفة الكفاءات التخصصية (Skill Competency Matrix)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">STANDARDS: BTEC QCF/RQF</span>
          </div>

          <div className="space-y-4">
            {competencies.map((comp) => (
              <div key={comp.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{comp.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">الهدف: {comp.target}%</span>
                    <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100">{comp.score}%</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-sans">
                      {comp.status}
                    </span>
                  </div>
                </div>
                <Progress value={comp.score} className="h-2" />
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                تقييم الجاهزية للاعتماد النهائي (Final Accreditation Readiness):
              </span>
              <p className="leading-relaxed text-[11px]">
                أكملت 85% من متطلبات ملف الأدلة (Portfolio of Evidence). يُوصى باستكمال معمل تشخيص أعطال POST لرفع درجة الوحدة 3 إلى مستوى الامتياز الكامل.
              </p>
            </div>
          </div>
        </div>

        {/* Milestone Badges & Accreditation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="h-4 w-4 text-sky-600" />
              <span>أوسمة الإنجاز المهني المعتمدة</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    خبير طوبولوجيا الشبكات (Network Architect)
                  </h4>
                  <p className="text-[11px] text-slate-500">اجتياز سيناريو عزل VLAN واختبارات ICMP</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    مهندس تطبيع 3NF (Database Master)
                  </h4>
                  <p className="text-[11px] text-slate-500">بناء نماذج خالية من شذوذ التعديل والحذف</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    محلل الأعطال العتادية (Hardware Diagnostics)
                  </h4>
                  <p className="text-[11px] text-slate-500">تتبع رموز POST وتوزيع ممرات PCIe 5.0</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block text-center font-mono">
                VERIFIED CREDENTIAL HASH: 8f92a1...b3e
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
