import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { observeAuthState, getCurrentUser } from '../lib/firebase';

interface User {
  id: string;
  uid?: string;
  username: string;
  displayName: string;
  email: string;
  profilePhoto: string;
  tier: 'free' | 'premium';
  apiKey: string;
  apiKeyGeneratedAt: number;
  requestsThisWeek: number;
  requestsResetAt: number;
  emailNotifications: boolean;
  createdAt: number;
  lastApiKeyRegeneration?: number;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const currentFirebaseUser = getCurrentUser();
    if (!currentFirebaseUser) {
      setUser(null);
      return;
    }

    try {
      const token = await currentFirebaseUser.getIdToken();
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = observeAuthState(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      setIsLoading(true);
      
      if (firebaseUser) {
        await refreshUser();
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = () => {
    // This will be handled by the LoginModal component
  };

  const logout = async () => {
    try {
      const { signOut } = await import('../lib/firebase');
      await signOut();
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    firebaseUser,
    isLoading,
    login,
    logout,
    refreshUser,
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