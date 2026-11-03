import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap,
  BookOpen,
  Clock,
  Bell,
  Settings,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  MessageSquare,
  Video,
  PenTool,
  BarChart3,
  Brain,
  Sparkles,
  ChevronLeft,
  Plus,
  Upload,
  Edit
} from "lucide-react";

const courses = [
  { 
    id: 1, 
    name: "الحسابات المتقدمة", 
    students: 32, 
    avgGrade: 85, 
    pendingAssignments: 12,
    nextClass: "اليوم 10:00 ص",
    color: "chart-1" 
  },
  { 
    id: 2, 
    name: "الاقتصاد الجزئي", 
    students: 28, 
    avgGrade: 76, 
    pendingAssignments: 8,
    nextClass: "غداً 9:00 ص",
    color: "chart-2" 
  },
  { 
    id: 3, 
    name: "مبادئ الإدارة", 
    students: 35, 
    avgGrade: 88, 
    pendingAssignments: 5,
    nextClass: "الأربعاء 11:00 ص",
    color: "chart-3" 
  },
];

const atRiskStudents = [
  { id: 1, name: "محمد علي", course: "الاقتصاد الجزئي", issue: "غياب متكرر", risk: "high" },
  { id: 2, name: "سارة أحمد", course: "الحسابات المتقدمة", issue: "درجات منخفضة", risk: "medium" },
  { id: 3, name: "خالد عمر", course: "الاقتصاد الجزئي", issue: "واجبات متأخرة", risk: "medium" },
];

const recentActivities = [
  { id: 1, action: "رفع واجب", student: "أحمد محمد", course: "الحسابات", time: "منذ 5 دقائق" },
  { id: 2, action: "سؤال جديد", student: "نورة السالم", course: "الاقتصاد", time: "منذ 15 دقيقة" },
  { id: 3, action: "إكمال اختبار", student: "فهد الغامدي", course: "الإدارة", time: "منذ 30 دقيقة" },
  { id: 4, action: "طلب مساعدة", student: "ريم العتيبي", course: "الحسابات", time: "منذ ساعة" },
];

const upcomingClasses = [
  { id: 1, name: "الحسابات المتقدمة", time: "10:00 ص", students: 32, topic: "التكامل المحدود" },
  { id: 2, name: "الاقتصاد الجزئي", time: "2:00 م", students: 28, topic: "العرض والطلب" },
];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-bold text-lg">BETC</span>
            </Link>
            <Badge variant="secondary">لوحة المعلم</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
                5
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-chart-2/20 flex items-center justify-center text-chart-2 font-bold">
              ف
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">مرحباً، أ. فاطمة! 👋</h1>
            <p className="text-muted-foreground">لديك 3 فصول اليوم و25 واجباً في انتظار التصحيح</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Video className="ml-2 h-4 w-4" />
              بدء فصل مباشر
            </Button>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إنشاء درس جديد
            </Button>
          </div>
        </div>

        {/* AI Copilot Card */}
        <Card className="mb-8 border-chart-2/20 bg-gradient-to-l from-chart-2/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-chart-2" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Education Copilot</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  اكتشفت أن 5 طلاب في مقرر الاقتصاد يحتاجون دعماً إضافياً. هل تريد إنشاء خطة تدخل مخصصة؟
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary">
                    <Brain className="ml-2 h-4 w-4" />
                    إنشاء خطة تدخل
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="ml-2 h-4 w-4" />
                    توليد خطة درس
                  </Button>
                  <Button size="sm" variant="outline">
                    <PenTool className="ml-2 h-4 w-4" />
                    إنشاء اختبار سريع
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الطلاب</p>
                  <p className="text-3xl font-bold">95</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+5</span>
                <span className="text-muted-foreground">هذا الشهر</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">واجبات معلقة</p>
                  <p className="text-3xl font-bold">25</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-chart-2" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">أقدم واجب: 3 أيام</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متوسط الدرجات</p>
                  <p className="text-3xl font-bold">83%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-chart-3" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+2.3%</span>
                <span className="text-muted-foreground">من الأسبوع الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">طلاب معرضون للخطر</p>
                  <p className="text-3xl font-bold text-destructive">3</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                عرض التفاصيل
                <ChevronLeft className="mr-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Courses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    مقرراتي
                  </CardTitle>
                  <CardDescription>إدارة المقررات والفصول الدراسية</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة مقرر
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="glass-card rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `hsl(var(--${course.color}) / 0.1)` }}
                        >
                          <BookOpen 
                            className="h-6 w-6" 
                            style={{ color: `hsl(var(--${course.color}))` }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{course.name}</h4>
                          <p className="text-sm text-muted-foreground">{course.students} طالب • الفصل القادم: {course.nextClass}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-muted/30 rounded-lg p-2">
                        <p className="text-lg font-bold" style={{ color: `hsl(var(--${course.color}))` }}>
                          {course.avgGrade}%
                        </p>
                        <p className="text-xs text-muted-foreground">متوسط الدرجات</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2">
                        <p className="text-lg font-bold">{course.pendingAssignments}</p>
                        <p className="text-xs text-muted-foreground">واجبات معلقة</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2">
                        <p className="text-lg font-bold">{course.students}</p>
                        <p className="text-xs text-muted-foreground">طالب</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* At Risk Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  طلاب يحتاجون اهتماماً
                </CardTitle>
                <CardDescription>طلاب تم اكتشافهم بواسطة نظام التنبيهات الذكي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {atRiskStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold">
                        {student.name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.course} • {student.issue}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={student.risk === "high" ? "destructive" : "secondary"}>
                        {student.risk === "high" ? "خطر عالي" : "متوسط"}
                      </Badge>
                      <Button size="sm" variant="outline">تدخل</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  الفصول القادمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{cls.name}</p>
                      <Badge>{cls.time}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">الموضوع: {cls.topic}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{cls.students} طالب</span>
                      <Button size="sm">
                        <Video className="ml-2 h-4 w-4" />
                        بدء الفصل
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-chart-2" />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {activity.student[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.student}</span>
                        {" "}{activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.course} • {activity.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" size="sm">
                  عرض الكل
                  <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <Upload className="h-5 w-5 mb-1" />
                  <span className="text-xs">رفع واجب</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <PenTool className="h-5 w-5 mb-1" />
                  <span className="text-xs">اختبار سريع</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <MessageSquare className="h-5 w-5 mb-1" />
                  <span className="text-xs">رسالة جماعية</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <BarChart3 className="h-5 w-5 mb-1" />
                  <span className="text-xs">تقرير الأداء</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
