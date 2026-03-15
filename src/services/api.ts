// OPENSHEET API SERVICE - 100% FREE!
const OPENSHEET_URL = 'https://opensheet.elk.sh/1ZUC_FHzW3Y_KlmOMUHRbwS8IQivySeuLwMrb4XM0Wq0';

export const api = {
  // Users
  getUsers: async () => {
    const response = await fetch(${OPENSHEET_URL}/Users);
    return response.json();
  },

  // Students
  getStudents: async () => {
    const response = await fetch(${OPENSHEET_URL}/Students);
    return response.json();
  },

  // Courses
  getCourses: async () => {
    const response = await fetch(${OPENSHEET_URL}/Courses);
    return response.json();
  },

  // Enrollments
  getEnrollments: async () => {
    const response = await fetch(${OPENSHEET_URL}/Enrollments);
    return response.json();
  },

  // Attendance
  getAttendance: async () => {
    const response = await fetch(${OPENSHEET_URL}/AttendanceSummary);
    return response.json();
  },

  // Materials
  getMaterials: async () => {
    const response = await fetch(${OPENSHEET_URL}/Materials);
    return response.json();
  },

  // Schedule
  getSchedule: async () => {
    const response = await fetch(${OPENSHEET_URL}/Schedule);
    return response.json();
  },

  // Deadlines
  getDeadlines: async () => {
    const response = await fetch(${OPENSHEET_URL}/Deadlines);
    return response.json();
  },

  // Announcements
  getAnnouncements: async () => {
    const response = await fetch(${OPENSHEET_URL}/Announcements);
    return response.json();
  },

  // Notifications
  getStudentNotifications: async () => {
    const response = await fetch(${OPENSHEET_URL}/StudentNotifications);
    return response.json();
  },

  // Test connection
  testConnection: async () => {
    try {
      const response = await fetch(${OPENSHEET_URL}/Users);
      return response.ok;
    } catch {
      return false;
    }
  }
};
