import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, Sparkles, Building2, Users, GraduationCap } from "lucide-react";

const plans = [
  {
    name: "الأساسي",
    description: "للطلاب والمتعلمين الأفراد",
    price: "مجاني",
    period: "",
    features: [
      { text: "الوصول لجميع الدروس الأساسية", included: true },
      { text: "المساعد الذكي الأساسي", included: true },
      { text: "5 اختبارات شهرياً", included: true },
      { text: "دعم عبر البريد الإلكتروني", included: true },
      { text: "محتوى VR/AR", included: false },
      { text: "تقارير متقدمة", included: false },
      { text: "تخصيص كامل", included: false },
    ],
    cta: "ابدأ مجاناً",
    popular: false,
    icon: GraduationCap,
  },
  {
    name: "المحترف",
    description: "للمعلمين والفرق الصغيرة",
    price: "99",
    period: "/ شهرياً",
    features: [
      { text: "جميع ميزات الخطة الأساسية", included: true },
      { text: "المساعد الذكي المتقدم (AI)", included: true },
      { text: "اختبارات غير محدودة", included: true },
      { text: "محتوى VR/AR كامل", included: true },
      { text: "تقارير وتحليلات متقدمة", included: true },
      { text: "دعم أولوية 24/7", included: true },
      { text: "تخصيص كامل", included: false },
    ],
    cta: "ابدأ التجربة المجانية",
    popular: true,
    icon: Users,
  },
  {
    name: "المؤسسات",
    description: "للمدارس والجامعات",
    price: "تواصل معنا",
    period: "",
    features: [
      { text: "جميع ميزات الخطة المحترفة", included: true },
      { text: "150+ أداة متكاملة", included: true },
      { text: "تكامل مع أنظمتكم الحالية", included: true },
      { text: "تخصيص كامل للعلامة التجارية", included: true },
      { text: "مدير حساب مخصص", included: true },
      { text: "تدريب الفريق", included: true },
      { text: "SLA 99.99%", included: true },
    ],
    cta: "تواصل مع فريق المبيعات",
    popular: false,
    icon: Building2,
  },
];

const faqs = [
  {
    question: "هل يمكنني تجربة المنصة قبل الاشتراك؟",
    answer: "نعم! نوفر تجربة مجانية لمدة 30 يوماً لجميع الخطط المدفوعة. لا حاجة لبطاقة ائتمان."
  },
  {
    question: "هل يمكنني الترقية أو التخفيض في أي وقت؟",
    answer: "بالطبع! يمكنك تغيير خطتك في أي وقت. سيتم احتساب الفرق بشكل تناسبي."
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نقبل جميع بطاقات الائتمان الرئيسية، PayPal، والتحويل البنكي للمؤسسات."
  },
  {
    question: "هل البيانات آمنة؟",
    answer: "نعم، نستخدم تشفير AES-256 ونلتزم بمعايير GDPR وFERPA وWCAG 2.2 AA."
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="ml-1 h-3 w-3" />
              أسعار شفافة
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              خطط تناسب{" "}
              <span className="gradient-text">احتياجاتك</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر الخطة المناسبة لك. جميع الخطط تتضمن تجربة مجانية لمدة 30 يوماً.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 -mt-8">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={plan.name} 
                  className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-lg">
                        الأكثر شيوعاً
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                      plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <plan.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-8 text-right">
                      {plan.features.map((feature) => (
                        <li key={feature.text} className="flex items-center gap-2">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-muted-foreground'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link to="/register">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-card/30">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              الأسئلة الشائعة
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <Card key={faq.question}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">هل لديك أسئلة؟</h2>
            <p className="text-muted-foreground mb-8">
              فريقنا جاهز لمساعدتك في اختيار الخطة المناسبة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">تواصل معنا</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/demo">شاهد العرض التوضيحي</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
