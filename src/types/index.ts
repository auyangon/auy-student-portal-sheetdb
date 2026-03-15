// User authentication types
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'student' | 'admin' | 'faculty';
  createdAt: string;
}

// Student information
export interface Student {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  major: string;
  minor: string;
  enrollmentDate: string;
  expectedGraduation: string;
  gpa: number;
  totalCredits: number;
  academicStanding: 'Good Standing' | 'Probation' | 'Dean\'s List';
  advisorName: string;
  advisorEmail: string;
  profileImage: string;
}

// Course information
export interface Course {
  courseId: string;
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  department: string;
  instructor: string;
  instructorEmail: string;
  semester: string;
  year: number;
  schedule: string;
  room: string;
  building: string;
  maxEnrollment: number;
  currentEnrollment: number;
  googleClassroomLink: string;
  syllabusLink: string;
  status: 'Active' | 'Completed' | 'Upcoming';
}

// Student enrollment in courses
export interface Enrollment {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  status: 'Active' | 'Completed' | 'Dropped' | 'Withdrawn';
  grade: string;
  gradePoints: number;
  midtermGrade: string;
  finalGrade: string;
  assignmentScore: number;
  quizScore: number;
  participationScore: number;
}

// Attendance summary
export interface AttendanceSummary {
  attendanceId: string;
  studentId: string;
  courseId: string;
  totalClasses: number;
  classesAttended: number;
  classesAbsent: number;
  classesExcused: number;
  attendancePercentage: number;
  lastUpdated: string;
}

// Course materials
export interface Material {
  materialId: string;
  courseId: string;
  title: string;
  description: string;
  type: 'Lecture Notes' | 'Slides' | 'Video' | 'Assignment' | 'Reading' | 'Quiz' | 'Exam' | 'Resource';
  fileLink: string;
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  weekNumber: number;
  tags: string;
  isRequired: boolean;
  dueDate: string;
}

// Schedule entries
export interface ScheduleEntry {
  scheduleId: string;
  courseId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  room: string;
  building: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar' | 'Office Hours';
  instructor: string;
  isRecurring: boolean;
  notes: string;
}

// Deadlines
export interface Deadline {
  deadlineId: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  type: 'Assignment' | 'Quiz' | 'Exam' | 'Project' | 'Presentation' | 'Report';
  weight: number;
  status: 'Upcoming' | 'Due Soon' | 'Overdue' | 'Completed';
  submissionLink: string;
  maxScore: number;
}

// Announcements
export interface Announcement {
  announcementId: string;
  courseId: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  publishDate: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  targetAudience: 'ALL' | string; // 'ALL' or specific courseId
  expiryDate: string;
  attachmentLink: string;
  category: 'General' | 'Academic' | 'Event' | 'Administrative' | 'Emergency';
}

// Student notifications
export interface StudentNotification {
  notificationId: string;
  studentId: string;
  announcementId: string;
  isRead: boolean;
  readAt: string;
  isArchived: boolean;
}

// Auth context types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  student: Student | null;
  loading: boolean;
  error: string | null;
}

// Data context types
export interface DataState {
  courses: Course[];
  enrollments: Enrollment[];
  attendanceSummary: AttendanceSummary[];
  materials: Material[];
  schedule: ScheduleEntry[];
  deadlines: Deadline[];
  announcements: Announcement[];
  notifications: StudentNotification[];
  loading: boolean;
  lastUpdated: Date | null;
  error: string | null;
}
