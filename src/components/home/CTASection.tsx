import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

const benefits = [
  "تجربة مجانية لمدة 30 يوم",
  "لا حاجة لبطاقة ائتمان",
  "دعم فني على مدار الساعة",
  "ترحيل بياناتك مجاناً",
];

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-chart-2/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>ابدأ رحلتك اليوم</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            انضم إلى آلاف المتعلمين
            <br />
            <span className="gradient-text">وغيّر مستقبلك التعليمي</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            لا تفوت فرصة الانضمام إلى أكثر من 10,000 طالب و500 معلم يستخدمون منصة BETC لتحقيق التميز الأكاديمي
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="group shadow-lg hover:shadow-xl transition-all">
              <Link to="/register">
                ابدأ التجربة المجانية
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">تواصل مع فريق المبيعات</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
