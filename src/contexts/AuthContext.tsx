import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// Export the context so hooks can use it
export const AuthContext = createContext<any>(null);

interface AuthUser {
  email: string;
  studentId: string;
  studentName?: string;
  major?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('auy_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const users = await api.getUsers();
      const matchedUser = users.find((u: any) => 
        u.email?.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );
      
      if (!matchedUser) {
        setError('Invalid email or password');
        return false;
      }

      const students = await api.getStudents();
      const student = students.find((s: any) => 
        s.email?.toLowerCase() === email.toLowerCase()
      );

      const authUser = {
        email: matchedUser.email,
        studentId: student?.studentId || matchedUser.studentId || '',
        studentName: student?.studentName,
        major: student?.major
      };

      setUser(authUser);
      localStorage.setItem('auy_user', JSON.stringify(authUser));
      return true;
    } catch (err) {
      setError('Connection error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auy_user');
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
