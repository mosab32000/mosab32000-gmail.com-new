import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "أحمد محمد",
    role: "طالب - المستوى الثالث",
    content: "المساعد الذكي 'ناو' غيّر طريقة دراستي تماماً. أصبحت أفهم المفاهيم الصعبة بسهولة والتغذية الراجعة الفورية ساعدتني على تحسين درجاتي بنسبة 25%.",
    avatar: "أ",
    rating: 5,
  },
  {
    name: "فاطمة العلي",
    role: "معلمة رياضيات",
    content: "وفرت لي المنصة أكثر من 10 ساعات أسبوعياً كنت أقضيها في التصحيح والتحضير. الآن أركز على التدريس الفعلي والتفاعل مع طلابي.",
    avatar: "ف",
    rating: 5,
  },
  {
    name: "د. سعود الغامدي",
    role: "مدير مدرسة",
    content: "التحليلات التنبؤية ساعدتنا على اكتشاف الطلاب المتعثرين مبكراً وتقديم الدعم اللازم. انخفضت نسبة الرسوب بنسبة 40%.",
    avatar: "س",
    rating: 5,
  },
  {
    name: "نورة السالم",
    role: "ولية أمر",
    content: "أخيراً أستطيع متابعة تقدم ابني بشكل يومي. التقارير واضحة والإشعارات الفورية تجعلني على اطلاع دائم.",
    avatar: "ن",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-card/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ماذا يقول{" "}
            <span className="gradient-text">مستخدمونا</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            آلاف المستخدمين يعتمدون على منصة BETC لتحقيق أهدافهم التعليمية
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                <Quote className="h-8 w-8 text-primary/20" />
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-chart-2 text-chart-2" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
