import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User, Student, AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('auy_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Get users from Users sheet
      const users = await api.getUsers();
      const matchedUser = users.find((u: User) => u.email === email && u.password === password);
      
      if (!matchedUser) return false;

      // Get student details from Students sheet
      const students = await api.getStudents();
      const student = students.find((s: Student) => s.email === email);

      const authUser: AuthUser = {
        email: matchedUser.email,
        studentId: matchedUser.studentId || student?.studentId || '',
        studentName: student?.studentName,
        major: student?.major
      };

      setUser(authUser);
      localStorage.setItem('auy_user', JSON.stringify(authUser));
      return true;

    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auy_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
