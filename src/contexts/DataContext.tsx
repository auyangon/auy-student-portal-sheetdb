import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Course,
  Enrollment,
  AttendanceSummary,
  DataState,
} from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface DataContextType extends DataState {
  refreshData: () => Promise<void>;
  markNotificationRead: (notificationId: string) => void;
  getUnreadCount: () => number;
  getCourseById: (courseId: string) => Course | undefined;
  getEnrollmentByCourseId: (courseId: string) => Enrollment | undefined;
  getAttendanceByCourseId: (courseId: string) => AttendanceSummary | undefined;
}

const initialState: DataState = {
  courses: [],
  enrollments: [],
  attendanceSummary: [],
  materials: [],
  schedule: [],
  deadlines: [],
  announcements: [],
  notifications: [],
  loading: true,
  lastUpdated: null,
  error: null,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const POLL_INTERVAL = parseInt(import.meta.env.VITE_POLL_INTERVAL || '30000', 10);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { student, isAuthenticated } = useAuth();
  const [state, setState] = useState<DataState>(initialState);

  const fetchData = useCallback(async () => {
    if (!student) return;

    try {
      // First get enrollments to know which courses the student is in
      const enrollments = await api.getStudentEnrollments(student.studentId);
      const courseIds = enrollments.map((e) => e.courseId);

      // Fetch all data
      const data = await api.fetchAllStudentData(student.studentId, courseIds);

      setState({
        ...data,
        loading: false,
        lastUpdated: new Date(),
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to load data',
      }));
    }
  }, [student]);

  // Initial fetch and polling
  useEffect(() => {
    if (!isAuthenticated || !student) {
      setState(initialState);
      return;
    }

    // Initial fetch
    fetchData();

    // Set up polling
    const interval = setInterval(fetchData, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isAuthenticated, student, fetchData]);

  const refreshData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    await fetchData();
  }, [fetchData]);

  const markNotificationRead = useCallback((notificationId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.notificationId === notificationId
          ? { ...n, isRead: true, readAt: new Date().toISOString().split('T')[0] }
          : n
      ),
    }));
  }, []);

  const getUnreadCount = useCallback(() => {
    return state.notifications.filter((n) => !n.isRead && !n.isArchived).length;
  }, [state.notifications]);

  const getCourseById = useCallback(
    (courseId: string) => {
      return state.courses.find((c) => c.courseId === courseId);
    },
    [state.courses]
  );

  const getEnrollmentByCourseId = useCallback(
    (courseId: string) => {
      return state.enrollments.find((e) => e.courseId === courseId);
    },
    [state.enrollments]
  );

  const getAttendanceByCourseId = useCallback(
    (courseId: string) => {
      return state.attendanceSummary.find((a) => a.courseId === courseId);
    },
    [state.attendanceSummary]
  );

  return (
    <DataContext.Provider
      value={{
        ...state,
        refreshData,
        markNotificationRead,
        getUnreadCount,
        getCourseById,
        getEnrollmentByCourseId,
        getAttendanceByCourseId,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export default DataContext;
