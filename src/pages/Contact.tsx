import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  Send,
  Clock,
  Headphones
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    value: "info@betc.edu",
    description: "الرد خلال 24 ساعة",
  },
  {
    icon: Phone,
    title: "الهاتف",
    value: "+966 50 000 0000",
    description: "الأحد - الخميس، 9ص - 6م",
  },
  {
    icon: MapPin,
    title: "العنوان",
    value: "الرياض، المملكة العربية السعودية",
    description: "حي العليا، برج المعرفة",
  },
];

const supportChannels = [
  {
    icon: Headphones,
    title: "الدعم الفني",
    description: "للمشاكل التقنية والاستفسارات",
    link: "support@betc.edu",
    available: "24/7",
  },
  {
    icon: MessageSquare,
    title: "المبيعات",
    description: "للاستفسار عن الخطط والأسعار",
    link: "sales@betc.edu",
    available: "أيام العمل",
  },
  {
    icon: Clock,
    title: "الشراكات",
    description: "للمؤسسات التعليمية والشركاء",
    link: "partnerships@betc.edu",
    available: "أيام العمل",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم إرسال رسالتك بنجاح!",
      description: "سنتواصل معك خلال 24 ساعة.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container text-center">
            <Badge variant="secondary" className="mb-4">
              <MessageSquare className="ml-1 h-3 w-3" />
              تواصل معنا
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              نحن هنا{" "}
              <span className="gradient-text">لمساعدتك</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              لديك سؤال أو استفسار؟ فريقنا جاهز للإجابة على جميع أسئلتك ومساعدتك في كل خطوة.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-12 -mt-8">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactInfo.map((info) => (
                <Card key={info.title}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{info.title}</h3>
                    <p className="text-primary font-medium">{info.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Form & Support */}
        <section className="py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Form */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل</Label>
                        <Input
                          id="name"
                          placeholder="أحمد محمد"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                        <Input
                          id="phone"
                          placeholder="+966 50 000 0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">الموضوع</Label>
                        <Input
                          id="subject"
                          placeholder="استفسار عن الخطط"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">الرسالة</Label>
                      <Textarea
                        id="message"
                        placeholder="اكتب رسالتك هنا..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      <Send className="ml-2 h-4 w-4" />
                      إرسال الرسالة
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Support Channels */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">قنوات الدعم</h2>
                <p className="text-muted-foreground">
                  اختر القناة المناسبة لاحتياجاتك للحصول على أسرع استجابة
                </p>
                <div className="space-y-4">
                  {supportChannels.map((channel) => (
                    <Card key={channel.title} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <channel.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold">{channel.title}</h3>
                              <Badge variant="outline">{channel.available}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {channel.description}
                            </p>
                            <a 
                              href={`mailto:${channel.link}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {channel.link}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Map placeholder */}
                <Card className="overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="font-semibold">الرياض، المملكة العربية السعودية</p>
                      <p className="text-sm text-muted-foreground">حي العليا، برج المعرفة</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
