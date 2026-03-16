import React, { createContext, useContext, useState, useCallback } from 'react';
import { usePolling } from '../hooks/usePolling';
import { useAuth } from './AuthContext';

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  grade: string;
  gradePoints: number;
  progress: number;
  color: string;
  schedule: string;
  room: string;
  enrolled: number;
  capacity: number;
}

export interface Material {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: 'PDF' | 'Video' | 'Slides' | 'Assignment' | 'Link';
  size: string;
  uploadedAt: string;
  instructor: string;
  url: string;
}

export interface ScheduleItem {
  id: string;
  courseId: string;
  courseName: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  color: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Exam';
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  department: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  category: 'Academic' | 'Campus' | 'Events' | 'Exam' | 'Financial';
  isRead: boolean;
}

interface DataContextType {
  courses: Course[];
  materials: Material[];
  schedule: ScheduleItem[];
  announcements: Announcement[];
  isLoading: boolean;
  lastUpdated: Date | null;
  refetch: () => void;
  markAnnouncementRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function generateData(_userId: string): {
  courses: Course[];
  materials: Material[];
  schedule: ScheduleItem[];
  announcements: Announcement[];
} {
  const courses: Course[] = [
    {
      id: 'c1', code: 'CS301', name: 'Data Structures & Algorithms',
      instructor: 'Dr. Min Thura', credits: 3, grade: 'A', gradePoints: 4.0,
      progress: 72, color: '#60a5fa', schedule: 'Mon, Wed, Fri 09:00–10:00',
      room: 'CS Lab 201', enrolled: 38, capacity: 40,
    },
    {
      id: 'c2', code: 'CS315', name: 'Database Management Systems',
      instructor: 'Prof. Su Su Win', credits: 3, grade: 'A-', gradePoints: 3.7,
      progress: 65, color: '#818cf8', schedule: 'Tue, Thu 13:30–15:00',
      room: 'Room 304', enrolled: 42, capacity: 45,
    },
    {
      id: 'c3', code: 'CS320', name: 'Software Engineering',
      instructor: 'Dr. Kyaw Zin', credits: 3, grade: 'B+', gradePoints: 3.3,
      progress: 80, color: '#c084fc', schedule: 'Mon, Wed 11:00–12:30',
      room: 'Room 102', enrolled: 35, capacity: 40,
    },
    {
      id: 'c4', code: 'MATH201', name: 'Discrete Mathematics',
      instructor: 'Prof. Aye Chan', credits: 3, grade: 'A', gradePoints: 4.0,
      progress: 90, color: '#34d399', schedule: 'Tue, Thu 09:00–10:30',
      room: 'Math Hall 3', enrolled: 50, capacity: 55,
    },
    {
      id: 'c5', code: 'CS310', name: 'Computer Networks',
      instructor: 'Dr. Thida Oo', credits: 3, grade: 'B+', gradePoints: 3.3,
      progress: 55, color: '#fb923c', schedule: 'Fri 13:00–16:00',
      room: 'Network Lab', enrolled: 28, capacity: 30,
    },
    {
      id: 'c6', code: 'ENG201', name: 'Technical Writing',
      instructor: 'Ms. Naw Eh Moo', credits: 2, grade: 'A-', gradePoints: 3.7,
      progress: 85, color: '#f472b6', schedule: 'Wed 15:00–17:00',
      room: 'Room 205', enrolled: 45, capacity: 50,
    },
  ];

  const materials: Material[] = [
    { id: 'm1', courseId: 'c1', courseName: 'Data Structures & Algorithms', title: 'Lecture 8 – AVL Trees & Red-Black Trees', type: 'PDF', size: '2.4 MB', uploadedAt: '2024-03-10', instructor: 'Dr. Min Thura', url: '#' },
    { id: 'm2', courseId: 'c1', courseName: 'Data Structures & Algorithms', title: 'Assignment 3 – Graph Traversal', type: 'Assignment', size: '450 KB', uploadedAt: '2024-03-08', instructor: 'Dr. Min Thura', url: '#' },
    { id: 'm3', courseId: 'c2', courseName: 'Database Management Systems', title: 'SQL Advanced Queries – Slides', type: 'Slides', size: '5.1 MB', uploadedAt: '2024-03-09', instructor: 'Prof. Su Su Win', url: '#' },
    { id: 'm4', courseId: 'c2', courseName: 'Database Management Systems', title: 'Normalization Explained', type: 'Video', size: '240 MB', uploadedAt: '2024-03-07', instructor: 'Prof. Su Su Win', url: '#' },
    { id: 'm5', courseId: 'c3', courseName: 'Software Engineering', title: 'Agile & Scrum Methodology', type: 'PDF', size: '3.2 MB', uploadedAt: '2024-03-06', instructor: 'Dr. Kyaw Zin', url: '#' },
    { id: 'm6', courseId: 'c3', courseName: 'Software Engineering', title: 'Project Proposal Template', type: 'Assignment', size: '180 KB', uploadedAt: '2024-03-05', instructor: 'Dr. Kyaw Zin', url: '#' },
    { id: 'm7', courseId: 'c4', courseName: 'Discrete Mathematics', title: 'Graph Theory – Chapter 6', type: 'PDF', size: '1.8 MB', uploadedAt: '2024-03-04', instructor: 'Prof. Aye Chan', url: '#' },
    { id: 'm8', courseId: 'c5', courseName: 'Computer Networks', title: 'TCP/IP Protocol Suite', type: 'Slides', size: '4.5 MB', uploadedAt: '2024-03-03', instructor: 'Dr. Thida Oo', url: '#' },
    { id: 'm9', courseId: 'c5', courseName: 'Computer Networks', title: 'Wireshark Lab Tutorial', type: 'Video', size: '180 MB', uploadedAt: '2024-03-02', instructor: 'Dr. Thida Oo', url: '#' },
    { id: 'm10', courseId: 'c6', courseName: 'Technical Writing', title: 'IEEE Format Guidelines', type: 'Link', size: '—', uploadedAt: '2024-03-01', instructor: 'Ms. Naw Eh Moo', url: '#' },
  ];

  const schedule: ScheduleItem[] = [
    { id: 's1', courseId: 'c1', courseName: 'Data Structures & Algorithms', instructor: 'Dr. Min Thura', day: 'Monday', startTime: '09:00', endTime: '10:00', room: 'CS Lab 201', color: '#60a5fa', type: 'Lecture' },
    { id: 's2', courseId: 'c3', courseName: 'Software Engineering', instructor: 'Dr. Kyaw Zin', day: 'Monday', startTime: '11:00', endTime: '12:30', room: 'Room 102', color: '#c084fc', type: 'Lecture' },
    { id: 's3', courseId: 'c4', courseName: 'Discrete Mathematics', instructor: 'Prof. Aye Chan', day: 'Tuesday', startTime: '09:00', endTime: '10:30', room: 'Math Hall 3', color: '#34d399', type: 'Lecture' },
    { id: 's4', courseId: 'c2', courseName: 'Database Management Systems', instructor: 'Prof. Su Su Win', day: 'Tuesday', startTime: '13:30', endTime: '15:00', room: 'Room 304', color: '#818cf8', type: 'Lecture' },
    { id: 's5', courseId: 'c1', courseName: 'Data Structures & Algorithms', instructor: 'Dr. Min Thura', day: 'Wednesday', startTime: '09:00', endTime: '10:00', room: 'CS Lab 201', color: '#60a5fa', type: 'Lecture' },
    { id: 's6', courseId: 'c3', courseName: 'Software Engineering', instructor: 'Dr. Kyaw Zin', day: 'Wednesday', startTime: '11:00', endTime: '12:30', room: 'Room 102', color: '#c084fc', type: 'Tutorial' },
    { id: 's7', courseId: 'c6', courseName: 'Technical Writing', instructor: 'Ms. Naw Eh Moo', day: 'Wednesday', startTime: '15:00', endTime: '17:00', room: 'Room 205', color: '#f472b6', type: 'Lecture' },
    { id: 's8', courseId: 'c4', courseName: 'Discrete Mathematics', instructor: 'Prof. Aye Chan', day: 'Thursday', startTime: '09:00', endTime: '10:30', room: 'Math Hall 3', color: '#34d399', type: 'Lecture' },
    { id: 's9', courseId: 'c2', courseName: 'Database Management Systems', instructor: 'Prof. Su Su Win', day: 'Thursday', startTime: '13:30', endTime: '15:00', room: 'Room 304', color: '#818cf8', type: 'Lab' },
    { id: 's10', courseId: 'c1', courseName: 'Data Structures & Algorithms', instructor: 'Dr. Min Thura', day: 'Friday', startTime: '09:00', endTime: '10:00', room: 'CS Lab 201', color: '#60a5fa', type: 'Lecture' },
    { id: 's11', courseId: 'c5', courseName: 'Computer Networks', instructor: 'Dr. Thida Oo', day: 'Friday', startTime: '13:00', endTime: '16:00', room: 'Network Lab', color: '#fb923c', type: 'Lab' },
  ];

  const announcements: Announcement[] = [
    {
      id: 'a1', title: 'Midterm Examination Schedule Released', body: 'The midterm examination schedule for Semester 2, AY 2023–2024 has been officially released. Please check your student portal for room assignments and time slots. All exams will be held from March 18–22, 2024. Students are advised to bring their student ID cards.', author: 'Academic Registrar', department: 'Office of the Registrar', date: '2024-03-11', priority: 'high', category: 'Exam', isRead: false,
    },
    {
      id: 'a2', title: 'Spring Research Symposium – Call for Papers', body: 'The AUY Research Committee is now accepting abstract submissions for the 5th Annual Spring Research Symposium. Undergraduate and graduate students are encouraged to submit their research findings. Deadline: March 25, 2024. Prizes will be awarded for outstanding submissions.', author: 'Research Committee', department: 'Office of Research', date: '2024-03-10', priority: 'medium', category: 'Academic', isRead: false,
    },
    {
      id: 'a3', title: 'Library Extended Hours During Exam Period', body: 'The AUY Main Library will extend its operating hours during the upcoming exam period (March 15–25). New hours: Monday–Friday 07:00–23:00, Saturday–Sunday 08:00–22:00. Group study rooms must be booked in advance via the library portal.', author: 'Library Administration', department: 'Library Services', date: '2024-03-09', priority: 'low', category: 'Campus', isRead: true,
    },
    {
      id: 'a4', title: 'Tuition Fee Payment Deadline – Spring 2024', body: 'This is a reminder that the tuition fee payment deadline for Spring 2024 is March 15, 2024. Students who have not completed payment may have their course registrations suspended. Payment can be made at the Finance Office (Room 101) or via online banking. Contact finance@auy.edu.mm for inquiries.', author: 'Finance Office', department: 'Finance & Accounting', date: '2024-03-08', priority: 'high', category: 'Financial', isRead: false,
    },
    {
      id: 'a5', title: 'Career Fair 2024 – 50+ Companies Attending', body: 'AUY Career Center is excited to announce the Annual Career Fair on March 28, 2024 from 10:00–16:00 at the Main Hall. Over 50 companies including Microsoft, Google, local tech firms, and international organizations will be attending. Bring your CV and dress professionally!', author: 'Career Center', department: 'Student Affairs', date: '2024-03-07', priority: 'medium', category: 'Events', isRead: true,
    },
    {
      id: 'a6', title: 'Campus Wi-Fi Upgrade – Temporary Outage', body: 'The IT department will be upgrading campus Wi-Fi infrastructure on March 16, 2024 from 02:00–06:00 AM. There will be a brief service outage during this period. The upgrade will significantly improve connection speeds across all campus buildings. Apologies for any inconvenience.', author: 'IT Services', department: 'Information Technology', date: '2024-03-06', priority: 'low', category: 'Campus', isRead: true,
    },
    {
      id: 'a7', title: 'New Elective Courses Available for Registration', body: 'Registration for new elective courses for the upcoming summer semester is now open. Available courses include Machine Learning Applications, Digital Marketing, Environmental Science, and 12 others. Register through the portal before March 20, 2024. Seats are limited.', author: 'Academic Affairs', department: 'Office of Academic Affairs', date: '2024-03-05', priority: 'medium', category: 'Academic', isRead: false,
    },
  ];

  return { courses, materials, schedule, announcements };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const rawData = user ? generateData(user.id) : {
    courses: [], materials: [], schedule: [], announcements: []
  };

  const announcements = rawData.announcements.map(a => ({
    ...a,
    isRead: a.isRead || readIds.has(a.id),
  }));

  const refetch = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLastUpdated(new Date());
    setIsLoading(false);
  }, [user]);

  const markAnnouncementRead = useCallback((id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  }, []);

  usePolling(refetch, 60000, !!user);

  return (
    <DataContext.Provider value={{
      courses: rawData.courses,
      materials: rawData.materials,
      schedule: rawData.schedule,
      announcements,
      isLoading,
      lastUpdated,
      refetch,
      markAnnouncementRead,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
