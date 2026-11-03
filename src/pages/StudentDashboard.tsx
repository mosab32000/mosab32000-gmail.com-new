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
  Trophy,
  Bell,
  Settings,
  LogOut,
  Brain,
  Play,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  MessageSquare,
  Target,
  Flame,
  Star,
  ChevronLeft
} from "lucide-react";

const courses = [
  { id: 1, name: "الحسابات المتقدمة", progress: 75, grade: 92, nextLesson: "التكامل المحدود", color: "chart-1" },
  { id: 2, name: "الاقتصاد الجزئي", progress: 45, grade: 76, nextLesson: "العرض والطلب", color: "chart-2" },
  { id: 3, name: "فيزياء 2", progress: 60, grade: 88, nextLesson: "الكهرومغناطيسية", color: "chart-3" },
  { id: 4, name: "اللغة الإنجليزية", progress: 90, grade: 95, nextLesson: "مراجعة عامة", color: "chart-4" },
];

const upcomingTasks = [
  { id: 1, title: "واجب الرياضيات", course: "الحسابات المتقدمة", due: "غداً 11:59 م", urgent: true },
  { id: 2, title: "مشروع الاقتصاد", course: "الاقتصاد الجزئي", due: "بعد 3 أيام", urgent: false },
  { id: 3, title: "اختبار فيزياء", course: "فيزياء 2", due: "الأسبوع القادم", urgent: false },
];

const achievements = [
  { id: 1, title: "أفضل مشروع", icon: Trophy, unlocked: true },
  { id: 2, title: "100% حضور", icon: Star, unlocked: true },
  { id: 3, title: "7 أيام متتالية", icon: Flame, unlocked: true },
  { id: 4, title: "المتفوق", icon: Target, unlocked: false },
];

export default function StudentDashboard() {
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
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              أ
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">مرحباً، أحمد! 👋</h1>
            <p className="text-muted-foreground">لديك 2 واجبات قيد الانتظار و3 دروس جديدة</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
              <Flame className="h-5 w-5 text-chart-1" />
              <span className="font-bold">7</span>
              <span className="text-sm text-muted-foreground">أيام متتالية</span>
            </div>
            <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-chart-2" />
              <span className="font-bold">1,250</span>
              <span className="text-sm text-muted-foreground">نقطة</span>
            </div>
          </div>
        </div>

        {/* AI Assistant Card */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-l from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">مركز التعلم الذكي والمساعد التكيفي</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  مختبرات المحاكاة التفاعلية، ومعلم BTEC الذكي، ومحرك التقييم الفوري جاهزة لمساعدتك في استيفاء معايير الامتياز والجدارة.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" asChild className="bg-sky-600 hover:bg-sky-500 text-white">
                    <Link to="/learning-center">
                      <Brain className="ml-2 h-4 w-4" />
                      دخول مركز التعلم الذكي (BTEC Hub)
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/learning-center">
                      <Play className="ml-2 h-4 w-4" />
                      بدء معمل المحاكاة
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  مقرراتي
                </CardTitle>
                <CardDescription>تقدمك في المقررات الحالية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="glass-card rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `hsl(var(--${course.color}) / 0.1)` }}
                        >
                          <BookOpen 
                            className="h-5 w-5" 
                            style={{ color: `hsl(var(--${course.color}))` }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{course.name}</h4>
                          <p className="text-sm text-muted-foreground">التالي: {course.nextLesson}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-bold" style={{ color: `hsl(var(--${course.color}))` }}>
                          {course.grade}%
                        </p>
                        <p className="text-xs text-muted-foreground">الدرجة</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={course.progress} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground">{course.progress}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-chart-1/10 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-chart-1" />
                  </div>
                  <p className="text-2xl font-bold">85.3%</p>
                  <p className="text-sm text-muted-foreground">المعدل العام</p>
                  <Badge variant="secondary" className="mt-2">
                    <TrendingUp className="ml-1 h-3 w-3" />
                    +2.1%
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-chart-2" />
                  </div>
                  <p className="text-2xl font-bold">12.5</p>
                  <p className="text-sm text-muted-foreground">ساعات دراسة هذا الأسبوع</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-6 w-6 text-chart-3" />
                  </div>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">واجبات منجزة</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  المهام القادمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className={`mt-0.5 ${task.urgent ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {task.urgent ? <AlertCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.course}</p>
                      <p className={`text-xs mt-1 ${task.urgent ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {task.due}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" size="sm">
                  عرض جميع المهام
                  <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-chart-2" />
                  الإنجازات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`aspect-square rounded-xl flex items-center justify-center ${
                        achievement.unlocked 
                          ? 'bg-chart-2/10 text-chart-2' 
                          : 'bg-muted/50 text-muted-foreground'
                      }`}
                      title={achievement.title}
                    >
                      <achievement.icon className="h-6 w-6" />
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  3 من 4 إنجازات مفتوحة
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
