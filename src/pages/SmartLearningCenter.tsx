import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  ArrowRight, 
  Zap, 
  BrainCircuit, 
  Award, 
  BookOpen, 
  BarChart3, 
  Sparkles, 
  Layers, 
  User, 
  CheckCircle2, 
  ArrowLeft,
  ShieldCheck
} from "lucide-react";
import { InteractiveSimulationLab } from "@/components/learning/InteractiveSimulationLab";
import { MultiAgentTutorChat } from "@/components/learning/MultiAgentTutorChat";
import { RubricAssessmentEngine } from "@/components/learning/RubricAssessmentEngine";
import { BtecCurriculumExplorer } from "@/components/learning/BtecCurriculumExplorer";
import { LearningAnalyticsView } from "@/components/learning/LearningAnalyticsView";
import { ProductionReadinessCenter } from "@/components/learning/ProductionReadinessCenter";
import { JordanEduPlatformSuite } from "@/components/learning/JordanEduPlatformSuite";

export default function SmartLearningCenter() {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'tutor' | 'jordan-suite' | 'rubric' | 'curriculum' | 'analytics' | 'release-gate'>('jordan-suite');
  const [activeRole, setActiveRole] = useState<'student' | 'teacher' | 'admin'>('student');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Bar Contract: 3-Zone Clean Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                مركز التعلم الذكي
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                BTEC & JORDAN EDU AI PLATFORM
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setActiveTab('jordan-suite')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'jordan-suite' ? 'text-sky-600 dark:text-sky-400 font-bold' : ''
              }`}
            >
              منظومة التعليم الأردنية (v101)
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'sandbox' ? 'text-sky-600 dark:text-sky-400 font-bold' : ''
              }`}
            >
              المعمل والمحاكاة
            </button>
            <button
              onClick={() => setActiveTab('tutor')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'tutor' ? 'text-sky-600 dark:text-sky-400 font-bold' : ''
              }`}
            >
              المعلم الذكي
            </button>
            <button
              onClick={() => setActiveTab('rubric')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'rubric' ? 'text-sky-600 dark:text-sky-400 font-bold' : ''
              }`}
            >
              محرك التقييم المعياري
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'curriculum' ? 'text-sky-600 dark:text-sky-400 font-bold' : ''
              }`}
            >
              المنهج المعتمد
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'analytics' ? 'text-sky-600 dark:text-sky-400 font-bold' : ''
              }`}
            >
              تحليلات الإتقان
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick Return */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role indicator selector */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveRole('student')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeRole === 'student' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'
                }`}
              >
                طالب
              </button>
              <button
                onClick={() => setActiveRole('teacher')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeRole === 'teacher' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'
                }`}
              >
                معلم
              </button>
              <button
                onClick={() => setActiveRole('admin')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeRole === 'admin' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'
                }`}
              >
                إشراف
              </button>
            </div>

            <Link to="/students">
              <Button size="sm" variant="outline" className="text-xs h-8">
                <span>لوحة التحكم</span>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Strip with Technical Visual Backdrop */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white overflow-hidden">
        {/* Background visual asset generated */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/btec_it_systems_lab_1792058532224.jpg"
            alt="Data Center & Cloud Infrastructure"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                <span>JORDAN DATA RESIDENCY FIRST</span>
                <span aria-hidden="true">·</span>
                <span>PEARSON BTEC LEVEL 3 & MOE STANDARDS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                منظومة التعلم الذكي والمحاكاة التفاعلية
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-wrap balance">
                بيئة تعليمية هندسية مؤسسية تجمع بين المعلم الذكي المجذّر بالمناهج المعتمدة، التحليل البصري التكويني للواجبات، الخزنة التشفيرية المغلفة، ومعامل المحاكاة.
              </p>
            </div>

            {/* Quick Metrics Badge Strip */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-right min-w-[130px]">
                <span className="text-[11px] text-slate-400 block">إقامة البيانات</span>
                <span className="text-lg font-bold font-mono text-sky-400 tabular-nums">JO-AMMAN-1</span>
                <span className="text-[10px] text-slate-500 block">AES-256-GCM + RLS</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-right min-w-[130px]">
                <span className="text-[11px] text-slate-400 block">حوكمة التقييم</span>
                <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">● VERIFIED</span>
                <span className="text-[10px] text-slate-500 block">Teacher Gate Active</span>
              </div>
            </div>
          </div>

          {/* Clean Segmented Tab Switcher */}
          <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-slate-800 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('jordan-suite')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'jordan-suite'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>منظومة التعليم الأردنية (Jordan Edu AI v101)</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'sandbox'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>مختبر المحاكاة (Sandbox)</span>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'tutor'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BrainCircuit className="h-4 w-4" />
              <span>المعلم السقراطي (Socratic Tutor)</span>
            </button>

            <button
              onClick={() => setActiveTab('rubric')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'rubric'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>محرك التقييم المعياري (Rubric Grader)</span>
            </button>

            <button
              onClick={() => setActiveTab('curriculum')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'curriculum'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>المنهج ومعايير Pearson (Curriculum)</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>تحليلات الإتقان (Mastery Analytics)</span>
            </button>

            <button
              onClick={() => setActiveTab('release-gate')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'release-gate'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-emerald-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>بوابة الجاهزية والإنتاج (Release Gate)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Workspace */}
      <main className="container max-w-7xl mx-auto px-4 py-8 flex-1">
        {activeTab === 'jordan-suite' && <JordanEduPlatformSuite />}
        {activeTab === 'sandbox' && <InteractiveSimulationLab />}
        {activeTab === 'tutor' && <MultiAgentTutorChat />}
        {activeTab === 'rubric' && <RubricAssessmentEngine />}
        {activeTab === 'curriculum' && (
          <BtecCurriculumExplorer
            onSelectUnitLab={() => {
              setActiveTab('sandbox');
            }}
          />
        )}
        {activeTab === 'analytics' && <LearningAnalyticsView />}
        {activeTab === 'release-gate' && <ProductionReadinessCenter />}
      </main>

      {/* Quiet Professional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500">
        <div className="container max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span>مركز التعلم الذكي © 2026</span>
            <span aria-hidden="true">·</span>
            <span>PEARSON BTEC ACCREDITATION READY</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">عن المنصة</Link>
            <Link to="/pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">الاشتراكات</Link>
            <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">الدعم الفني</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
