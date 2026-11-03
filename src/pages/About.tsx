import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Users, 
  Award, 
  Globe, 
  Shield, 
  Zap,
  GraduationCap,
  BookOpen,
  Brain,
  Lightbulb
} from "lucide-react";

const stats = [
  { value: "10,000+", label: "طالب نشط" },
  { value: "500+", label: "معلم معتمد" },
  { value: "150+", label: "أداة متكاملة" },
  { value: "99.9%", label: "وقت التشغيل" },
];

const values = [
  {
    icon: Target,
    title: "التركيز على الطالب",
    description: "كل قرار نتخذه يبدأ بسؤال: كيف سيستفيد الطالب؟ نضع نجاح المتعلم في صميم كل ما نفعله."
  },
  {
    icon: Lightbulb,
    title: "الابتكار المستمر",
    description: "نستخدم أحدث تقنيات الذكاء الاصطناعي والواقع الافتراضي لتقديم تجربة تعلم استثنائية."
  },
  {
    icon: Shield,
    title: "الأمان والخصوصية",
    description: "نلتزم بأعلى معايير الأمان العالمية لحماية بيانات مستخدمينا."
  },
  {
    icon: Users,
    title: "التعاون والمجتمع",
    description: "نؤمن بقوة التعلم الجماعي ونوفر أدوات تعاون متقدمة لربط المتعلمين."
  },
];

const milestones = [
  { year: "2020", title: "التأسيس", description: "بدأت الفكرة من حاجة حقيقية لمنصة تعليمية متكاملة" },
  { year: "2021", title: "الإطلاق التجريبي", description: "انضمام أول 1,000 طالب من 5 مدارس" },
  { year: "2022", title: "التوسع الإقليمي", description: "الوصول إلى 10 دول عربية مع دعم متعدد اللغات" },
  { year: "2023", title: "الذكاء الاصطناعي", description: "إطلاق المساعد الذكي 'ناو' مع قدرات GPT-4" },
  { year: "2024", title: "150+ أداة", description: "دمج أكثر من 150 أداة تعليمية متقدمة" },
  { year: "2025", title: "الجيل القادم", description: "إطلاق تجارب VR/AR غامرة للتعلم العملي" },
];

const team = [
  { name: "د. أحمد الفهد", role: "المؤسس والرئيس التنفيذي", avatar: "أ" },
  { name: "م. سارة العتيبي", role: "رئيس التكنولوجيا", avatar: "س" },
  { name: "أ. محمد القحطاني", role: "رئيس المنتجات", avatar: "م" },
  { name: "د. نورة السالم", role: "رئيس التعليم", avatar: "ن" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                <GraduationCap className="ml-1 h-3 w-3" />
                قصتنا
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                نبني مستقبل{" "}
                <span className="gradient-text">التعليم الرقمي</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                منصة BETC هي ثمرة شغف حقيقي بتحويل التعليم. نؤمن أن كل طالب يستحق 
                تجربة تعلم شخصية ومتكاملة تمكّنه من تحقيق إمكاناته الكاملة.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 -mt-8">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat) => (
                <Card key={stat.label} className="text-center">
                  <CardContent className="p-6">
                    <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">رسالتنا</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  تمكين المؤسسات التعليمية من تقديم تجربة تعلم استثنائية من خلال 
                  منظومة تقنية متكاملة تجمع بين الذكاء الاصطناعي، والواقع الافتراضي، 
                  وأدوات التعاون الحديثة.
                </p>
                <p className="text-lg text-muted-foreground">
                  نسعى لتحويل التعليم من نموذج تقليدي إلى تجربة شخصية وتفاعلية 
                  تتكيف مع احتياجات كل متعلم، وتوفر للمعلمين الأدوات اللازمة للتركيز 
                  على ما يهم: التعليم الفعلي.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {values.map((value) => (
                  <Card key={value.title} className="p-6">
                    <value.icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-card/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">رحلتنا</h2>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-border" />
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className="relative pr-12 pb-8 last:pb-0">
                    <div className="absolute right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="glass-card rounded-xl p-6">
                      <Badge variant="outline" className="mb-2">{milestone.year}</Badge>
                      <h3 className="font-semibold mb-1">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">فريق القيادة</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              فريق من الخبراء في التعليم والتكنولوجيا يعملون معاً لتحقيق رؤيتنا
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {team.map((member) => (
                <Card key={member.name} className="text-center p-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
