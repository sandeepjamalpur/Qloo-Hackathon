
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { getUserProfile } from '@/services/supabase';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAIL = 'admin@kala.com';
const ADMIN_PASSWORD = 'Culture#28';

interface AuthContextType {
  user: User | null;
  supabase: SupabaseClient | null;
  loading: boolean;
  profileExists: boolean | null;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  const isSupabaseConfigured = !!supabase;

  useEffect(() => {
    // This effect should only run once on the client side.
    if (typeof window === 'undefined') {
        return;
    }

    try {
      // Check for a local admin session first.
      const isAdminSession = sessionStorage.getItem('is-admin');
      if (isAdminSession === 'true') {
        setUser({ id: 'admin-user', email: ADMIN_EMAIL, app_metadata: {}, aud: 'authenticated' } as User);
        setProfileExists(true);
        setLoading(false);
        // Check if we should show the admin login toast
        if (sessionStorage.getItem('show-admin-toast') === 'true') {
            toast({
              title: 'Admin Login',
              description: 'You have unlimited access.',
            });
            sessionStorage.removeItem('show-admin-toast');
        }
        return; // Stop further execution to prevent Supabase check
      }
    } catch (e) {
      console.warn("Session storage not available. Admin check skipped.");
    }
    
    // If not admin, proceed with Supabase auth
    if (!isSupabaseConfigured) {
        setLoading(false);
        return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
            setProfileExists(true); // Assume profile exists if logged in, as we removed creation step
            if (event === 'SIGNED_IN') {
                router.push('/');
            }
        } else {
            setProfileExists(false);
        }
        setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, isSupabaseConfigured, supabase, pathname, toast]);

  const login = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured. Have you configured your .env file?");
    return supabase.auth.signInWithPassword({ email, password: pass });
  };

  const signup = (email: string, pass: string) => {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured. Have you configured your .env file?");
    return supabase.auth.signUp({ email, password: pass });
  };
  
  const loginWithGoogle = () => {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured. Have you configured your .env file?");
    return supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    });
  };

  const logout = async () => {
    // Clear local admin session if it exists
    try {
      sessionStorage.removeItem('is-admin');
      sessionStorage.removeItem('show-admin-toast');
    } catch (e) {
      console.warn("Session storage not available for admin logout.");
    }
    
    // Sign out from Supabase if it's configured and was used
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    
    // Reset state and redirect
    setUser(null);
    setProfileExists(false);
    // Use window.location to force a full reload after logout
    window.location.href = '/login';
  };

  const value = {
    user,
    supabase,
    loading,
    profileExists,
    login,
    signup,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
