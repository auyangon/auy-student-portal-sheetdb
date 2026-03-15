import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import type { Student, Course, Enrollment, Attendance, Material, Schedule, Deadline, Announcement } from '../types';

interface DataContextType {
  student: Student | null;
  courses: Course[];
  enrollments: Enrollment[];
  attendance: Attendance[];
  materials: Material[];
  schedule: Schedule[];
  deadlines: Deadline[];
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        students,
        coursesData,
        enrollmentsData,
        attendanceData,
        materialsData,
        scheduleData,
        deadlinesData,
        announcementsData
      ] = await Promise.all([
        api.getStudents(),
        api.getCourses(),
        api.getEnrollments(),
        api.getAttendance(),
        api.getMaterials(),
        api.getSchedule(),
        api.getDeadlines(),
        api.getAnnouncements()
      ]);

      // Get current student
      const currentStudent = students.find((s: Student) => s.email === user.email);
      setStudent(currentStudent || null);

      if (currentStudent) {
        // Get enrollments for this student
        const studentEnrollments = enrollmentsData.filter((e: Enrollment) => e.studentId === currentStudent.studentId);
        setEnrollments(studentEnrollments);

        // Get course IDs from enrollments
        const courseIds = studentEnrollments.map((e: Enrollment) => e.courseId);
        
        // Get courses
        const studentCourses = coursesData.filter((c: Course) => courseIds.includes(c.courseId));
        setCourses(studentCourses);

        // Get attendance
        const studentAttendance = attendanceData.filter((a: Attendance) => a.studentId === currentStudent.studentId);
        setAttendance(studentAttendance);

        // Get materials for student's courses
        const courseMaterials = materialsData.filter((m: Material) => courseIds.includes(m.courseId));
        setMaterials(courseMaterials);

        // Get schedule for student's courses
        const courseSchedule = scheduleData.filter((s: Schedule) => courseIds.includes(s.courseId));
        setSchedule(courseSchedule);

        // Get deadlines for student's courses
        const courseDeadlines = deadlinesData.filter((d: Deadline) => 
          d.courseId === 'ALL' || courseIds.includes(d.courseId)
        );
        setDeadlines(courseDeadlines);
      }

      // Set announcements (filter by target courses later)
      setAnnouncements(announcementsData);

    } catch (err) {
      setError('Failed to load data');
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  return (
    <DataContext.Provider value={{
      student,
      courses,
      enrollments,
      attendance,
      materials,
      schedule,
      deadlines,
      announcements,
      loading,
      error,
      refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
