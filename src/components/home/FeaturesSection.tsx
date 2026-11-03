import { 
  Brain, 
  Glasses, 
  BarChart3, 
  Shield, 
  Users, 
  Zap,
  BookOpen,
  MessageSquare,
  Target,
  Clock,
  Layers,
  Globe
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "ذكاء اصطناعي متقدم",
    description: "مساعد ذكي شخصي يتكيف مع نمط تعلمك ويقدم توصيات مخصصة باستخدام GPT-4 وClaude",
    color: "chart-1",
  },
  {
    icon: Glasses,
    title: "واقع افتراضي ومعزز",
    description: "تجارب غامرة ثلاثية الأبعاد للمحاكاة العملية والتفاعل مع المحتوى التعليمي",
    color: "chart-2",
  },
  {
    icon: BarChart3,
    title: "تحليلات متقدمة",
    description: "لوحات معلومات ذكية تتنبأ بالأداء وتكتشف الطلاب المعرضين للخطر مبكراً",
    color: "chart-3",
  },
  {
    icon: Shield,
    title: "أمان عالمي",
    description: "امتثال كامل لـ GDPR وFERPA وWCAG 2.2 AA مع تشفير AES-256",
    color: "chart-4",
  },
  {
    icon: Users,
    title: "تعاون فوري",
    description: "غرف عمل افتراضية وألواح بيضاء تفاعلية للعمل الجماعي في الوقت الفعلي",
    color: "chart-1",
  },
  {
    icon: Zap,
    title: "تقييم تكويني",
    description: "اختبارات دقيقة مع تغذية راجعة فورية وتحليل للأخطاء المتكررة",
    color: "chart-2",
  },
  {
    icon: BookOpen,
    title: "محتوى تكيفي",
    description: "مسارات تعلم شخصية تتكيف مع سرعتك ونمطك (بصري/سمعي/حركي)",
    color: "chart-3",
  },
  {
    icon: MessageSquare,
    title: "تواصل متعدد القنوات",
    description: "إشعارات ذكية عبر البريد والرسائل والتطبيق مع تنبيهات لأولياء الأمور",
    color: "chart-4",
  },
  {
    icon: Target,
    title: "أهداف تعلم واضحة",
    description: "تتبع التقدم نحو الأهداف مع شارات ومكافآت تحفيزية",
    color: "chart-1",
  },
  {
    icon: Clock,
    title: "توفير الوقت",
    description: "أتمتة التصحيح والتقارير توفر 70% من وقت المعلم الإداري",
    color: "chart-2",
  },
  {
    icon: Layers,
    title: "تكامل شامل",
    description: "150+ أداة متكاملة تعمل بتناغم كامل في منظومة واحدة",
    color: "chart-3",
  },
  {
    icon: Globe,
    title: "دعم متعدد اللغات",
    description: "واجهة عربية كاملة مع دعم 30+ لغة وترجمة فورية ذكية",
    color: "chart-4",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 bg-card/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            منظومة تعليمية{" "}
            <span className="gradient-text">متكاملة</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            أكثر من 150 أداة متخصصة تعمل معاً لتقديم تجربة تعلم استثنائية لجميع الأدوار التعليمية
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass-card rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div 
                className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                style={{ backgroundColor: `hsl(var(--${feature.color}) / 0.1)` }}
              >
                <feature.icon 
                  className="h-6 w-6" 
                  style={{ color: `hsl(var(--${feature.color}))` }}
                />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
