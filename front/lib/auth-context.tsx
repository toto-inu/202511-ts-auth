'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLazyQuery } from '@apollo/client/react';
import { GET_ME } from '@/graphql/queries/auth';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [getMe, { data, error }] = useLazyQuery(GET_ME, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe();
    } else {
      setLoading(false);
    }
  }, [getMe]);

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
      setLoading(false);
    } else if (error) {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [data, error]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const refetchUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetchUser }}>
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
