import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User,
  Eye, 
  EyeOff,
  ArrowLeft,
  Users,
  BookOpen,
  BarChart3,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

type AppRole = 'student' | 'teacher' | 'admin' | 'parent';

const userTypes: { id: AppRole; label: string; icon: React.ElementType; description: string }[] = [
  { id: "student", label: "طالب", icon: GraduationCap, description: "الوصول للدروس والواجبات" },
  { id: "teacher", label: "معلم", icon: BookOpen, description: "إدارة الفصول والتقييم" },
  { id: "parent", label: "ولي أمر", icon: Users, description: "متابعة أداء الأبناء" },
  { id: "admin", label: "مدير", icon: BarChart3, description: "إدارة المؤسسة التعليمية" },
];

const registerSchema = z.object({
  firstName: z.string().min(2, "الاسم الأول يجب أن يكون حرفين على الأقل"),
  lastName: z.string().min(2, "اسم العائلة يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

export default function Register() {
  const navigate = useNavigate();
  const { user, signUp, signInWithGoogle, loading: authLoading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student" as AppRole,
    agreeTerms: false,
  });

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      setErrors({ agreeTerms: "يرجى الموافقة على شروط الاستخدام" });
      return;
    }
    
    if (!validateForm()) return;
    
    setLoading(true);
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const { error } = await signUp(formData.email, formData.password, fullName, formData.userType);
    setLoading(false);
    
    if (!error) {
      navigate("/", { replace: true });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 rotate-180" />
            العودة للرئيسية
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
              <p className="text-sm text-muted-foreground">انضم إلى منصة BETC التعليمية</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-3">
              <Label>نوع الحساب</Label>
              <RadioGroup 
                value={formData.userType} 
                onValueChange={(value) => setFormData({...formData, userType: value as AppRole})}
                className="grid grid-cols-2 gap-3"
              >
                {userTypes.map((type) => (
                  <Label
                    key={type.id}
                    htmlFor={type.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.userType === type.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData.userType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <type.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="أحمد"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className={`pr-10 ${errors.firstName ? 'border-destructive' : ''}`}
                    required
                    disabled={loading}
                  />
                </div>
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">اسم العائلة</Label>
                <Input
                  id="lastName"
                  placeholder="محمد"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className={errors.lastName ? 'border-destructive' : ''}
                  required
                  disabled={loading}
                />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`pr-10 ${errors.email ? 'border-destructive' : ''}`}
                  required
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`pr-10 pl-10 ${errors.password ? 'border-destructive' : ''}`}
                  required
                  minLength={6}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              <p className="text-xs text-muted-foreground">يجب أن تحتوي على 6 أحرف على الأقل</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  required
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <Checkbox 
                id="terms" 
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => setFormData({...formData, agreeTerms: checked as boolean})}
                className="mt-1"
                disabled={loading}
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                أوافق على{" "}
                <Link to="/terms" className="text-primary hover:underline">شروط الاستخدام</Link>
                {" "}و{" "}
                <Link to="/privacy" className="text-primary hover:underline">سياسة الخصوصية</Link>
              </Label>
            </div>
            {errors.agreeTerms && <p className="text-sm text-destructive">{errors.agreeTerms}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                "إنشاء الحساب"
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">أو</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              التسجيل عبر Google
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>

      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-chart-2/10 p-12">
        <div className="max-w-lg text-center">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلة التعلم الآن</h2>
          <p className="text-muted-foreground text-lg mb-8">
            انضم إلى أكثر من 10,000 متعلم يستخدمون منصة BETC لتحقيق أهدافهم التعليمية
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-card/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-primary">150+</p>
              <p className="text-muted-foreground">أداة متكاملة</p>
            </div>
            <div className="bg-card/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-chart-2">24/7</p>
              <p className="text-muted-foreground">دعم مستمر</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
