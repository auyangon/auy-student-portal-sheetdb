import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Student, AuthState } from '../types';
import { api } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  student: null,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const [storedUser, setStoredUser, removeStoredUser] = useLocalStorage<User | null>('au_user', null);
  const [storedStudent, setStoredStudent, removeStoredStudent] = useLocalStorage<Student | null>('au_student', null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      if (storedUser && storedStudent) {
        setState({
          isAuthenticated: true,
          user: storedUser,
          student: storedStudent,
          loading: false,
          error: null,
        });
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    checkSession();
  }, [storedUser, storedStudent]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Authenticate user
      const user = await api.authenticateUser(email, password);
      
      if (!user) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Invalid email or password',
        }));
        return false;
      }

      // Get student information
      const student = await api.getStudentByEmail(email);
      
      if (!student) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Student profile not found',
        }));
        return false;
      }

      // Store in localStorage
      setStoredUser(user);
      setStoredStudent(student);

      // Update state
      setState({
        isAuthenticated: true,
        user,
        student,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'An error occurred during login',
      }));
      return false;
    }
  }, [setStoredUser, setStoredStudent]);

  const logout = useCallback(() => {
    removeStoredUser();
    removeStoredStudent();
    setState({
      ...initialState,
      loading: false,
    });
  }, [removeStoredUser, removeStoredStudent]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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

export default AuthContext;
