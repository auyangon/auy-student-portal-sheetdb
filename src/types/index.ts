export interface User {
  email: string;
  password: string;
  studentId?: string;
  role?: string;
}

export interface Student {
  studentId: string;
  email: string;
  studentName: string;
  major: string;
  studyMode: string;
  status: string;
}

export interface Course {
  courseId: string;
  courseName: string;
  credits: number;
  teacher: string;
  googleClassroomLink: string;
}

export interface Enrollment {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  email: string;
  courseId: string;
  courseName: string;
  teacherName: string;
  credits: number;
  grade: string;
  googleClassroomLink: string;
  attendance?: string;
  lastUpdated: string;
}

export interface Attendance {
  studentId: string;
  courseId: string;
  totalClasses: number;
  present: number;
  late: number;
  absent: number;
  percentage: number;
  lastUpdated: string;
}

export interface Material {
  materialId: string;
  courseId: string;
  title: string;
  type: string;
  description: string;
  fileUrl: string;
  uploadedBy: string;
  uploadDate: string;
  week: string;
  tags: string;
}

export interface Schedule {
  scheduleId: string;
  courseId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
  type: string;
  recurring: string;
  startDate: string;
  endDate: string;
}

export interface Deadline {
  deadlineId: string;
  courseId: string;
  title: string;
  type: string;
  dueDate: string;
  dueTime: string;
  weight: number;
  description: string;
  submissionLink: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: string;
  category: string;
  targetCourses: string;
}

export interface StudentNotification {
  studentId: string;
  email: string;
  announcementId: string;
  read: string;
  readAt: string;
}

export interface AuthUser {
  email: string;
  studentId: string;
  studentName?: string;
  major?: string;
}
