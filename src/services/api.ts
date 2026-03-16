// API service for Google Apps Script
const API_URL = import.meta.env.VITE_API_URL;

async function fetchSheet(sheetName) {
  try {
    const res = await fetch(`${API_URL}?sheet=${sheetName}`);
    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error);
    return [];
  }
}

export const api = {
  // Users (for login)
  getUsers: () => fetchSheet('Users'),
  
  // Students
  getStudents: () => fetchSheet('Students'),
  
  // Courses
  getCourses: () => fetchSheet('Courses'),
  
  // Enrollments
  getEnrollments: () => fetchSheet('Enrollments'),
  
  // Attendance
  getAttendance: () => fetchSheet('AttendanceSummary'),
  
  // Materials
  getMaterials: () => fetchSheet('Materials'),
  
  // Schedule
  getSchedule: () => fetchSheet('Schedule'),
  
  // Deadlines
  getDeadlines: () => fetchSheet('Deadlines'),
  
  // Announcements
  getAnnouncements: () => fetchSheet('Announcements'),
  
  // Notifications
  getNotifications: () => fetchSheet('StudentNotifications'),
  
  // Auth helper
  authenticateUser: async (email, password) => {
    const users = await api.getUsers();
    return users.find(u => u.email === email && u.password === password) || null;
  },
  
  getStudentByEmail: async (email) => {
    const students = await api.getStudents();
    return students.find(s => s.email === email) || null;
  },
  
  // Get enrollments for a student
  getStudentEnrollments: async (studentId) => {
    const enrollments = await api.getEnrollments();
    return enrollments.filter(e => e.studentId === studentId);
  },
  
  // Get attendance for a student
  getStudentAttendance: async (studentId) => {
    const attendance = await api.getAttendance();
    return attendance.filter(a => a.studentId === studentId);
  },
  
  // Get materials for given course IDs
  getCourseMaterials: async (courseIds) => {
    const materials = await api.getMaterials();
    return materials.filter(m => courseIds.includes(m.courseId));
  },
  
  // Get schedule for given course IDs
  getCourseSchedule: async (courseIds) => {
    const schedule = await api.getSchedule();
    return schedule.filter(s => courseIds.includes(s.courseId));
  },
  
  // Get deadlines for given course IDs
  getCourseDeadlines: async (courseIds) => {
    const deadlines = await api.getDeadlines();
    return deadlines.filter(d => courseIds.includes(d.courseId));
  },
  
  // Get announcements relevant to student (ALL + targeted)
  getStudentAnnouncements: async (courseIds) => {
    const announcements = await api.getAnnouncements();
    return announcements.filter(a => a.targetAudience === 'ALL' || courseIds.includes(a.targetAudience));
  },
  
  // Get notifications for a student
  getNotificationsForStudent: async (studentId) => {
    const notifications = await api.getNotifications();
    return notifications.filter(n => n.studentId === studentId);
  },
  
  // Fetch all data for a student (used by DataContext)
  fetchAllStudentData: async (studentId, courseIds) => {
    const [courses, enrollments, attendance, materials, schedule, deadlines, announcements, notifications] = await Promise.all([
      api.getCourses(),
      api.getStudentEnrollments(studentId),
      api.getStudentAttendance(studentId),
      api.getCourseMaterials(courseIds),
      api.getCourseSchedule(courseIds),
      api.getCourseDeadlines(courseIds),
      api.getStudentAnnouncements(courseIds),
      api.getNotificationsForStudent(studentId)
    ]);
    
    const enrolledCourses = courses.filter(c => courseIds.includes(c.courseId));
    
    return {
      courses: enrolledCourses,
      enrollments,
      attendanceSummary: attendance,
      materials,
      schedule,
      deadlines,
      announcements,
      notifications
    };
  }
};
