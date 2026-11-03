export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      alerts: {
        Row: {
          action_url: string | null
          alert_type: Database["public"]["Enums"]["alert_type"]
          channels: Json | null
          created_at: string
          dismissed_at: string | null
          expires_at: string | null
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          message: string
          message_ar: string | null
          metadata: Json | null
          read_at: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          sent_via: Json | null
          severity: Database["public"]["Enums"]["alert_severity"] | null
          title: string
          title_ar: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          alert_type: Database["public"]["Enums"]["alert_type"]
          channels?: Json | null
          created_at?: string
          dismissed_at?: string | null
          expires_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message: string
          message_ar?: string | null
          metadata?: Json | null
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sent_via?: Json | null
          severity?: Database["public"]["Enums"]["alert_severity"] | null
          title: string
          title_ar?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          alert_type?: Database["public"]["Enums"]["alert_type"]
          channels?: Json | null
          created_at?: string
          dismissed_at?: string | null
          expires_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message?: string
          message_ar?: string | null
          metadata?: Json | null
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sent_via?: Json | null
          severity?: Database["public"]["Enums"]["alert_severity"] | null
          title?: string
          title_ar?: string | null
          user_id?: string
        }
        Relationships: []
      }
      assignments: {
        Row: {
          allow_late_submission: boolean | null
          assignment_type: string | null
          attachments: Json | null
          course_id: string
          created_at: string
          created_by: string | null
          description: string | null
          description_ar: string | null
          due_date: string
          id: string
          instructions: string | null
          late_penalty_percent: number | null
          max_attempts: number | null
          max_score: number
          publish_date: string | null
          rubric: Json | null
          status: Database["public"]["Enums"]["assignment_status"] | null
          time_limit_minutes: number | null
          title: string
          title_ar: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          allow_late_submission?: boolean | null
          assignment_type?: string | null
          attachments?: Json | null
          course_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          due_date: string
          id?: string
          instructions?: string | null
          late_penalty_percent?: number | null
          max_attempts?: number | null
          max_score?: number
          publish_date?: string | null
          rubric?: Json | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          time_limit_minutes?: number | null
          title: string
          title_ar?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          allow_late_submission?: boolean | null
          assignment_type?: string | null
          attachments?: Json | null
          course_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          due_date?: string
          id?: string
          instructions?: string | null
          late_penalty_percent?: number | null
          max_attempts?: number | null
          max_score?: number
          publish_date?: string | null
          rubric?: Json | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          time_limit_minutes?: number | null
          title?: string
          title_ar?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          course_id: string
          created_at: string
          id: string
          notes: string | null
          recorded_by: string | null
          session_date: string
          session_time: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          course_id: string
          created_at?: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          session_date: string
          session_time?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          course_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          session_date?: string
          session_time?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          cover_image_url: string | null
          created_at: string
          credits: number | null
          department: string | null
          description: string | null
          description_ar: string | null
          end_date: string | null
          id: string
          max_students: number | null
          name: string
          name_ar: string
          schedule: Json | null
          settings: Json | null
          start_date: string | null
          status: Database["public"]["Enums"]["course_status"] | null
          syllabus_url: string | null
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          code: string
          cover_image_url?: string | null
          created_at?: string
          credits?: number | null
          department?: string | null
          description?: string | null
          description_ar?: string | null
          end_date?: string | null
          id?: string
          max_students?: number | null
          name: string
          name_ar: string
          schedule?: Json | null
          settings?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          syllabus_url?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          cover_image_url?: string | null
          created_at?: string
          credits?: number | null
          department?: string | null
          description?: string | null
          description_ar?: string | null
          end_date?: string | null
          id?: string
          max_students?: number | null
          name?: string
          name_ar?: string
          schedule?: Json | null
          settings?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          syllabus_url?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completion_date: string | null
          course_id: string
          enrolled_at: string
          enrolled_by: string | null
          final_grade: number | null
          id: string
          notes: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          completion_date?: string | null
          course_id: string
          enrolled_at?: string
          enrolled_by?: string | null
          final_grade?: number | null
          id?: string
          notes?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          completion_date?: string | null
          course_id?: string
          enrolled_at?: string
          enrolled_by?: string | null
          final_grade?: number | null
          id?: string
          notes?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          assignment_id: string | null
          comments: string | null
          course_id: string
          created_at: string
          grade_type: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          max_score: number
          score: number
          student_id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          assignment_id?: string | null
          comments?: string | null
          course_id: string
          created_at?: string
          grade_type?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          max_score?: number
          score: number
          student_id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          assignment_id?: string | null
          comments?: string | null
          course_id?: string
          created_at?: string
          grade_type?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          max_score?: number
          score?: number
          student_id?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          last_position: number | null
          lesson_id: string
          notes: string | null
          progress_percent: number | null
          started_at: string | null
          student_id: string
          time_spent_minutes: number | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          last_position?: number | null
          lesson_id: string
          notes?: string | null
          progress_percent?: number | null
          started_at?: string | null
          student_id: string
          time_spent_minutes?: number | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          last_position?: number | null
          lesson_id?: string
          notes?: string | null
          progress_percent?: number | null
          started_at?: string | null
          student_id?: string
          time_spent_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          attachments: Json | null
          content: string | null
          content_ar: string | null
          course_id: string
          created_at: string
          created_by: string | null
          description: string | null
          description_ar: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          lesson_order: number
          publish_date: string | null
          title: string
          title_ar: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          attachments?: Json | null
          content?: string | null
          content_ar?: string | null
          course_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          lesson_order: number
          publish_date?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          attachments?: Json | null
          content?: string | null
          content_ar?: string | null
          course_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_ar?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          lesson_order?: number
          publish_date?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_student_relations: {
        Row: {
          can_receive_alerts: boolean | null
          can_view_attendance: boolean | null
          can_view_grades: boolean | null
          created_at: string
          id: string
          is_primary: boolean | null
          parent_id: string
          relationship: string | null
          student_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          can_receive_alerts?: boolean | null
          can_view_attendance?: boolean | null
          can_view_grades?: boolean | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          parent_id: string
          relationship?: string | null
          student_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          can_receive_alerts?: boolean | null
          can_view_attendance?: boolean | null
          can_view_grades?: boolean | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          parent_id?: string
          relationship?: string | null
          student_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string
          full_name_ar: string | null
          gender: string | null
          id: string
          notification_preferences: Json | null
          phone: string | null
          preferred_language: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name: string
          full_name_ar?: string | null
          gender?: string | null
          id: string
          notification_preferences?: Json | null
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string
          full_name_ar?: string | null
          gender?: string | null
          id?: string
          notification_preferences?: Json | null
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          assignment_id: string
          attachments: Json | null
          attempt_number: number | null
          content: string | null
          created_at: string
          feedback: string | null
          feedback_attachments: Json | null
          graded_at: string | null
          graded_by: string | null
          id: string
          is_late: boolean | null
          plagiarism_score: number | null
          score: number | null
          status: Database["public"]["Enums"]["submission_status"] | null
          student_id: string
          submitted_at: string | null
          time_spent_minutes: number | null
          updated_at: string
        }
        Insert: {
          assignment_id: string
          attachments?: Json | null
          attempt_number?: number | null
          content?: string | null
          created_at?: string
          feedback?: string | null
          feedback_attachments?: Json | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_late?: boolean | null
          plagiarism_score?: number | null
          score?: number | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          student_id: string
          submitted_at?: string | null
          time_spent_minutes?: number | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          attachments?: Json | null
          attempt_number?: number | null
          content?: string | null
          created_at?: string
          feedback?: string | null
          feedback_attachments?: Json | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_late?: boolean | null
          plagiarism_score?: number | null
          score?: number | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          student_id?: string
          submitted_at?: string | null
          time_spent_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_course_student: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      is_course_teacher: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      is_parent_of: {
        Args: { _parent_id: string; _student_id: string }
        Returns: boolean
      }
    }
    Enums: {
      alert_severity: "low" | "medium" | "high" | "critical"
      alert_type:
        | "late_assignment"
        | "low_grade"
        | "poor_attendance"
        | "high_achievement"
        | "teacher_overload"
        | "course_underperformance"
        | "system"
      app_role: "student" | "teacher" | "admin" | "parent"
      assignment_status: "draft" | "published" | "closed"
      attendance_status: "present" | "absent" | "late" | "excused"
      course_status: "active" | "archived" | "draft"
      submission_status: "pending" | "submitted" | "graded" | "late"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["low", "medium", "high", "critical"],
      alert_type: [
        "late_assignment",
        "low_grade",
        "poor_attendance",
        "high_achievement",
        "teacher_overload",
        "course_underperformance",
        "system",
      ],
      app_role: ["student", "teacher", "admin", "parent"],
      assignment_status: ["draft", "published", "closed"],
      attendance_status: ["present", "absent", "late", "excused"],
      course_status: ["active", "archived", "draft"],
      submission_status: ["pending", "submitted", "graded", "late"],
    },
  },
} as const
