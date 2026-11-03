import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BTEC_UNITS, BtecRubricCriterion } from "@/domain/learning/btec-units";
import { AiLearningOrchestrator, EvaluationReport } from "@/services/ai-learning-orchestrator";
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle, 
  TrendingUp, 
  Layers 
} from "lucide-react";

export function RubricAssessmentEngine() {
  const [selectedUnitId, setSelectedUnitId] = useState<string>("unit-1");
  const [selectedCriterionId, setSelectedCriterionId] = useState<string>("M1");
  const [submissionText, setSubmissionText] = useState<string>(
    "في تصميم الخوادم المؤسسية، يُعتبر اختيار ناقل PCIe 5.0 خطوة حاسمة لمضاعفة النطاق الترددي إلى 32 GT/s لكل مسار، مما يرفع إجمالي إنتاجية شق x16 إلى 64 GB/s مقارنة بـ 32 GB/s في الجيل الرابع. هذا الفارق يلغي اختناق تدفق البيانات بين وحدات معالجة الرسوميات أو محولات الشبكة 100GbE والمعالج، ويقلل زمن تأخر المعالجة في قواعد البيانات الضخمة. بالمقابل، يتطلب PCIe 5.0 عناية فائقة بتبديد الحرارة وتصميم اللوحة الأم متعددة الطبقات لمنع التداخل الكهرومغناطيسي، مما يزيد تكلفة التأسيس."
  );

  const [evaluationResult, setEvaluationResult] = useState<EvaluationReport | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentUnit = BTEC_UNITS.find(u => u.id === selectedUnitId) || BTEC_UNITS[0];
  const currentCriterion = currentUnit.criteria.find(c => c.id === selectedCriterionId) || currentUnit.criteria[0];

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setErrorMessage(null);

    setTimeout(() => {
      const result = AiLearningOrchestrator.evaluateSubmission(
        selectedUnitId,
        selectedCriterionId,
        submissionText
      );

      if (result.isSuccess) {
        setEvaluationResult(result.value);
      } else {
        setErrorMessage(result.error.message);
      }
      setIsEvaluating(false);
    }, 700);
  };

  const loadExemplar = (type: 'basic' | 'merit' | 'distinction') => {
    if (type === 'basic') {
      setSelectedCriterionId("P1");
      setSubmissionText(
        "يتكون نظام الحاسوب من المعالج وهو العقل المدبر الذي يقوم بالعمليات الحسابية والمنطقية، والذاكرة العشوائية RAM التي تخزن البيانات مؤقتاً أثناء التشغيل، ومحركات الأقراص لتخزين الملفات بشكل دائم. كما تستخدم منافذ الإدخال والإخراج لربط الشاشات ولوحة المفاتيح والشبكة."
      );
    } else if (type === 'merit') {
      setSelectedCriterionId("M1");
      setSubmissionText(
        "في تصميم الخوادم المؤسسية، يُعتبر اختيار ناقل PCIe 5.0 خطوة حاسمة لمضاعفة النطاق الترددي إلى 32 GT/s لكل مسار، مما يرفع إجمالي إنتاجية شق x16 إلى 64 GB/s مقارنة بـ 32 GB/s في الجيل الرابع. هذا الفارق يلغي اختناق تدفق البيانات بين وحدات معالجة الرسوميات أو محولات الشبكة 100GbE والمعالج، ويقلل زمن تأخر المعالجة في قواعد البيانات الضخمة."
      );
    } else {
      setSelectedCriterionId("D1");
      setSubmissionText(
        "لتحقيق توافرية 99.99% في البنية التحتية لمصرف تجاري، تم اعتماد معمارية موزعة هجينة تجمع بين معالجات خوادم ذات 64 نواة مقترنة بذواكر DDR5 بتردد 5600MHz مع دعم ECC لمنع أخطاء البتات المفردة. تم ربط وسائط التخزين NVMe عبر مصفوفة RAID 10 لضمان مضاعفة سرعة القراءة والكتابة العشوائية (IOPS) مع التسامح مع تعطل قرصين متزامنين. ولدعم التوسع المستقبلي لـ 5 سنوات قادمة بمعدل نمو 30% سنوياً، تم تخصيص محولات شبكة 25GbE ثنائية المنافذ (Redundant LACP) تربط بين خوادم التطبيقات ومجمعات التخزين SAN عبر بروتوكول NVMe-oF، مما خفض زمن التأخر من 4.2ms إلى 0.4ms مع خفض كلفة الصيانة الإجمالية بنسبة 28% مقارنة بالبدائل السحابية العامة."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="h-4 w-4 text-sky-600" />
            <span>محرك التقييم المعياري الذكي (BTEC Rubric Assessment Engine)</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>تقييم فوري مبني على الأدلة</span>
            <span aria-hidden="true">·</span>
            <span>تصنيف Pass / Merit / Distinction</span>
            <span aria-hidden="true">·</span>
            <span>نصائح الارتقاء الأكاديمي</span>
          </div>
        </div>

        {/* Exemplar loader buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">نماذج استرشادية:</span>
          <button
            onClick={() => loadExemplar('basic')}
            className="px-2.5 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors"
          >
            نموذج نجاح (Pass)
          </button>
          <button
            onClick={() => loadExemplar('merit')}
            className="px-2.5 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors"
          >
            نموذج جدارة (Merit)
          </button>
          <button
            onClick={() => loadExemplar('distinction')}
            className="px-2.5 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors"
          >
            نموذج امتياز (Distinction)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input submission area & Criterion Selector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            {/* Unit & Criterion Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  الوحدة الدراسية:
                </label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => {
                    setSelectedUnitId(e.target.value);
                    const newUnit = BTEC_UNITS.find(u => u.id === e.target.value);
                    if (newUnit && newUnit.criteria.length > 0) {
                      setSelectedCriterionId(newUnit.criteria[0].id);
                    }
                  }}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {BTEC_UNITS.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.code} - {unit.titleAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  المعيار المستهدف للتقييم:
                </label>
                <select
                  value={selectedCriterionId}
                  onChange={(e) => setSelectedCriterionId(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {currentUnit.criteria.map(crit => (
                    <option key={crit.id} value={crit.id}>
                      {crit.id} ({crit.level}) - {crit.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Criterion Descriptor Card */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-700 dark:text-sky-300">
                  المعيار: {currentCriterion.id} — {currentCriterion.title}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {currentCriterion.learningAim}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentCriterion.description}
              </p>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="font-medium text-slate-600 dark:text-slate-400">الدليل المتوقع (Exemplar): </span>
                {currentCriterion.exemplarEvidence}
              </div>
            </div>

            {/* Student Submission Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>إجابة الطالب / مسودة التقرير الفني:</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {submissionText.length} حرف
                </span>
              </label>
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={7}
                placeholder="أدخل نص إجابتك أو تقريرك التقني هنا للتقييم..."
                className="w-full text-xs p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Evaluate Button */}
            <Button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isEvaluating ? "جاري مطابقة المعايير وتحليل الأدلة..." : "تقييم الإجابة وفق معايير BTEC"}
            </Button>
          </div>
        </div>

        {/* Right Column: Instant Evaluation Report Card */}
        <div className="lg:col-span-5 space-y-4">
          {evaluationResult ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 animate-in fade-in-50">
              {/* Outcome Badge & Score */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    evaluationResult.awardedLevel === 'Distinction'
                      ? 'bg-emerald-600 text-white'
                      : evaluationResult.awardedLevel === 'Merit'
                      ? 'bg-sky-600 text-white'
                      : evaluationResult.awardedLevel === 'Pass'
                      ? 'bg-amber-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {evaluationResult.awardedLevel.substring(0, 1)}
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">النتيجة المستحقة:</span>
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {evaluationResult.awardedLevel === 'Distinction' && 'امتياز (Distinction)'}
                      {evaluationResult.awardedLevel === 'Merit' && 'جدارة (Merit)'}
                      {evaluationResult.awardedLevel === 'Pass' && 'نجاح (Pass)'}
                      {evaluationResult.awardedLevel === 'Referral' && 'إعادة تسليم (Referral)'}
                    </span>
                  </div>
                </div>

                <div className="text-left font-mono">
                  <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {evaluationResult.score}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">ثقة التقييم {evaluationResult.confidenceScore}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <Progress value={evaluationResult.score} className="h-2" />

              {/* Feedback Summary */}
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                {evaluationResult.summaryFeedbackAr}
              </div>

              {/* Evidence Found List */}
              {evaluationResult.evidenceFound.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>الأدلة المستوفاة في الإجابة:</span>
                  </span>
                  <ul className="space-y-1 pr-5 list-disc text-slate-600 dark:text-slate-300">
                    {evaluationResult.evidenceFound.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Elements */}
              {evaluationResult.missingElements.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    <span>نقاط بحاجة للتعزيز والتوثيق:</span>
                  </span>
                  <ul className="space-y-1 pr-5 list-disc text-slate-600 dark:text-slate-300">
                    {evaluationResult.missingElements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Upgrade Tips */}
              {evaluationResult.upgradeTipsAr.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <span className="font-semibold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    <span>توصيات الارتقاء بالتقدير:</span>
                  </span>
                  <ul className="space-y-1 pr-5 list-disc text-slate-600 dark:text-slate-300">
                    {evaluationResult.upgradeTipsAr.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center flex flex-col items-center justify-center space-y-3 h-[420px]">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                تقرير التقييم في انتظار التحليل
              </h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                حدد الوحدة والمعيار المطلوب، واكتب مسودة إجابتك أو اختر أحد النماذج الاسترشادية بالأعلى للبدء في التحليل الفوري.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
