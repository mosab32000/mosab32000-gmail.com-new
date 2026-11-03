-- Migration: 004_create_btec_rubrics_and_tenancy.sql
-- Phase 3 Rehabilitation: Multi-Tenancy Isolation, BTEC Rubrics, Submissions, and Immutable Audit Trail

CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.btec_rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_code TEXT NOT NULL,
  criterion_code TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Pass', 'Merit', 'Distinction')),
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  learning_aim TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (unit_code, criterion_code)
);

CREATE TABLE IF NOT EXISTS public.btec_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  rubric_id UUID NOT NULL REFERENCES public.btec_rubrics(id) ON DELETE RESTRICT,
  evidence_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (
    status IN (
      'SUBMITTED',
      'UNDER_ASSESSMENT',
      'GRADED_FIRST_ATTEMPT',
      'RESUBMISSION_AUTHORIZED',
      'RESUBMITTED',
      'FINAL_LOCKED'
    )
  ),
  awarded_grade TEXT NOT NULL DEFAULT 'UNGRADED' CHECK (
    awarded_grade IN ('UNGRADED', 'REFER', 'PASS', 'MERIT', 'DISTINCTION')
  ),
  assessor_id UUID REFERENCES auth.users(id),
  assessor_feedback TEXT,
  internal_verifier_id UUID REFERENCES auth.users(id),
  resubmission_count INTEGER NOT NULL DEFAULT 0 CHECK (resubmission_count <= 1),
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_btec_submissions_institution_student
  ON public.btec_submissions(institution_id, student_id);

CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_id TEXT NOT NULL,
  correlation_id TEXT NOT NULL,
  institution_id UUID REFERENCES public.institutions(id),
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('ALLOWED', 'DENIED', 'ERROR')),
  reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_security_audit_logs_institution_created
  ON public.security_audit_logs(institution_id, created_at DESC);

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.btec_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.btec_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read standard BTEC rubrics
CREATE POLICY "Authenticated users can view BTEC rubrics"
  ON public.btec_rubrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Students can only read and insert their own submissions within their institution
CREATE POLICY "Students view own submissions"
  ON public.btec_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students insert own submissions"
  ON public.btec_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);
