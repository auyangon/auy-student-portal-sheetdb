const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL || 'https://sheetdb.io/api/v1/gd21pj5b246g5';

export const api = {
  // Users (for login)
  getUsers: async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}?sheet=Users`);
      if (!response.ok) throw new Error('Failed to fetch Users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Users:', error);
      return [];
    }
  },

  // Students
  getStudents: async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}?sheet=Students`);
      if (!response.ok) throw new Error('Failed to fetch Students');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Students:', error);
      return [];
    }
  },

  // Courses
  getCourses: async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}?sheet=Courses`);
      if (!response.ok) throw new Error('Failed to fetch Courses');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Courses:', error);
      return [];
    }
  },

  // Enrollments (with grades)
  getEnrollments: async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}?sheet=Enrollments`);
      if (!response.ok) throw new Error('Failed to fetch Enrollments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Enrollments:', error);
      return [];
    }
  },

  // Attendance
  getAttendance: async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}?sheet=AttendanceSummary`);
      if (!response.ok) throw new Error('Failed to fetch Attendance');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Attendance:', error);
      return [];
    }
  },

  // Materials
  getMaterials: async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}?sheet=Materials`);
      if (!response.ok) throw new Error('Failed to fetch Materials');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Materials:', error);
      return [];
    }
  },

  // Schedule
  getSchedule: async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}?sheet=Schedule`);
      if (!response.ok) throw new Error('Failed to fetch Schedule');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Schedule:', error);
      return [];
    }
  },

  // Deadlines
  getDeadlines: async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}?sheet=Deadlines`);
      if (!response.ok) throw new Error('Failed to fetch Deadlines');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Deadlines:', error);
      return [];
    }
  },

  // Announcements
  getAnnouncements: async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}?sheet=Announcements`);
      if (!response.ok) throw new Error('Failed to fetch Announcements');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Announcements:', error);
      return [];
    }
  },

  // Student Notifications
  getStudentNotifications: async () => {
    try {
      const response = await fetch(`${SHEETDB_URL}?sheet=StudentNotifications`);
      if (!response.ok) throw new Error('Failed to fetch Notifications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Notifications:', error);
      return [];
    }
  },

  // Test connection
  testConnection: async () => {
    try {
      const response = await fetch(SHEETDB_URL);
      return response.ok;
    } catch {
      return false;
    }
  }
};
