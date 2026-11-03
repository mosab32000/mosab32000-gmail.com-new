
-- ==========================================
-- القسم الأول: أنواع البيانات (Enums)
-- ==========================================

-- نوع الدور في النظام
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin', 'parent');

-- حالة المقرر
CREATE TYPE public.course_status AS ENUM ('active', 'archived', 'draft');

-- حالة الواجب
CREATE TYPE public.assignment_status AS ENUM ('draft', 'published', 'closed');

-- حالة تسليم الواجب
CREATE TYPE public.submission_status AS ENUM ('pending', 'submitted', 'graded', 'late');

-- حالة الحضور
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

-- مستوى خطورة التنبيه
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- نوع التنبيه
CREATE TYPE public.alert_type AS ENUM (
  'late_assignment', 
  'low_grade', 
  'poor_attendance', 
  'high_achievement',
  'teacher_overload',
  'course_underperformance',
  'system'
);

-- ==========================================
-- القسم الثاني: الجداول الأساسية
-- ==========================================

-- 1. جدول الملفات الشخصية (profiles)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  full_name_ar TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Saudi Arabia',
  preferred_language TEXT DEFAULT 'ar',
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. جدول الأدوار (منفصل للأمان)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  UNIQUE (user_id, role)
);

-- 3. جدول المقررات الدراسية
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  teacher_id UUID REFERENCES auth.users(id),
  department TEXT,
  credits INTEGER DEFAULT 3,
  max_students INTEGER DEFAULT 30,
  status course_status DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  schedule JSONB, -- {"days": ["sunday", "tuesday"], "time": "09:00-10:30"}
  syllabus_url TEXT,
  cover_image_url TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. جدول تسجيل الطلاب في المقررات
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  enrolled_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'completed')),
  final_grade DECIMAL(5,2),
  completion_date DATE,
  notes TEXT,
  UNIQUE (student_id, course_id)
);

-- 5. جدول الواجبات والمهام
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,
  instructions TEXT,
  assignment_type TEXT DEFAULT 'homework' CHECK (assignment_type IN ('homework', 'quiz', 'exam', 'project', 'presentation')),
  max_score DECIMAL(5,2) NOT NULL DEFAULT 100,
  weight DECIMAL(5,2) DEFAULT 10, -- النسبة المئوية من الدرجة الكلية
  due_date TIMESTAMPTZ NOT NULL,
  publish_date TIMESTAMPTZ DEFAULT now(),
  allow_late_submission BOOLEAN DEFAULT true,
  late_penalty_percent DECIMAL(5,2) DEFAULT 10,
  max_attempts INTEGER DEFAULT 1,
  time_limit_minutes INTEGER,
  attachments JSONB DEFAULT '[]'::jsonb,
  rubric JSONB, -- معايير التقييم
  status assignment_status DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. جدول تسليم الواجبات
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ,
  score DECIMAL(5,2),
  feedback TEXT,
  feedback_attachments JSONB DEFAULT '[]'::jsonb,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES auth.users(id),
  attempt_number INTEGER DEFAULT 1,
  time_spent_minutes INTEGER,
  status submission_status DEFAULT 'pending',
  is_late BOOLEAN DEFAULT false,
  plagiarism_score DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, student_id, attempt_number)
);

-- 7. جدول الدرجات والتقييمات
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
  grade_type TEXT DEFAULT 'assignment' CHECK (grade_type IN ('assignment', 'quiz', 'midterm', 'final', 'participation', 'project', 'bonus')),
  score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) NOT NULL DEFAULT 100,
  weight DECIMAL(5,2) DEFAULT 1,
  comments TEXT,
  graded_by UUID REFERENCES auth.users(id),
  graded_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. جدول الحضور
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_time TIME,
  status attendance_status NOT NULL DEFAULT 'present',
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  notes TEXT,
  recorded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id, session_date)
);

-- 9. جدول التنبيهات
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type alert_type NOT NULL,
  severity alert_severity DEFAULT 'medium',
  title TEXT NOT NULL,
  title_ar TEXT,
  message TEXT NOT NULL,
  message_ar TEXT,
  related_entity_type TEXT, -- 'course', 'assignment', 'student', etc.
  related_entity_id UUID,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_dismissed BOOLEAN DEFAULT false,
  dismissed_at TIMESTAMPTZ,
  channels JSONB DEFAULT '["dashboard"]'::jsonb, -- ["email", "sms", "push", "dashboard"]
  sent_via JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. جدول علاقة أولياء الأمور بالطلاب
CREATE TABLE public.parent_student_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent' CHECK (relationship IN ('parent', 'guardian', 'other')),
  is_primary BOOLEAN DEFAULT false,
  can_view_grades BOOLEAN DEFAULT true,
  can_view_attendance BOOLEAN DEFAULT true,
  can_receive_alerts BOOLEAN DEFAULT true,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parent_id, student_id)
);

-- 11. جدول الدروس والمحتوى
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,
  content TEXT,
  content_ar TEXT,
  lesson_order INTEGER NOT NULL,
  duration_minutes INTEGER,
  video_url TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false,
  publish_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. جدول تقدم الطلاب في الدروس
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  time_spent_minutes INTEGER DEFAULT 0,
  last_position INTEGER DEFAULT 0, -- للفيديو: الثانية الأخيرة
  notes TEXT,
  UNIQUE (student_id, lesson_id)
);

-- 13. جدول سجل الأنشطة
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- القسم الثالث: الفهارس للأداء
-- ==========================================

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_courses_teacher_id ON public.courses(teacher_id);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_assignments_course_id ON public.assignments(course_id);
CREATE INDEX idx_assignments_due_date ON public.assignments(due_date);
CREATE INDEX idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX idx_grades_student_id ON public.grades(student_id);
CREATE INDEX idx_grades_course_id ON public.grades(course_id);
CREATE INDEX idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX idx_attendance_course_id ON public.attendance(course_id);
CREATE INDEX idx_attendance_session_date ON public.attendance(session_date);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_is_read ON public.alerts(is_read);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_lesson_progress_student_id ON public.lesson_progress(student_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ==========================================
-- القسم الرابع: دوال الأمان (Security Definer Functions)
-- ==========================================

-- دالة للتحقق من دور المستخدم
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

-- دالة للحصول على أدوار المستخدم
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
    AND is_active = true
$$;

-- دالة للتحقق إذا كان المستخدم معلم المقرر
CREATE OR REPLACE FUNCTION public.is_course_teacher(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.courses
    WHERE id = _course_id
      AND teacher_id = _user_id
  )
$$;

-- دالة للتحقق إذا كان المستخدم طالب في المقرر
CREATE OR REPLACE FUNCTION public.is_course_student(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.enrollments
    WHERE student_id = _user_id
      AND course_id = _course_id
      AND status = 'active'
  )
$$;

-- دالة للتحقق إذا كان المستخدم ولي أمر الطالب
CREATE OR REPLACE FUNCTION public.is_parent_of(_parent_id UUID, _student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.parent_student_relations
    WHERE parent_id = _parent_id
      AND student_id = _student_id
  )
$$;

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- دالة لإنشاء ملف شخصي تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, full_name_ar, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'full_name_ar',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- إضافة دور افتراضي (طالب) إذا لم يتم تحديد دور
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::app_role);
  END IF;
  
  RETURN NEW;
END;
$$;

-- ==========================================
-- القسم الخامس: المشغلات (Triggers)
-- ==========================================

-- مشغل لتحديث updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- مشغل لإنشاء ملف شخصي عند التسجيل
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- القسم السادس: تفعيل RLS
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- القسم السابع: سياسات RLS
-- ==========================================

-- === سياسات profiles ===
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view student profiles in their courses"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'teacher') AND
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.courses c ON c.id = e.course_id
      WHERE e.student_id = profiles.id
        AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their children profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_parent_of(auth.uid(), profiles.id));

-- === سياسات user_roles ===
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- === سياسات courses ===
CREATE POLICY "Anyone can view active courses"
  ON public.courses FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Teachers can view their courses"
  ON public.courses FOR SELECT
  TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage their courses"
  ON public.courses FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all courses"
  ON public.courses FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- === سياسات enrollments ===
CREATE POLICY "Students can view own enrollments"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view course enrollments"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (public.is_course_teacher(auth.uid(), course_id));

CREATE POLICY "Teachers can manage course enrollments"
  ON public.enrollments FOR ALL
  TO authenticated
  USING (public.is_course_teacher(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Parents can view children enrollments"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (public.is_parent_of(auth.uid(), student_id));

-- === سياسات assignments ===
CREATE POLICY "Students can view published assignments in enrolled courses"
  ON public.assignments FOR SELECT
  TO authenticated
  USING (
    status = 'published' AND
    public.is_course_student(auth.uid(), course_id)
  );

CREATE POLICY "Teachers can manage course assignments"
  ON public.assignments FOR ALL
  TO authenticated
  USING (public.is_course_teacher(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));

-- === سياسات submissions ===
CREATE POLICY "Students can view own submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can create own submissions"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own pending submissions"
  ON public.submissions FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid() AND status = 'pending');

CREATE POLICY "Teachers can view and grade submissions"
  ON public.submissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = submissions.assignment_id
        AND public.is_course_teacher(auth.uid(), a.course_id)
    )
  );

CREATE POLICY "Parents can view children submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (public.is_parent_of(auth.uid(), student_id));

-- === سياسات grades ===
CREATE POLICY "Students can view own grades"
  ON public.grades FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage grades in their courses"
  ON public.grades FOR ALL
  TO authenticated
  USING (public.is_course_teacher(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Parents can view children grades"
  ON public.grades FOR SELECT
  TO authenticated
  USING (public.is_parent_of(auth.uid(), student_id));

-- === سياسات attendance ===
CREATE POLICY "Students can view own attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage attendance in their courses"
  ON public.attendance FOR ALL
  TO authenticated
  USING (public.is_course_teacher(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Parents can view children attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (public.is_parent_of(auth.uid(), student_id));

-- === سياسات alerts ===
CREATE POLICY "Users can view own alerts"
  ON public.alerts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own alerts"
  ON public.alerts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create alerts"
  ON public.alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- === سياسات parent_student_relations ===
CREATE POLICY "Parents can view own relations"
  ON public.parent_student_relations FOR SELECT
  TO authenticated
  USING (parent_id = auth.uid());

CREATE POLICY "Admins can manage all relations"
  ON public.parent_student_relations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- === سياسات lessons ===
CREATE POLICY "Students can view published lessons in enrolled courses"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (
    is_published = true AND
    public.is_course_student(auth.uid(), course_id)
  );

CREATE POLICY "Teachers can manage lessons in their courses"
  ON public.lessons FOR ALL
  TO authenticated
  USING (public.is_course_teacher(auth.uid(), course_id) OR public.has_role(auth.uid(), 'admin'));

-- === سياسات lesson_progress ===
CREATE POLICY "Students can manage own progress"
  ON public.lesson_progress FOR ALL
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view progress in their courses"
  ON public.lesson_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      WHERE l.id = lesson_progress.lesson_id
        AND public.is_course_teacher(auth.uid(), l.course_id)
    )
  );

-- === سياسات activity_logs ===
CREATE POLICY "Users can view own activity"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own activity logs"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all activity"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
