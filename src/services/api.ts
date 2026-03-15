// GOOGLE APPS SCRIPT API - 100% FREE!
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzi52wm_4gc169SLMkNtLcydSDFsz_KjuJEOp94I8stnhE0P3YC8Nfl7_jVbtqICxHqiA/exec';

export const api = {
  // Helper function for all sheets
  fetchSheet: async (sheetName) => {
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?sheet=${sheetName}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        console.error(`Error fetching ${sheetName}:`, result.error);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching ${sheetName}:`, error);
      return [];
    }
  },

  // Individual sheet functions
  getUsers: async () => api.fetchSheet('Users'),
  getStudents: async () => api.fetchSheet('Students'),
  getCourses: async () => api.fetchSheet('Courses'),
  getEnrollments: async () => api.fetchSheet('Enrollments'),
  getAttendance: async () => api.fetchSheet('AttendanceSummary'),
  getMaterials: async () => api.fetchSheet('Materials'),
  getSchedule: async () => api.fetchSheet('Schedule'),
  getDeadlines: async () => api.fetchSheet('Deadlines'),
  getAnnouncements: async () => api.fetchSheet('Announcements'),
  getStudentNotifications: async () => api.fetchSheet('StudentNotifications'),

  // Advanced features
  getWithFilter: async (sheetName, filterBy, filterValue) => {
    const response = await fetch(`${APPS_SCRIPT_URL}?sheet=${sheetName}&filterBy=${filterBy}&filterValue=${filterValue}`);
    const result = await response.json();
    return result.success ? result.data : [];
  },

  getWithSearch: async (sheetName, searchTerm) => {
    const response = await fetch(`${APPS_SCRIPT_URL}?sheet=${sheetName}&search=${searchTerm}`);
    const result = await response.json();
    return result.success ? result.data : [];
  },

  testConnection: async () => {
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?sheet=Users`);
      const result = await response.json();
      return result.success === true;
    } catch {
      return false;
    }
  }
};
