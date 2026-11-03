import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  BarChart3,
  PieChart,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Filter,
  RefreshCw,
  ChevronLeft,
  Target,
  Award,
  Clock,
  Shield
} from "lucide-react";

const institutionStats = {
  totalStudents: 2847,
  totalTeachers: 156,
  totalCourses: 48,
  activeNow: 1234,
  avgGrade: 82.5,
  successRate: 92,
  attendanceRate: 95,
  satisfaction: 4.2,
};

const departmentPerformance = [
  { name: "قسم الأعمال", students: 856, avgGrade: 85, successRate: 94, trend: "up" },
  { name: "قسم الحوسبة", students: 724, avgGrade: 88, successRate: 96, trend: "up" },
  { name: "قسم الهندسة", students: 612, avgGrade: 82, successRate: 91, trend: "stable" },
  { name: "قسم الاقتصاد", students: 655, avgGrade: 76, successRate: 87, trend: "down" },
];

const alerts = [
  { id: 1, type: "critical", title: "قسم الاقتصاد", message: "معدل النجاح أقل من 90%", action: "مراجعة مطلوبة" },
  { id: 2, type: "warning", title: "3 معلمين", message: "واجبات متأخرة أكثر من 5 أيام", action: "تنبيه" },
  { id: 3, type: "info", title: "تقرير شهري", message: "التقرير الشهري جاهز للمراجعة", action: "تحميل" },
];

const recentReports = [
  { id: 1, name: "تقرير الأداء الشهري - نوفمبر", date: "منذ يوم", type: "أداء" },
  { id: 2, name: "تحليل معدلات النجاح", date: "منذ 3 أيام", type: "تحليل" },
  { id: 3, name: "تقرير الحضور الأسبوعي", date: "منذ أسبوع", type: "حضور" },
];

const complianceStatus = [
  { name: "GDPR", status: "compliant", lastCheck: "اليوم" },
  { name: "WCAG 2.2 AA", status: "compliant", lastCheck: "أمس" },
  { name: "FERPA", status: "compliant", lastCheck: "منذ يومين" },
  { name: "نسخ احتياطية", status: "compliant", lastCheck: "منذ ساعة" },
];

export default function AdminDashboard() {
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
            <Badge variant="secondary" className="bg-chart-3/20 text-chart-3 border-chart-3/30">
              <Building2 className="ml-1 h-3 w-3" />
              لوحة الإدارة
            </Badge>
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
            <div className="w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center text-chart-3 font-bold">
              س
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">لوحة الإدارة الاستراتيجية</h1>
            <p className="text-muted-foreground">نظرة شاملة على أداء المؤسسة التعليمية</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <RefreshCw className="ml-2 h-4 w-4" />
              تحديث البيانات
            </Button>
            <Button>
              <Download className="ml-2 h-4 w-4" />
              تصدير التقرير
            </Button>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-chart-1/30 bg-gradient-to-br from-chart-1/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الطلاب</p>
                  <p className="text-3xl font-bold">{institutionStats.totalStudents.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-chart-1" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-chart-1 font-medium">{institutionStats.activeNow}</span>
                <span className="text-muted-foreground">متصل الآن</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-2/30 bg-gradient-to-br from-chart-2/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">معدل النجاح</p>
                  <p className="text-3xl font-bold">{institutionStats.successRate}%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-chart-2" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+2%</span>
                <span className="text-muted-foreground">من العام الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-3/30 bg-gradient-to-br from-chart-3/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متوسط الدرجات</p>
                  <p className="text-3xl font-bold">{institutionStats.avgGrade}%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-chart-3" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">الهدف: 85%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-4/30 bg-gradient-to-br from-chart-4/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">رضا الطلاب</p>
                  <p className="text-3xl font-bold">{institutionStats.satisfaction}/5</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-chart-4" />
                </div>
              </div>
              <Progress value={(institutionStats.satisfaction / 5) * 100} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="mb-8 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              التنبيهات والإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    alert.type === "critical" 
                      ? "bg-destructive/5 border-destructive/20" 
                      : alert.type === "warning"
                      ? "bg-chart-2/5 border-chart-2/20"
                      : "bg-chart-3/5 border-chart-3/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className={`h-5 w-5 ${
                      alert.type === "critical" ? "text-destructive" : 
                      alert.type === "warning" ? "text-chart-2" : "text-chart-3"
                    }`} />
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  <Button size="sm" variant={alert.type === "critical" ? "destructive" : "outline"}>
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Department Performance */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    أداء الأقسام
                  </CardTitle>
                  <CardDescription>مقارنة أداء الأقسام التعليمية</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="ml-2 h-4 w-4" />
                  فلترة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentPerformance.map((dept, index) => (
                    <div key={dept.name} className="glass-card rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `hsl(var(--chart-${index + 1}) / 0.1)` }}
                          >
                            <Building2 
                              className="h-5 w-5" 
                              style={{ color: `hsl(var(--chart-${index + 1}))` }}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{dept.name}</h4>
                            <p className="text-sm text-muted-foreground">{dept.students} طالب</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold">{dept.avgGrade}%</p>
                            <p className="text-xs text-muted-foreground">المتوسط</p>
                          </div>
                          <div className="text-center">
                            <p className={`text-lg font-bold ${
                              dept.successRate >= 90 ? "text-green-600" : 
                              dept.successRate >= 85 ? "text-chart-2" : "text-destructive"
                            }`}>
                              {dept.successRate}%
                            </p>
                            <p className="text-xs text-muted-foreground">النجاح</p>
                          </div>
                          {dept.trend === "up" && <TrendingUp className="h-5 w-5 text-green-600" />}
                          {dept.trend === "down" && <TrendingDown className="h-5 w-5 text-destructive" />}
                          {dept.trend === "stable" && <span className="text-muted-foreground">—</span>}
                        </div>
                      </div>
                      <Progress value={dept.successRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  حالة الامتثال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {complianceStatus.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.lastCheck}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-chart-2" />
                  التقارير الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.date}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" size="sm">
                  عرض جميع التقارير
                  <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المعلمون</span>
                  <span className="font-bold">{institutionStats.totalTeachers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المقررات</span>
                  <span className="font-bold">{institutionStats.totalCourses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">معدل الحضور</span>
                  <span className="font-bold text-green-600">{institutionStats.attendanceRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">استخدام المنصة</span>
                  <span className="font-bold">87%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
