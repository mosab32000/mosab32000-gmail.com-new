import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  Users,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

const roles = [
  {
    icon: GraduationCap,
    title: "للطلاب",
    subtitle: "تعلم تفاعلي ومخصص",
    description: "مساعد ذكي شخصي، مسارات تعلم تكيفية، تجارب VR/AR غامرة، وتقييمات فورية",
    features: [
      "مساعد AI متاح 24/7",
      "محتوى يتكيف مع نمط تعلمك",
      "محاكاة ثلاثية الأبعاد تفاعلية",
      "تغذية راجعة فورية",
    ],
    href: "/students",
    color: "chart-1",
    stats: { tools: 35, users: "10K+" },
  },
  {
    icon: BookOpen,
    title: "للمعلمين",
    subtitle: "أدوات تدريس متقدمة",
    description: "تحضير آلي للدروس، تصحيح ذكي، تحليلات أداء الطلاب، وأدوات تفاعل حية",
    features: [
      "توليد خطط دروس بالذكاء الاصطناعي",
      "تصحيح آلي مع تعليقات مخصصة",
      "لوحة معلومات حية للفصل",
      "كشف مبكر للطلاب المتعثرين",
    ],
    href: "/teachers",
    color: "chart-2",
    stats: { tools: 40, users: "500+" },
  },
  {
    icon: BarChart3,
    title: "للإدارة",
    subtitle: "تحليلات وتقارير شاملة",
    description: "لوحات معلومات استراتيجية، تحليلات تنبؤية، إدارة الموارد، وتقارير امتثال",
    features: [
      "تحليلات بيانات متقدمة (Power BI)",
      "تقارير أداء المؤسسة",
      "إدارة الموارد والميزانية",
      "مراقبة الامتثال التنظيمي",
    ],
    href: "/admin",
    color: "chart-3",
    stats: { tools: 30, users: "100+" },
  },
  {
    icon: Users,
    title: "لأولياء الأمور",
    subtitle: "متابعة مستمرة",
    description: "تقارير أداء دورية، إشعارات فورية، تواصل مع المعلمين، ومتابعة الحضور",
    features: [
      "تقارير أسبوعية مفصلة",
      "إشعارات WhatsApp فورية",
      "تواصل مباشر مع المعلمين",
      "متابعة الحضور والسلوك",
    ],
    href: "/parents",
    color: "chart-4",
    stats: { tools: 20, users: "5K+" },
  },
];

export function RolesSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            تجربة مخصصة{" "}
            <span className="gradient-text">لكل دور</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            واجهات وأدوات مصممة خصيصاً لتلبية احتياجات كل مستخدم في المنظومة التعليمية
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role, index) => (
            <div
              key={role.title}
              className="group glass-card rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `hsl(var(--${role.color}) / 0.1)` }}
                  >
                    <role.icon 
                      className="h-7 w-7" 
                      style={{ color: `hsl(var(--${role.color}))` }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.subtitle}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold" style={{ color: `hsl(var(--${role.color}))` }}>
                    {role.stats.tools}
                  </p>
                  <p className="text-xs text-muted-foreground">أداة</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">
                {role.description}
              </p>

              <ul className="space-y-3 mb-6">
                {role.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 
                      className="h-4 w-4 flex-shrink-0" 
                      style={{ color: `hsl(var(--${role.color}))` }}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant="outline" 
                asChild 
                className="w-full group/btn"
              >
                <Link to={role.href}>
                  اكتشف المزيد
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
