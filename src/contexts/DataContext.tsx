import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { AuthContext } from './AuthContext';

// Export the context so hooks can use it
export const DataContext = createContext<any>(null);

interface DataContextType {
  student: any;
  courses: any[];
  enrollments: any[];
  attendance: any[];
  materials: any[];
  schedule: any[];
  deadlines: any[];
  announcements: any[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [student, setStudent] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      const [students, coursesData, enrollmentsData, attendanceData, 
             materialsData, scheduleData, deadlinesData, announcementsData] = await Promise.all([
        api.getStudents(), api.getCourses(), api.getEnrollments(), api.getAttendance(),
        api.getMaterials(), api.getSchedule(), api.getDeadlines(), api.getAnnouncements()
      ]);

      const currentStudent = students?.find((s: any) => s.email === user.email);
      setStudent(currentStudent);

      if (currentStudent) {
        const studentEnrollments = enrollmentsData?.filter((e: any) => e.studentId === currentStudent.studentId) || [];
        setEnrollments(studentEnrollments);
        
        const courseIds = studentEnrollments.map((e: any) => e.courseId);
        setCourses(coursesData?.filter((c: any) => courseIds.includes(c.courseId)) || []);
        setAttendance(attendanceData?.filter((a: any) => a.studentId === currentStudent.studentId) || []);
        setMaterials(materialsData?.filter((m: any) => courseIds.includes(m.courseId)) || []);
        setSchedule(scheduleData?.filter((s: any) => courseIds.includes(s.courseId)) || []);
        setDeadlines(deadlinesData?.filter((d: any) => d.courseId === 'ALL' || courseIds.includes(d.courseId)) || []);
      }
      
      setAnnouncements(announcementsData || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <DataContext.Provider value={{
      student, courses, enrollments, attendance, materials, schedule, deadlines, announcements,
      loading, error, refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};
