import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePolling } from '../hooks/usePolling';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

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

// Helper to map API data to UI format
function mapCourse(apiCourse: any, enrollment: any, color: string): Course {
  return {
    id: apiCourse.courseId,
    code: apiCourse.courseCode,
    name: apiCourse.courseName,
    instructor: apiCourse.instructor,
    credits: apiCourse.credits,
    grade: enrollment?.grade || '',
    gradePoints: 0, // Compute from grade later
    progress: 0, // Compute from attendance/materials
    color: color,
    schedule: apiCourse.schedule,
    room: apiCourse.room,
    enrolled: 0, // Not in sheet
    capacity: 0, // Not in sheet
  };
}

function mapMaterial(apiMaterial: any, courseName: string): Material {
  return {
    id: apiMaterial.materialId,
    courseId: apiMaterial.courseId,
    courseName: courseName,
    title: apiMaterial.title,
    type: apiMaterial.type as any,
    size: apiMaterial.fileSize || '—',
    uploadedAt: apiMaterial.uploadDate,
    instructor: apiMaterial.uploadedBy,
    url: apiMaterial.fileLink,
  };
}

function mapSchedule(apiSchedule: any, courseName: string, color: string): ScheduleItem {
  return {
    id: apiSchedule.scheduleId,
    courseId: apiSchedule.courseId,
    courseName: courseName,
    instructor: apiSchedule.instructor,
    day: apiSchedule.dayOfWeek,
    startTime: apiSchedule.startTime,
    endTime: apiSchedule.endTime,
    room: apiSchedule.room,
    color: color,
    type: apiSchedule.type as any,
  };
}

function mapAnnouncement(apiAnnouncement: any): Announcement {
  return {
    id: apiAnnouncement.announcementId,
    title: apiAnnouncement.title,
    body: apiAnnouncement.content,
    author: apiAnnouncement.author,
    department: apiAnnouncement.category,
    date: apiAnnouncement.publishDate,
    priority: apiAnnouncement.priority.toLowerCase() as any,
    category: apiAnnouncement.category as any,
    isRead: false, // Will be set by notifications later
  };
}

const colors = ['#60a5fa', '#818cf8', '#c084fc', '#34d399', '#fb923c', '#f472b6'];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Get enrollments first to know which courses the student is in
      const enrollments = await api.getStudentEnrollments(user.id);
      const courseIds = enrollments.map(e => e.courseId);
      
      // Fetch all data
      const data = await api.fetchAllStudentData(user.id, courseIds);
      
      // Map courses
      const mappedCourses = data.courses.map((c, idx) => 
        mapCourse(c, enrollments.find(e => e.courseId === c.courseId), colors[idx % colors.length])
      );
      setCourses(mappedCourses);
      
      // Map materials
      const mappedMaterials = data.materials.map(m => 
        mapMaterial(m, mappedCourses.find(c => c.id === m.courseId)?.name || '')
      );
      setMaterials(mappedMaterials);
      
      // Map schedule
      const mappedSchedule = data.schedule.map(s => 
        mapSchedule(s, mappedCourses.find(c => c.id === s.courseId)?.name || '', 
                   mappedCourses.find(c => c.id === s.courseId)?.color || '#60a5fa')
      );
      setSchedule(mappedSchedule);
      
      // Map announcements
      const mappedAnnouncements = data.announcements.map(mapAnnouncement);
      // Apply read status from notifications
      const notificationMap = new Map(data.notifications.map(n => [n.announcementId, n.isRead]));
      const announcementsWithRead = mappedAnnouncements.map(a => ({
        ...a,
        isRead: notificationMap.get(a.id) || readIds.has(a.id) || false,
      }));
      setAnnouncements(announcementsWithRead);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, readIds]);

  // Initial fetch and polling
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  usePolling(fetchData, 60000, !!user);

  const markAnnouncementRead = useCallback((id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  }, []);

  return (
    <DataContext.Provider value={{
      courses,
      materials,
      schedule,
      announcements,
      isLoading,
      lastUpdated,
      refetch: fetchData,
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
