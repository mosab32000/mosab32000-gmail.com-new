import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AiLearningOrchestrator, TutorMessage } from "@/services/ai-learning-orchestrator";
import { BTEC_UNITS } from "@/domain/learning/btec-units";
import { 
  Bot, 
  Send, 
  Sparkles, 
  BrainCircuit, 
  Award, 
  Compass, 
  HelpCircle, 
  User, 
  RefreshCw 
} from "lucide-react";

export function MultiAgentTutorChat() {
  const [selectedAgent, setSelectedAgent] = useState<'socratic-coach' | 'rubric-assessor' | 'scenario-master'>('socratic-coach');
  const [selectedUnitId, setSelectedUnitId] = useState<string>("unit-1");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: "initial",
      sender: "tutor",
      agentType: "socratic-coach",
      contentAr: "مرحباً بك في مركز التعلم الذكي. أنا مرشدك السقراطي التفاعلي لمناهج BTEC الدولية. لن ألقنك الإجابة الجاهزة، بل سأقودك خطوة بخطوة لاستنتاج المفاهيم المعمارية وحل المعضلات الهندسية. بأي موضوع نستهل تدريبنا اليوم؟",
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      actionableFollowup: [
        "كيف أفرق بين وظيفة الـ Chipset ومسارات الـ CPU المباشرة؟",
        "ما هي شروط نيل تقدير Distinction في BTEC Unit 1؟",
        "اطرح علي سيناريو عطل في شبكة المستشفى"
      ]
    }
  ]);

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: TutorMessage = {
      id: `user-${Date.now()}`,
      sender: "student",
      agentType: selectedAgent,
      contentAr: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const tutorReply = AiLearningOrchestrator.generateTutorResponse(
        textToSend,
        selectedAgent,
        selectedUnitId
      );
      setMessages(prev => [...prev, tutorReply]);
      setIsTyping(false);
    }, 600);
  };

  const handleAgentChange = (newAgent: 'socratic-coach' | 'rubric-assessor' | 'scenario-master') => {
    setSelectedAgent(newAgent);
    const greetingMsg = AiLearningOrchestrator.generateTutorResponse(
      "مرحباً",
      newAgent,
      selectedUnitId
    );
    setMessages(prev => [...prev, greetingMsg]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[640px] overflow-hidden">
      {/* Top Header & Agent Selector */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>المعلم الذكي متعدد الوكلاء (Multi-Agent Pedagogical Suite)</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>توجيه تكيفي</span>
              <span aria-hidden="true">·</span>
              <span>دعم سقراطي</span>
              <span aria-hidden="true">·</span>
              <span>تقييم المعايير</span>
            </div>
          </div>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 whitespace-nowrap">الوحدة المنهجية:</label>
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            className="text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {BTEC_UNITS.map(unit => (
              <option key={unit.id} value={unit.id}>
                {unit.code} - {unit.titleAr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Agent Persona Switcher Bar */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">الوكيل النشط:</span>
        <button
          onClick={() => handleAgentChange('socratic-coach')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all shrink-0 ${
            selectedAgent === 'socratic-coach'
              ? 'bg-sky-600 text-white font-medium shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>المعلم السقراطي (Socratic Coach)</span>
        </button>

        <button
          onClick={() => handleAgentChange('rubric-assessor')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all shrink-0 ${
            selectedAgent === 'rubric-assessor'
              ? 'bg-sky-600 text-white font-medium shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>مقيّم معايير BTEC (Rubric Assessor)</span>
        </button>

        <button
          onClick={() => handleAgentChange('scenario-master')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all shrink-0 ${
            selectedAgent === 'scenario-master'
              ? 'bg-sky-600 text-white font-medium shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>مهندس السيناريوهات الواقعية (Scenario Master)</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-950/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === 'student' ? 'mr-auto flex-row-reverse' : 'ml-auto'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'student'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-sky-600 text-white'
              }`}
            >
              {msg.sender === 'student' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div className="space-y-2">
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'student'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-xs whitespace-pre-wrap'
                }`}
              >
                {msg.contentAr}
              </div>

              {/* Actionable Prompt Pills from Tutor */}
              {msg.actionableFollowup && msg.actionableFollowup.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium block">اقتراحات للمتابعة:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.actionableFollowup.map((tip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(tip)}
                        className="text-[11px] text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-lg px-2.5 py-1 text-right transition-colors"
                      >
                        {tip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <span className="text-[10px] text-slate-400 block font-mono">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <RefreshCw className="h-3 w-3 animate-spin text-sky-600" />
            <span>الوكيل يفكر ويسترجع سياق معايير BTEC...</span>
          </div>
        )}
      </div>

      {/* Input Box Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب استفسارك، أو مسألتك التقنية، أو فكرة تود مناقشتها..."
            className="flex-1 text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="bg-sky-600 hover:bg-sky-500 text-white font-medium shrink-0"
          >
            <Send className="h-4 w-4 ml-1" />
            <span>إرسال</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
