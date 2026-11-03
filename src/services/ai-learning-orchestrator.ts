import { BTEC_UNITS, BtecRubricCriterion } from "@/domain/learning/btec-units";
import { Result, success, failure } from "@/domain/shared/result";
import { EvaluationError } from "@/domain/shared/domain-error";

export interface EvaluationReport {
  unitId: string;
  criterionId: string;
  awardedLevel: 'Pass' | 'Merit' | 'Distinction' | 'Referral';
  score: number;
  confidenceScore: number;
  summaryFeedbackAr: string;
  evidenceFound: string[];
  missingElements: string[];
  upgradeTipsAr: string[];
  assessedAt: string;
}

export interface TutorMessage {
  id: string;
  sender: 'student' | 'tutor';
  agentType: 'socratic-coach' | 'rubric-assessor' | 'scenario-master';
  contentAr: string;
  timestamp: string;
  actionableFollowup?: string[];
}

export interface EnterpriseScenario {
  id: string;
  titleAr: string;
  organizationType: string;
  problemStatementAr: string;
  systemMetrics: {
    latencyMs: number;
    packetLossPct: number;
    cpuLoadPct: number;
    dbConnections: number;
  };
  requiredTasks: string[];
  targetUnitId: string;
}

export class AiLearningOrchestrator {
  /**
   * Evaluates student submission against BTEC criteria
   */
  public static evaluateSubmission(
    unitId: string,
    criterionId: string,
    submissionText: string
  ): Result<EvaluationReport, EvaluationError> {
    if (!submissionText || submissionText.trim().length < 20) {
      return failure(new EvaluationError("النص المقدم قصير جداً ولا يمكن تقييمه وفق المعايير الأكاديمية. يرجى تقديم إجابة تفصيلية لا تقل عن 20 حرفاً."));
    }

    const unit = BTEC_UNITS.find(u => u.id === unitId);
    if (!unit) {
      return failure(new EvaluationError(`الوحدة الدراسية بالمعرف ${unitId} غير موجودة.`));
    }

    const criterion = unit.criteria.find(c => c.id === criterionId) || unit.criteria[0];
    const textLower = submissionText.toLowerCase();

    // Heuristic multi-dimensional evaluation based on technical keywords & analytical depth
    const technicalKeywords = [
      "معالج", "ذاكرة", "chipset", "pcie", "nvme", "tcp", "ip", "router", "switch",
      "latency", "bandwidth", "vlan", "sql", "join", "index", "normalization",
      "تطبيع", "تكامل مرجعي", "أمان", "firewall", "جدار حماية", "raid", "توسع",
      "تكرار", "تخزين", "ddr5", "vrm", "post", "مبرر", "تحليل", "تقييم"
    ];

    const analyticalKeywords = [
      "بسبب", "لذلك", "مقارنة", "يؤدي إلى", "تأثير", "ميزة", "عيب", "مفاضلة",
      "بالمقابل", "تبرير", "تحسين", "كفاءة", "نتيجة", "إثبات", "على عكس"
    ];

    const techMatches = technicalKeywords.filter(k => textLower.includes(k)).length;
    const analyticalMatches = analyticalKeywords.filter(k => textLower.includes(k)).length;
    const lengthScore = Math.min(submissionText.length / 300, 1.0);

    let calculatedScore = Math.round((techMatches * 6) + (analyticalMatches * 8) + (lengthScore * 40));
    calculatedScore = Math.min(Math.max(calculatedScore, 42), 98);

    let level: 'Pass' | 'Merit' | 'Distinction' | 'Referral';
    let summary: string;
    const evidenceFound: string[] = [];
    const missingElements: string[] = [];
    const upgradeTips: string[] = [];

    if (calculatedScore >= 85) {
      level = 'Distinction';
      summary = `إنجاز استثنائي بمستوى الامتياز (Distinction). قدّمت تحليلاً نقدياً متعمقاً وربطت بين المكونات النظرية والتطبيقات الهندسية مع تبرير علمي وحسابات دقيقة للمفاضلات.`;
      evidenceFound.push("استخدام مصطلحات تخصصية دقيقة وموثوقة");
      evidenceFound.push("تقديم تحليل مقارن وتبرير هندسي شامل لخيارات التصميم");
      evidenceFound.push("استيفاء معايير التفكير النقدي والاستدلال المبني على الأدلة");
      upgradeTips.push("ممتاز جداً! يمكنك تعزيز هذا المشروع أكثر بإضافة خطة تعافي من الكوارث (DRP) مع حساب RTO و RPO.");
    } else if (calculatedScore >= 68) {
      level = 'Merit';
      summary = `إنجاز متقدم بمستوى الجدارة (Merit). استوفيت معايير الشرح والتحليل الفني بشكل سليم مع فهم واضح للعلاقات بين عناصر النظام.`;
      evidenceFound.push("شرح متسلسل لمكونات المعمارية ودور كل عنصر");
      evidenceFound.push("توضيح أثر خيارات التكوين على أداء المعالجة");
      missingElements.push("نقص في التبرير الكمي والمقارنات الرقمية الدقيقة");
      upgradeTips.push("للارتقاء إلى Distinction: أضف أرقاماً ومقاييس محددة (مثل سرعات النقل GB/s أو زمن التأخر ms).");
      upgradeTips.push("ناقش الحالات الحدية (Edge Cases) وتكلفة التوسع المستقبلي.");
    } else if (calculatedScore >= 50) {
      level = 'Pass';
      summary = `تم اجتياز المعيار بمستوى النجاح (Pass). قدمت الوصف الأساسي المطلوب، ولكن ينقص الإجابة التحليل المقارن والتعمق الهندسي.`;
      evidenceFound.push("تحديد المكونات والمفاهيم الأساسية بشكل صحيح");
      missingElements.push("غياب التحليل المقارن وأسباب اختيار الحل المعين");
      missingElements.push("عدم مناقشة المفاضلات الهندسية (Trade-offs)");
      upgradeTips.push("للارتقاء إلى Merit: اشرح 'لماذا' تم اختيار هذه المكونات وما تأثيرها على بيئة العمل الفعلية.");
      upgradeTips.push("ادعم إجابتك بأمثلة واقعية وسيناريوهات مؤسسية.");
    } else {
      level = 'Referral';
      summary = `الإجابة بحاجة لإعادة صياغة ودعم بالأدلة (Referral). الإجابة الحالية تفتقر للمفاهيم الأساسية للوحدة.`;
      missingElements.push("المصطلحات الفنية الضرورية غير مكتملة");
      missingElements.push("الشرح سطحي ولا يعكس مخرجات التعلم المطلوبة");
      upgradeTips.push("راجع المادة التعليمية للوحدة واطلع على مواصفات المعيار في المنهج.");
      upgradeTips.push("أعد كتابة الإجابة مع ذكر الوظائف التقنية بدقة.");
    }

    const report: EvaluationReport = {
      unitId,
      criterionId: criterion.id,
      awardedLevel: level,
      score: calculatedScore,
      confidenceScore: 94,
      summaryFeedbackAr: summary,
      evidenceFound,
      missingElements,
      upgradeTipsAr: upgradeTips,
      assessedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    return success(report);
  }

  /**
   * Generates a context-aware pedagogical response for the AI tutor
   */
  public static generateTutorResponse(
    userQuery: string,
    agentType: 'socratic-coach' | 'rubric-assessor' | 'scenario-master',
    currentUnitId: string
  ): TutorMessage {
    const unit = BTEC_UNITS.find(u => u.id === currentUnitId) || BTEC_UNITS[0];
    const query = userQuery.trim().toLowerCase();

    let reply = "";
    let followups: string[] = [];

    if (agentType === 'socratic-coach') {
      if (query.includes("ذاكرة") || query.includes("ram") || query.includes("ddr")) {
        reply = `سؤال ممتاز! في معمارية ${unit.titleAr}، ما الفرق الجوهري بين نطاق التردد (Frequency MHz) وزمن التأخير (CAS Latency)؟ فكّر في هذا: لو ضاعفنا سرعة الذاكرة من 3200MHz إلى 6400MHz لكن ارتفع زمن التأخير من CL16 إلى CL36، كيف سيتأثر أداء الخادم مع العمليات المتسلسلة مقارنة بالعمليات المتفرقة؟`;
        followups = [
          "كيف تحسب سرعة الاستجابة الحقيقية بالنانو ثانية؟",
          "ما دور قنوات Dual-Channel في مضاعفة عرض النطاق؟"
        ];
      } else if (query.includes("شبكة") || query.includes("راوتر") || query.includes("ip") || query.includes("vlan")) {
        reply = `أهلاً بك. عند تصميم شبكة مؤسسية في BTEC Unit 1، لماذا يُفضل عزل حركة بيانات الخوادم في VLAN مستقل عن أجهزة الموظفين؟ ما هي المخاطر الأمنية والأدائية التي نتفاداها عندما نقسم نطاق البث (Broadcast Domain)؟`;
        followups = [
          "ما الفرق بين توجيه Layer 2 و Layer 3؟",
          "كيف يؤثر جدار الحماية على زمن انتقال الحزم (RTT)؟"
        ];
      } else if (query.includes("قاعدة بيانات") || query.includes("sql") || query.includes("تطبيع")) {
        reply = `في إطار BTEC Unit 2، ما هي المشكلة التي تحدث في قاعدة البيانات إذا احتفظنا بعنوان العميل داخل جدول الفواتير مكرراً في كل عملية شراء؟ وما نوع الشذوذ (Anomaly) الذي قد يحدث عند تعديل عنوان هذا العميل؟`;
        followups = [
          "كيف نصل بالجدول إلى الشكل الطبيعي الثالث 3NF؟",
          "متى يكون استخدام Index ضاراً بالأداء بدلاً من تحسينه؟"
        ];
      } else {
        reply = `مرحباً بك في مركز التعلم الذكي. بصفتي مرشدك السقراطي في ${unit.code}: ${unit.titleAr}، أنا هنا لمساعدتك على بناء استدلال منطقي عميق. ما هو المفهوم أو المعيار الذي تود أن نبدأ بفحصه وتحليله معاً الآن؟`;
        followups = [
          "اشرح لي معيار التمييز D1 في هذه الوحدة",
          "كيف أربط بين المعمل العملي والتقييم النهائي؟"
        ];
      }
    } else if (agentType === 'rubric-assessor') {
      reply = `بصفتي مراجع معايير BTEC المعتمد: للحصول على تقدير الامتياز (Distinction) في ${unit.code}، لا تكتفِ بسرد الخصائص النظرية. المصحح الدولي يبحث عن ثلاثة أركان إجبارية:\n1. التبرير الهندسي (Justification): لماذا اخترت هذا الحل بالتحديد وليس بديلاً آخر؟\n2. التحليل الكمي (Quantitative Evidence): ذكر أرقام حقيقية ومقارنات في زمن الاستجابة والتكلفة.\n3. أثر التوسع (Scalability & Impact): كيف يتصرف النظام عند تضاعف الأحمال عشر مرات؟`;
      followups = [
        "افحص مسودة إجابتي لمعيار P1",
        "ما الفرق بين متطلبات Merit و Distinction في هذا السؤال؟"
      ];
    } else {
      // scenario-master
      reply = `🚨 سيناريو مؤسسي طارئ [شركة التقنية المالية - FinTech]:\nتعرض الخادم الرئيسي لقاعدة البيانات لتباطؤ حاد في أوقات الذروة، حيث ارتفع معدل استهلاك الذاكرة إلى 98% وتضاعف زمن تنفيذ استعلامات الفواتير 15 مرة.\n\nبصفتك مهندس نظم BTEC، ما هي الخطوات التشخيصية الثلاث الأولى التي ستتخذها لتحديد سبب الاختناق، وما الحل المقترح؟`;
      followups = [
        "فحص الاستعلامات البطيئة (Slow Query Log) والفهارس المفقودة",
        "فحص قنوات الذاكرة وتفعيل تقنية Swap & Caching",
        "توزيع الحمل عبر Read-Replica لقاعدة البيانات"
      ];
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'tutor',
      agentType,
      contentAr: reply,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      actionableFollowup: followups
    };
  }

  /**
   * Preloaded enterprise scenarios for simulation practice
   */
  public static getEnterpriseScenarios(): EnterpriseScenario[] {
    return [
      {
        id: "scen-1",
        titleAr: "هجوم حجب الخدمة واختناق جدار الحماية في مستشفى إقليمي",
        organizationType: "قطاع الرعاية الصحية",
        problemStatementAr: "تعاني بوابة المرضى من انقطاع متكرر وزيادة في نسبة فقدان الحزم (Packet Loss) إلى 42%. المطلوب إعادة ضبط قواعد الجدار الناري وعزل شبكة المعدات الطبية عبر VLAN مشفر.",
        systemMetrics: {
          latencyMs: 380,
          packetLossPct: 42,
          cpuLoadPct: 94,
          dbConnections: 850
        },
        requiredTasks: [
          "تطبيق قاعدة جدار الحماية لمنع حزم ICMP الفيضية",
          "فصل شبكة العيادات الخارجية إلى Subnet 192.168.20.0/24",
          "إجراء اختبار Ping للتأكد من انخفاض زمن التأخير إلى أقل من 30ms"
        ],
        targetUnitId: "unit-1"
      },
      {
        id: "scen-2",
        titleAr: "ترقية البنية العتادية لخادم التحليلات الضخمة",
        organizationType: "منصة تجارة إلكترونية سحابية",
        problemStatementAr: "أظهرت اختبارات POST اختناقاً حرارياً في دارات VRM وتأخراً في قراءة الأقراص بسبب مشاركة ممرات PCIe بين بطاقة الرسوميات وقرص M.2 NVMe.",
        systemMetrics: {
          latencyMs: 45,
          packetLossPct: 2,
          cpuLoadPct: 88,
          dbConnections: 1200
        },
        requiredTasks: [
          "فحص مخطط اللوحة الأم ونقل القرص إلى الممر المتصل مباشرة بالمعالج CPU x4",
          "ضبط تردد الذاكرة إلى ملف XMP 6000MHz المستقر",
          "التحقق من اجتياز اختبار POST دون رموز أخطاء حرارية"
        ],
        targetUnitId: "unit-3"
      },
      {
        id: "scen-3",
        titleAr: "تصميم قاعدة بيانات منصة التعلم التكيفي وإلغاء التكرار",
        organizationType: "أكاديمية تدريب مهني معتمدة",
        problemStatementAr: "تشتمل الجداول القديمة على تكرار بيانات المعلمين داخل كل تسجيل دورة مما تسبب في شذوذ التعديل (Update Anomaly) عند تغيير بيانات المدرب.",
        systemMetrics: {
          latencyMs: 120,
          packetLossPct: 0,
          cpuLoadPct: 62,
          dbConnections: 340
        },
        requiredTasks: [
          "فصل بيانات المعلمين إلى جدول مستقل مع مفتاح أساسي TeacherID",
          "إنشاء علاقة تكامل مرجعي Foreign Key مع جدول المقررات Courses",
          "كتابة استعلام JOIN مع Index للبحث بالاسم في زمن أقل من 5ms"
        ],
        targetUnitId: "unit-2"
      }
    ];
  }
}
