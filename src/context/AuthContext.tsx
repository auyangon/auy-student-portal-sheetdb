import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  major: string;
  year: number;
  avatar: string;
  gpa: number;
  credits: number;
  totalCredits: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user accounts
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'alex.johnson@auy.edu.mm': {
    password: 'auy2024',
    user: {
      id: 'S001',
      name: 'Alex Johnson',
      email: 'alex.johnson@auy.edu.mm',
      studentId: 'AUY-2021-001',
      major: 'Computer Science',
      year: 3,
      avatar: 'AJ',
      gpa: 3.85,
      credits: 87,
      totalCredits: 120,
    },
  },
  'sarah.chen@auy.edu.mm': {
    password: 'auy2024',
    user: {
      id: 'S002',
      name: 'Sarah Chen',
      email: 'sarah.chen@auy.edu.mm',
      studentId: 'AUY-2022-047',
      major: 'Business Administration',
      year: 2,
      avatar: 'SC',
      gpa: 3.92,
      credits: 60,
      totalCredits: 120,
    },
  },
  'student@auy.edu.mm': {
    password: 'password',
    user: {
      id: 'S003',
      name: 'Demo Student',
      email: 'student@auy.edu.mm',
      studentId: 'AUY-2023-099',
      major: 'Information Technology',
      year: 1,
      avatar: 'DS',
      gpa: 3.50,
      credits: 30,
      totalCredits: 120,
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [storedUser, setStoredUser, removeStoredUser] = useLocalStorage<User | null>('auy_user', null);
  const [isLoading, setIsLoading] = useState(false);

  const user = storedUser;
  const isAuthenticated = !!user;

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate network

    const account = DEMO_USERS[email.toLowerCase()];
    if (account && account.password === password) {
      setStoredUser(account.user);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, [setStoredUser]);

  const logout = useCallback(() => {
    removeStoredUser();
  }, [removeStoredUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
