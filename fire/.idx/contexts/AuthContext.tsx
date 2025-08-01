
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createSupabaseBrowserClient } from 'fire/src/lib/supabase';
import { getUserProfile } from 'fire/src/services/supabase';

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
  
  const isSupabaseConfigured = !!supabase;

  useEffect(() => {
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
            const profile = await getUserProfile(currentUser.id);
            const hasProfile = !!profile;
            setProfileExists(hasProfile);
            if (!hasProfile && window.location.pathname !== '/create-profile' && window.location.pathname !== '/signup') {
                router.push('/create-profile');
            }
        } else {
            setProfileExists(false);
        }
        setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, isSupabaseConfigured, supabase]);

  const login = (email: string, pass: string) => {
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
    if (!isSupabaseConfigured) throw new Error("Supabase not configured. Have you configured your .env file?");
    setProfileExists(false);
    await supabase.auth.signOut();
    router.push('/login');
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
