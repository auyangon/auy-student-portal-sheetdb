// COMPLETE API SERVICE - With ALL functions
const SHEETDB_URL = import.meta.env.VITE_SHEETDB_URL || 'https://sheetdb.io/api/v1/gd21pj5b246g5';

// Helper function for fetching
async function fetchSheet(sheetName) {
  try {
    console.log(`📡 Fetching ${sheetName}...`);
    const response = await fetch(`${SHEETDB_URL}?sheet=${sheetName}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(`✅ ${sheetName}:`, data?.length || 0, 'records');
    return data || [];
  } catch (error) {
    console.error(`❌ Error fetching ${sheetName}:`, error);
    return [];
  }
}

export const api = {
  // USERS
  getUsers: async () => fetchSheet('Users'),
  
  // STUDENTS
  getStudents: async () => fetchSheet('Students'),
  
  // COURSES
  getCourses: async () => fetchSheet('Courses'),
  
  // ENROLLMENTS
  getEnrollments: async () => fetchSheet('Enrollments'),
  
  // ATTENDANCE
  getAttendance: async () => fetchSheet('AttendanceSummary'),
  
  // MATERIALS
  getMaterials: async () => fetchSheet('Materials'),
  
  // SCHEDULE
  getSchedule: async () => fetchSheet('Schedule'),
  
  // DEADLINES
  getDeadlines: async () => fetchSheet('Deadlines'),
  
  // ANNOUNCEMENTS
  getAnnouncements: async () => fetchSheet('Announcements'),
  
  // NOTIFICATIONS
  getStudentNotifications: async () => fetchSheet('StudentNotifications'),
  
  // TEST CONNECTION
  testConnection: async () => {
    try {
      const response = await fetch(SHEETDB_URL);
      return response.ok;
    } catch {
      return false;
    }
  }
};
