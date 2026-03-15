import {
  User,
  Student,
  Course,
  Enrollment,
  AttendanceSummary,
  Material,
  ScheduleEntry,
  Deadline,
  Announcement,
  StudentNotification,
} from '../types';
import {
  mockUsers,
  mockStudents,
  mockCourses,
  mockEnrollments,
  mockAttendanceSummary,
  mockMaterials,
  mockSchedule,
  mockDeadlines,
  mockAnnouncements,
  mockStudentNotifications,
} from '../data/mockData';

// SheetDB API configuration
const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL || '';
const USE_MOCK_DATA = !SHEETDB_URL;

// Generic fetch function for SheetDB
async function fetchSheet<T>(sheetName: string): Promise<T[]> {
  if (USE_MOCK_DATA) {
    // Return mock data based on sheet name
    switch (sheetName) {
      case 'Users':
        return mockUsers as unknown as T[];
      case 'Students':
        return mockStudents as unknown as T[];
      case 'Courses':
        return mockCourses as unknown as T[];
      case 'Enrollments':
        return mockEnrollments as unknown as T[];
      case 'AttendanceSummary':
        return mockAttendanceSummary as unknown as T[];
      case 'Materials':
        return mockMaterials as unknown as T[];
      case 'Schedule':
        return mockSchedule as unknown as T[];
      case 'Deadlines':
        return mockDeadlines as unknown as T[];
      case 'Announcements':
        return mockAnnouncements as unknown as T[];
      case 'StudentNotifications':
        return mockStudentNotifications as unknown as T[];
      default:
        return [];
    }
  }

  try {
    const response = await fetch(`${SHEETDB_URL}?sheet=${sheetName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${sheetName}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error);
    // Fallback to mock data on error
    return fetchSheet<T>(sheetName);
  }
}

// API functions
export const api = {
  // Authentication
  async getUsers(): Promise<User[]> {
    return fetchSheet<User>('Users');
  },

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const users = await this.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    return user || null;
  },

  // Students
  async getStudents(): Promise<Student[]> {
    return fetchSheet<Student>('Students');
  },

  async getStudentByEmail(email: string): Promise<Student | null> {
    const students = await this.getStudents();
    return students.find((s) => s.email.toLowerCase() === email.toLowerCase()) || null;
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    return fetchSheet<Course>('Courses');
  },

  // Enrollments
  async getEnrollments(): Promise<Enrollment[]> {
    return fetchSheet<Enrollment>('Enrollments');
  },

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    const enrollments = await this.getEnrollments();
    return enrollments.filter((e) => e.studentId === studentId);
  },

  // Attendance
  async getAttendanceSummary(): Promise<AttendanceSummary[]> {
    return fetchSheet<AttendanceSummary>('AttendanceSummary');
  },

  async getStudentAttendance(studentId: string): Promise<AttendanceSummary[]> {
    const attendance = await this.getAttendanceSummary();
    return attendance.filter((a) => a.studentId === studentId);
  },

  // Materials
  async getMaterials(): Promise<Material[]> {
    return fetchSheet<Material>('Materials');
  },

  async getCourseMaterials(courseIds: string[]): Promise<Material[]> {
    const materials = await this.getMaterials();
    return materials.filter((m) => courseIds.includes(m.courseId));
  },

  // Schedule
  async getSchedule(): Promise<ScheduleEntry[]> {
    return fetchSheet<ScheduleEntry>('Schedule');
  },

  async getCourseSchedule(courseIds: string[]): Promise<ScheduleEntry[]> {
    const schedule = await this.getSchedule();
    return schedule.filter((s) => courseIds.includes(s.courseId));
  },

  // Deadlines
  async getDeadlines(): Promise<Deadline[]> {
    return fetchSheet<Deadline>('Deadlines');
  },

  async getCourseDeadlines(courseIds: string[]): Promise<Deadline[]> {
    const deadlines = await this.getDeadlines();
    return deadlines.filter((d) => courseIds.includes(d.courseId));
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return fetchSheet<Announcement>('Announcements');
  },

  async getStudentAnnouncements(courseIds: string[]): Promise<Announcement[]> {
    const announcements = await this.getAnnouncements();
    return announcements.filter(
      (a) => a.targetAudience === 'ALL' || courseIds.includes(a.targetAudience)
    );
  },

  // Notifications
  async getStudentNotifications(): Promise<StudentNotification[]> {
    return fetchSheet<StudentNotification>('StudentNotifications');
  },

  async getNotificationsForStudent(studentId: string): Promise<StudentNotification[]> {
    const notifications = await this.getStudentNotifications();
    return notifications.filter((n) => n.studentId === studentId);
  },

  // Fetch all data for a student
  async fetchAllStudentData(studentId: string, courseIds: string[]) {
    const [
      courses,
      enrollments,
      attendance,
      materials,
      schedule,
      deadlines,
      announcements,
      notifications,
    ] = await Promise.all([
      this.getCourses(),
      this.getStudentEnrollments(studentId),
      this.getStudentAttendance(studentId),
      this.getCourseMaterials(courseIds),
      this.getCourseSchedule(courseIds),
      this.getCourseDeadlines(courseIds),
      this.getStudentAnnouncements(courseIds),
      this.getNotificationsForStudent(studentId),
    ]);

    // Filter courses to only enrolled ones
    const enrolledCourses = courses.filter((c) => courseIds.includes(c.courseId));

    return {
      courses: enrolledCourses,
      enrollments,
      attendanceSummary: attendance,
      materials,
      schedule,
      deadlines,
      announcements,
      notifications,
    };
  },
};

export default api;
