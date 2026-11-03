import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Play, 
  ArrowLeft, 
  Sparkles, 
  Users, 
  BookOpen, 
  Brain,
  CheckCircle2
} from "lucide-react";

const stats = [
  { value: "150+", label: "أداة متكاملة" },
  { value: "10K+", label: "طالب نشط" },
  { value: "500+", label: "معلم معتمد" },
  { value: "99.9%", label: "وقت التشغيل" },
];

const highlights = [
  "ذكاء اصطناعي متقدم",
  "واقع افتراضي ومعزز",
  "تحليلات بيانات فورية",
  "امتثال GDPR & WCAG 2.2",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse-slow animation-delay-200" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="container relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium mb-6 animate-float">
              <Sparkles className="h-4 w-4" />
              <span>الجيل الجديد من التعليم الرقمي</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              منصة{" "}
              <span className="gradient-text">BETC</span>
              <br />
              التعليمية الذكية
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 lg:mr-0">
              منصة تعليمية افتراضية ذكية متخصصة في مناهج BTEC تجمع بين الذكاء الاصطناعي المتقدم والواقع الافتراضي و150+ أداة متكاملة لتجربة تعلم استثنائية.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-8 max-w-lg mx-auto lg:mx-0 lg:mr-0">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild className="group shadow-lg hover:shadow-xl transition-all">
                <Link to="/learning-center">
                  دخول مركز التعلم الذكي
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="group">
                <Link to="/register">
                  <Play className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  ابدأ مجاناً
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main Card */}
              <div className="glass-card rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">المساعد الذكي ناو</h3>
                    <p className="text-sm text-muted-foreground">متاح 24/7 للمساعدة</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-accent/50 rounded-xl p-4">
                    <p className="text-sm">صباح الخير أحمد! 👋 لاحظت أنك أنجزت 70% من واجب الرياضيات. هل تريد مساعدة في سؤال الاشتقاق؟</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">فيديو شرح</Button>
                    <Button size="sm" variant="outline">ناقش مع زميل</Button>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-8 -right-8 glass-card rounded-xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-2/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2,847</p>
                    <p className="text-xs text-muted-foreground">طالب متصل الآن</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-8 glass-card rounded-xl p-4 shadow-xl animate-float animation-delay-400">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-1/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs text-muted-foreground">درس تفاعلي</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="glass-card rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
