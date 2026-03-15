import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../contexts/DataContext';

export function useRealtimeData({ email }: { email: string | null }) {
  const context = useContext(DataContext);
  const [syncing, setSyncing] = useState(false);
  
  if (!context) {
    throw new Error('useRealtimeData must be used within DataProvider');
  }

  const { student, courses, enrollments, attendance, materials, schedule, deadlines, announcements, loading, error, refreshData } = context;

  // Format data to match your UI expectations
  const data = {
    student: student || {},
    enrollments: enrollments || [],
    courses: courses || [],
    attendance: {
      present: attendance?.reduce((sum, a) => sum + (a.present || 0), 0) || 0,
      totalClasses: attendance?.reduce((sum, a) => sum + (a.totalClasses || 0), 0) || 1,
      percentage: attendance?.length ? 
        Math.round(attendance.reduce((sum, a) => sum + (a.percentage || 0), 0) / attendance.length) : 0
    },
    announcements: announcements || [],
    deadlines: deadlines || [],
    materials: materials || [],
    schedule: schedule || [],
    gpa: enrollments?.length ? 
      (enrollments.reduce((sum, e) => {
        const gradePoints = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
        return sum + (gradePoints[e.grade as keyof typeof gradePoints] || 0) * (e.credits || 3);
      }, 0) / enrollments.reduce((sum, e) => sum + (e.credits || 3), 0)).toFixed(2) : '0.00'
  };

  const refresh = async () => {
    setSyncing(true);
    await refreshData();
    setTimeout(() => setSyncing(false), 1000);
  };

  return { data, loading, error, refresh, syncing };
}
