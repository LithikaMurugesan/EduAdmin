import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/api/auth';
import { setAccessToken } from '@/api/client';

type AppRole = 'admin' | 'superadmin';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
}

interface AuthContextType {
  user: User | null;
  session: null;
  role: AppRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isSuperadmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await authApi.refreshToken();

        if (response?.accessToken) {
          // OPTIONAL: call /me endpoint if you add one later
          setAccessToken(response.accessToken);
        }
      } catch (err) {
        
        console.log('No active session');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);



  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      setUser({
        id: response.user.id,
        email: response.user.email,
        fullName: response.user.fullName,
        role: response.user.role,
      });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await authApi.signup({ email, password, fullName });
      setUser({
        id: response.user.id,
        email: response.user.email,
        fullName: response.user.fullName,
        role: response.user.role,
      });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const value: AuthContextType = {
    user,
    session: null,
    role: user?.role || 'admin',
    loading,
    signIn,
    signUp,
    signOut,
    isSuperadmin: user?.role === 'superadmin',
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
