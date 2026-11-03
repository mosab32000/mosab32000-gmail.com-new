export interface BtecRubricCriterion {
  id: string; // e.g., 'P1', 'M1', 'D1'
  level: 'Pass' | 'Merit' | 'Distinction';
  title: string;
  description: string;
  learningAim: string;
  exemplarEvidence: string;
}

export interface BtecUnit {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  glh: number; // Guided Learning Hours
  level: number;
  category: 'Hardware & Infrastructure' | 'Software & Databases' | 'Cybersecurity' | 'Data & Cloud';
  descriptionAr: string;
  learningAims: {
    aimId: string;
    title: string;
    description: string;
  }[];
  criteria: BtecRubricCriterion[];
  labType: 'network' | 'hardware' | 'database';
}

export const BTEC_UNITS: BtecUnit[] = [
  {
    id: "unit-1",
    code: "Unit 1",
    titleAr: "أنظمة تقنية المعلومات والبنية التحتية",
    titleEn: "Information Technology Systems",
    glh: 120,
    level: 3,
    category: "Hardware & Infrastructure",
    descriptionAr: "دراسة شاملة للمكونات المادية والبرمجية، نقل البيانات عبر الشبكات، قضايا أمان النظم، وتأثير التكنولوجيا على الأفراد والمؤسسات وفق معايير Pearson BTEC.",
    learningAims: [
      {
        aimId: "Aim A",
        title: "العتاد والبرمجيات ومعمارية الحاسوب",
        description: "فهم وظائف المعالج (CPU)، الذاكرة، اللوحة الأم، وسائط التخزين، وبرمجيات النظام والتشغيل."
      },
      {
        aimId: "Aim B",
        title: "نقل البيانات والشبكات السلكية واللاسلكية",
        description: "تحليل طوبولوجيا الشبكات (Star, Mesh, Bus)، بروتوكولات TCP/IP، والتوجيه عبر الراوتر والمحولات."
      },
      {
        aimId: "Aim C",
        title: "الأمان وحماية النظم من التهديدات",
        description: "تقييم ثغرات النظم، الجدران النارية، التشفير، واستراتيجيات التعافي من الكوارث."
      }
    ],
    criteria: [
      {
        id: "P1",
        level: "Pass",
        title: "شرح خصائص ومكونات أنظمة الحاسوب",
        description: "اشرح وظائف المعالج ووحدات الإدخال والإخراج ووسائط التخزين الثانوية في معالجة البيانات المؤسسية.",
        learningAim: "Aim A",
        exemplarEvidence: "يحدد الطالب وظيفة المعالج والـ ALU ومسجلات الذاكرة مع دور الـ Chipset في نقل البيانات."
      },
      {
        id: "M1",
        level: "Merit",
        title: "تحليل أداء مكونات العتاد في تلبية متطلبات بيئة العمل",
        description: "حلل أثر سرعة الناقل (PCIe Gen5 vs Gen4) ونطاق تردد الذاكرة (DDR5 vs DDR4) على كفاءة معالجة البيانات.",
        learningAim: "Aim A",
        exemplarEvidence: "مقارنة كمية بين سرعات النواقل وتأثيرها على زمن تأخر المعالجة في خوادم قواعد البيانات."
      },
      {
        id: "D1",
        level: "Distinction",
        title: "تقييم شامل وتبرير هندسي لبنية نظام حوسبة متكامل",
        description: "قدّم تبريراً هندسياً دقيقاً ومفصلاً لاختيار معمارية عتادية وشبكية لمؤسسة متنامية مع مراعاة التوسع والاعتمادية وموازنة التكلفة.",
        learningAim: "Aim A & B",
        exemplarEvidence: "تقديم دراسة جدوى فنية تشمل حسابات Bandwidth وتوافرية 99.99% واختيار مصفوفة RAID المناسبة."
      },
      {
        id: "P2",
        level: "Pass",
        title: "شرح بروتوكولات وطوبولوجيا الشبكات",
        description: "اشرح نموذج TCP/IP وطبقاته وكيفية انتقال حزم البيانات من المصدر إلى الوجهة عبر الشبكة المحلية.",
        learningAim: "Aim B",
        exemplarEvidence: "تحديد الفرق بين IPv4 و IPv6 ودور المحول (Switch) والراوتر (Router) في توجيه الحزم."
      },
      {
        id: "M2",
        level: "Merit",
        title: "تحليل كفاءة البروتوكولات واختناقات الحزم",
        description: "حلل أثر تكوين الشبكات الفرعية (Subnetting) وجدار الحماية على أمان وسرعة تبادل البيانات.",
        learningAim: "Aim B",
        exemplarEvidence: "قياس زمن الرحلة الذهاب والإياب (RTT) ونسبة فقد الحزم (Packet Loss) مع قواعد جدار الحماية."
      }
    ],
    labType: "network"
  },
  {
    id: "unit-2",
    code: "Unit 2",
    titleAr: "بناء وتطوير نظم إدارة المعلومات وقواعد البيانات",
    titleEn: "Creating Systems to Manage Information",
    glh: 90,
    level: 3,
    category: "Software & Databases",
    descriptionAr: "تصميم وبناء قواعد البيانات العلائقية (Relational Databases)، تطبيق التطبيع (Normalization 1NF-3NF)، وكتابة استعلامات SQL متقدمة لحل مشكلات الأعمال.",
    learningAims: [
      {
        aimId: "Aim A",
        title: "تحليل وتصميم النماذج المفاهيمية وقواعد البيانات",
        description: "تحديد الكيانات، السمات، المفاتيح الأساسية والأجنبية، ورسم مخططات ERD."
      },
      {
        aimId: "Aim B",
        title: "التطبيع وتحسين بنية الجداول (Normalization)",
        description: "إزالة التكرار وضمان التكامل المرجعي من الشكل الطبيعي الأول إلى الثالث."
      },
      {
        aimId: "Aim C",
        title: "تنفيذ الاستعلامات ومعالجة البيانات بلغة SQL",
        description: "كتابة استعلامات الربط (JOINs)، التجميع (GROUP BY)، وتطبيق الفهارس (Indexes)."
      }
    ],
    criteria: [
      {
        id: "P1",
        level: "Pass",
        title: "تصميم مخطط قاعدة بيانات متوافق مع متطلبات النظام",
        description: "صمم مخطط قاعدة بيانات علائقية يشتمل على المفاتيح الأساسية والعلاقات الصحيحة (1:M).",
        learningAim: "Aim A",
        exemplarEvidence: "مخطط ERD صحيح مع تعريف الجداول والمفاتيح الأساسية والروابط المرجعية."
      },
      {
        id: "M1",
        level: "Merit",
        title: "تطبيق قواعد التطبيع وتحسين الأداء",
        description: "طبّق التطبيع إلى 3NF واشرح كيف تمنع هذه البنية شذوذ الإدخال والتعديل والحذف.",
        learningAim: "Aim B",
        exemplarEvidence: "إثبات عدم وجود تبعيات جزئية أو متعدية مع توثيق كل مرحلة تطبيع."
      },
      {
        id: "D1",
        level: "Distinction",
        title: "تقييم واختبار كفاءة الاستعلامات وتكامل البيانات تحت أحمال مرتفعة",
        description: "أجرِ تقييماً نقدياً لاستعلامات SQL المكتوبة، واشرح أثر الفهارس وخطة التنفيذ (Explain Plan) على زمن الاستجابة.",
        learningAim: "Aim C",
        exemplarEvidence: "مقارنة خطة التنفيذ مع وبدون Index مع تحليل استهلاك الموارد وحماية المعاملات بـ ACID."
      }
    ],
    labType: "database"
  },
  {
    id: "unit-3",
    code: "Unit 3",
    titleAr: "هندسة العتاد ومعمارية اللوحة الأم",
    titleEn: "Hardware Systems Architecture & Diagnostics",
    glh: 90,
    level: 3,
    category: "Hardware & Infrastructure",
    descriptionAr: "فحص وتشخيص اللوحات الأم، توزيع خطوط الطاقة VRM، ناقل PCIe 5.0، منافذ M.2 NVMe، وسرعات نقل البيانات بين المعالج والشرائح الإلكترونية.",
    learningAims: [
      {
        aimId: "Aim A",
        title: "المكونات الدقيقة للوحة الأم وتدفق الإشارات",
        description: "فحص مسارات DMI 4.0، مصفوفات المكثفات، ومقابس المعالجات الحديثة."
      },
      {
        aimId: "Aim B",
        title: "اختبارات الإقلاع وتشخيص الأخطاء (POST Diagnostics)",
        description: "تتبع رموز التشخيص الثنائي وأعطال الذاكرة واختناقات درجات الحرارة."
      }
    ],
    criteria: [
      {
        id: "P1",
        level: "Pass",
        title: "تحديد مكونات ومنافذ اللوحة الأم ووظيفة كل منها",
        description: "حدد وظيفة مقبس المعالج، قنوات الذاكرة DDR5، وشريحة الإدارة Chipset.",
        learningAim: "Aim A",
        exemplarEvidence: "تعريف موقع ومهمة المكونات الأساسية على المخطط التخطيطي."
      },
      {
        id: "M1",
        level: "Merit",
        title: "تحليل مسارات نقل البيانات وسرعة المعالجة بين المكونات",
        description: "قارن بين خطوط الاتصال المباشرة بالمعالج (CPU Lanes) وتلك الموجهة عبر الـ Chipset.",
        learningAim: "Aim A",
        exemplarEvidence: "حساب سرعات النقل الناتجة وتحديد أي منافذ M.2 تتشارك المسارات مع شقوق PCIe."
      },
      {
        id: "D1",
        level: "Distinction",
        title: "استكشاف وتشخيص الأعطال المعقدة وتصميم خطة ترقية مثالية",
        description: "حلل تقرير اختبار POST واقترح الحل الهندسي لتفادي ارتفاع حرارة VRM وخنق الأداء الحراري.",
        learningAim: "Aim B",
        exemplarEvidence: "تشخيص رمز الخطأ بدقة مع تقديم خطة تبريد وإدارة طاقة متوازنة علمياً."
      }
    ],
    labType: "hardware"
  }
];
