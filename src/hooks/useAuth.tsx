import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type AppRole = 'student' | 'teacher' | 'admin' | 'parent';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  full_name_ar: string | null;
  avatar_url: string | null;
  phone: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: AppRole[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role: AppRole) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile and roles fetch with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
            fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRoles([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchUserRoles(session.user.id);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, full_name_ar, avatar_url, phone')
        .eq('id', userId)
        .maybeSingle();
      
      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
    }
  };

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('is_active', true);
      
      if (!error && data) {
        setRoles(data.map(r => r.role as AppRole));
      }
    } catch (err) {
      console.warn('Failed to fetch user roles:', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
      if (isPlaceholder) {
        let detectedRole: AppRole = 'student';
        const lowerEmail = email.toLowerCase();
        if (lowerEmail.includes('teacher') || lowerEmail.includes('معلم')) detectedRole = 'teacher';
        else if (lowerEmail.includes('admin') || lowerEmail.includes('مدير')) detectedRole = 'admin';
        else if (lowerEmail.includes('parent') || lowerEmail.includes('ولي')) detectedRole = 'parent';

        const mockUser: User = {
          id: 'mock-user-id',
          app_metadata: {},
          user_metadata: { full_name: 'مستخدم تجريبي' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email: email,
        };
        setUser(mockUser);
        setRoles([detectedRole]);
        setProfile({
          id: 'mock-user-id',
          email: email,
          full_name: 'مستخدم تجريبي',
          full_name_ar: 'مستخدم تجريبي',
          avatar_url: null,
          phone: null,
        });
        toast({
          title: 'تم تسجيل الدخول (وضع المعاينة)',
          description: `تم تسجيل الدخول كـ ${detectedRole === 'student' ? 'طالب' : detectedRole === 'teacher' ? 'معلم' : detectedRole === 'admin' ? 'مدير' : 'ولي أمر'}`,
        });
        return { error: null };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        let message = 'حدث خطأ أثناء تسجيل الدخول';
        if (error.message.includes('Invalid login credentials')) {
          message = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        } else if (error.message.includes('Email not confirmed')) {
          message = 'يرجى تأكيد البريد الإلكتروني أولاً';
        }
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: message,
          variant: 'destructive',
        });
        return { error };
      }
      
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بعودتك!',
      });
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: AppRole) => {
    try {
      const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
      if (isPlaceholder) {
        const mockUser: User = {
          id: 'mock-user-id',
          app_metadata: {},
          user_metadata: { full_name: fullName, role },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email: email,
        };
        setUser(mockUser);
        setRoles([role]);
        setProfile({
          id: 'mock-user-id',
          email: email,
          full_name: fullName,
          full_name_ar: fullName,
          avatar_url: null,
          phone: null,
        });
        toast({
          title: 'تم إنشاء الحساب بنجاح (وضع المعاينة)',
          description: 'مرحباً بك في منصة BETC!',
        });
        return { error: null };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });
      
      if (error) {
        let message = 'حدث خطأ أثناء إنشاء الحساب';
        if (error.message.includes('User already registered')) {
          message = 'هذا البريد الإلكتروني مسجل مسبقاً';
        } else if (error.message.includes('Password should be')) {
          message = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        }
        toast({
          title: 'خطأ في إنشاء الحساب',
          description: message,
          variant: 'destructive',
        });
        return { error };
      }

      // Add user role
      if (data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role: role });
        
        if (roleError) {
          console.error('Error adding user role:', roleError);
        }
      }
      
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'مرحباً بك في منصة BETC!',
      });
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
      if (isPlaceholder) {
        const mockUser: User = {
          id: 'mock-google-user',
          app_metadata: {},
          user_metadata: { full_name: 'مستخدم جوجل' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email: 'user@example.com',
        };
        setUser(mockUser);
        setRoles(['student']);
        setProfile({
          id: 'mock-google-user',
          email: 'user@example.com',
          full_name: 'مستخدم جوجل',
          full_name_ar: 'مستخدم جوجل',
          avatar_url: null,
          phone: null,
        });
        toast({
          title: 'تم تسجيل الدخول (وضع المعاينة)',
          description: 'مرحباً بك كطالب!',
        });
        return { error: null };
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: 'حدث خطأ أثناء الاتصال بـ Google',
          variant: 'destructive',
        });
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
    toast({
      title: 'تم تسجيل الخروج',
      description: 'نراك قريباً!',
    });
  };

  const hasRole = (role: AppRole) => {
    return roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      roles,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
