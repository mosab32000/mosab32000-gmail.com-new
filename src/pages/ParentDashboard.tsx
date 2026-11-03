import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap,
  BookOpen,
  Bell,
  Settings,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  ChevronLeft,
  Star,
  Target,
  Award,
  Eye
} from "lucide-react";

const children = [
  {
    id: 1,
    name: "أحمد",
    grade: "المستوى الثالث",
    avatar: "أ",
    avgGrade: 85,
    attendance: 96,
    pendingAssignments: 2,
    trend: "up",
    courses: [
      { name: "الحسابات المتقدمة", grade: 92, teacher: "أ. فاطمة" },
      { name: "الاقتصاد الجزئي", grade: 76, teacher: "أ. سعود" },
      { name: "فيزياء 2", grade: 88, teacher: "أ. خالد" },
    ]
  },
  {
    id: 2,
    name: "سارة",
    grade: "المستوى الأول",
    avatar: "س",
    avgGrade: 91,
    attendance: 100,
    pendingAssignments: 0,
    trend: "up",
    courses: [
      { name: "الرياضيات الأساسية", grade: 95, teacher: "أ. مريم" },
      { name: "اللغة الإنجليزية", grade: 88, teacher: "أ. نورة" },
      { name: "الحوسبة", grade: 92, teacher: "أ. أحمد" },
    ]
  }
];

const recentNotifications = [
  { id: 1, type: "grade", message: "أحمد حصل على 95% في اختبار الرياضيات", time: "منذ ساعة", child: "أحمد" },
  { id: 2, type: "assignment", message: "سارة أنهت واجب اللغة الإنجليزية", time: "منذ 3 ساعات", child: "سارة" },
  { id: 3, type: "attendance", message: "تم تسجيل حضور أحمد لجميع الفصول اليوم", time: "منذ 5 ساعات", child: "أحمد" },
  { id: 4, type: "message", message: "رسالة جديدة من أ. فاطمة بخصوص أحمد", time: "أمس", child: "أحمد" },
];

const upcomingEvents = [
  { id: 1, title: "اجتماع أولياء الأمور", date: "15 ديسمبر", time: "4:00 م", type: "meeting" },
  { id: 2, title: "امتحان نهاية الفصل - أحمد", date: "20 ديسمبر", time: "9:00 ص", type: "exam" },
  { id: 3, title: "عرض مشروع - سارة", date: "22 ديسمبر", time: "11:00 ص", type: "project" },
];

const weeklyReport = {
  studyHours: 18.5,
  completedAssignments: 8,
  quizzesTaken: 3,
  avgQuizScore: 87,
  attendanceRate: 98,
};

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState(children[0]);

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
            <Badge variant="secondary" className="bg-chart-4/20 text-chart-4 border-chart-4/30">
              <Users className="ml-1 h-3 w-3" />
              ولي الأمر
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
                4
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-chart-4/20 flex items-center justify-center text-chart-4 font-bold">
              ن
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">مرحباً، نورة! 👋</h1>
            <p className="text-muted-foreground">متابعة أداء أبنائك التعليمي</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <MessageSquare className="ml-2 h-4 w-4" />
              التواصل مع المعلمين
            </Button>
            <Button>
              <FileText className="ml-2 h-4 w-4" />
              التقرير الأسبوعي
            </Button>
          </div>
        </div>

        {/* Children Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all min-w-fit ${
                selectedChild.id === child.id 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                selectedChild.id === child.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                {child.avatar}
              </div>
              <div className="text-right">
                <p className="font-semibold">{child.name}</p>
                <p className="text-sm text-muted-foreground">{child.grade}</p>
              </div>
              {child.trend === "up" && (
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              )}
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-chart-1/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">المعدل العام</p>
                  <p className="text-3xl font-bold">{selectedChild.avgGrade}%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+3%</span>
                <span className="text-muted-foreground">من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-2/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">نسبة الحضور</p>
                  <p className="text-3xl font-bold text-green-600">{selectedChild.attendance}%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-chart-2" />
                </div>
              </div>
              <Progress value={selectedChild.attendance} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="border-chart-3/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">واجبات معلقة</p>
                  <p className={`text-3xl font-bold ${selectedChild.pendingAssignments > 0 ? 'text-chart-2' : 'text-green-600'}`}>
                    {selectedChild.pendingAssignments}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-chart-3" />
                </div>
              </div>
              {selectedChild.pendingAssignments > 0 && (
                <p className="text-sm text-chart-2 mt-2">يرجى التذكير بإنهائها</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-chart-4/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ساعات الدراسة</p>
                  <p className="text-3xl font-bold">{weeklyReport.studyHours}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-chart-4" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">هذا الأسبوع</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Courses Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  أداء المقررات - {selectedChild.name}
                </CardTitle>
                <CardDescription>نتائج المقررات الدراسية الحالية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedChild.courses.map((course, index) => (
                  <div key={course.name} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `hsl(var(--chart-${index + 1}) / 0.1)` }}
                        >
                          <BookOpen 
                            className="h-5 w-5" 
                            style={{ color: `hsl(var(--chart-${index + 1}))` }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{course.name}</h4>
                          <p className="text-sm text-muted-foreground">المعلم: {course.teacher}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className={`text-2xl font-bold ${
                            course.grade >= 85 ? 'text-green-600' : 
                            course.grade >= 70 ? 'text-chart-2' : 'text-destructive'
                          }`}>
                            {course.grade}%
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={course.grade} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-chart-2" />
                  ملخص الأسبوع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-chart-1/5">
                    <p className="text-2xl font-bold text-chart-1">{weeklyReport.studyHours}</p>
                    <p className="text-sm text-muted-foreground">ساعة دراسة</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-chart-2/5">
                    <p className="text-2xl font-bold text-chart-2">{weeklyReport.completedAssignments}</p>
                    <p className="text-sm text-muted-foreground">واجب منجز</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-chart-3/5">
                    <p className="text-2xl font-bold text-chart-3">{weeklyReport.quizzesTaken}</p>
                    <p className="text-sm text-muted-foreground">اختبار</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-chart-4/5">
                    <p className="text-2xl font-bold text-chart-4">{weeklyReport.avgQuizScore}%</p>
                    <p className="text-sm text-muted-foreground">متوسط الاختبارات</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-primary" />
                  الإشعارات الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentNotifications.map((notif) => (
                  <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notif.type === "grade" ? "bg-chart-1/10 text-chart-1" :
                      notif.type === "assignment" ? "bg-chart-2/10 text-chart-2" :
                      notif.type === "attendance" ? "bg-chart-3/10 text-chart-3" :
                      "bg-chart-4/10 text-chart-4"
                    }`}>
                      {notif.type === "grade" && <Star className="h-4 w-4" />}
                      {notif.type === "assignment" && <CheckCircle2 className="h-4 w-4" />}
                      {notif.type === "attendance" && <Clock className="h-4 w-4" />}
                      {notif.type === "message" && <MessageSquare className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" size="sm">
                  عرض الكل
                  <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-chart-2" />
                  الأحداث القادمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {event.type === "meeting" ? "اجتماع" : 
                         event.type === "exam" ? "امتحان" : "مشروع"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {event.date} • {event.time}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Teachers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">التواصل السريع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="ml-2 h-4 w-4" />
                  إرسال بريد للمعلم
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="ml-2 h-4 w-4" />
                  محادثة فورية
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="ml-2 h-4 w-4" />
                  طلب اتصال هاتفي
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
