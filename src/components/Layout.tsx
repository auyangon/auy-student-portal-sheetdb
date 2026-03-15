import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBookOpen, FiCalendar, FiClock, FiDownload, FiExternalLink, 
  FiHome, FiMenu, FiX, FiBell, FiUser, FiLogOut, FiRefreshCw,
  FiFileText, FiAward, FiPieChart
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useRealtimeData';
import GlassCard from './ui/GlassCard';
import Toast from './ui/Toast';

export default function Layout() {
  const { user, logout } = useAuth();
  const { data, loading, error, refresh, syncing } = useData({ email: user?.email });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleRefresh = async () => {
    await refresh();
    setToast({ message: 'Data synced!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl"
          >
            AU
          </motion.div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <GlassCard className="p-8 text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={refresh} 
            className="px-6 py-2 bg-[#0071e3] text-white rounded-xl hover:bg-[#0077ed]"
          >
            Try Again
          </button>
        </GlassCard>
      </div>
    );
  }

  const { student, enrollments, courses, attendance, announcements, deadlines, materials, schedule, gpa } = data;

  // Calculate attendance percentage
  const attendancePercent = attendance?.length > 0 
    ? Math.round(attendance.reduce((sum, a) => sum + (a.percentage || 0), 0) / attendance.length * 100) / 100
    : 0;

  // Calculate total credits
  const totalCredits = enrollments?.reduce((sum, e) => sum + (e.credits || 3), 0) || 0;

  // Render different tabs
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500">GPA</h3>
                  <FiAward className="text-[#0071e3] text-xl" />
                </div>
                <p className="text-3xl font-semibold">{gpa}</p>
                <p className="text-sm text-gray-400 mt-2">Cumulative</p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500">Credits</h3>
                  <FiBookOpen className="text-[#0071e3] text-xl" />
                </div>
                <p className="text-3xl font-semibold">{totalCredits}</p>
                <p className="text-sm text-gray-400 mt-2">Total Earned</p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500">Attendance</h3>
                  <FiPieChart className="text-[#0071e3] text-xl" />
                </div>
                <p className="text-3xl font-semibold">{attendancePercent}%</p>
                <p className="text-sm text-gray-400 mt-2">Overall</p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500">Courses</h3>
                  <FiBookOpen className="text-[#0071e3] text-xl" />
                </div>
                <p className="text-3xl font-semibold">{courses?.length || 0}</p>
                <p className="text-sm text-gray-400 mt-2">Enrolled</p>
              </GlassCard>
            </div>

            {/* Welcome Card & Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h2 className="text-2xl font-semibold mb-2">Welcome, {student?.studentName || 'Student'}!</h2>
                <p className="text-gray-600">Student ID: {student?.studentId}</p>
                <p className="text-gray-600">Major: {student?.major}</p>
                <div className="mt-4 flex gap-4">
                  <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-600">
                    {enrollments?.length || 0} Active Courses
                  </div>
                  <div className="bg-green-50 px-3 py-1 rounded-full text-sm text-green-600">
                    {deadlines?.length || 0} Upcoming Deadlines
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiClock className="text-[#0071e3]" /> Today's Schedule
                </h3>
                {schedule?.filter(s => {
                  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                  return s.dayOfWeek === today;
                }).map((s, i) => {
                  const course = courses?.find(c => c.courseId === s.courseId);
                  return (
                    <div key={i} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <p className="font-medium">{course?.courseName || s.courseId}</p>
                      <p className="text-sm text-gray-500">{s.startTime} - {s.endTime} • {s.room} with {s.instructor}</p>
                    </div>
                  );
                }) || <p className="text-gray-400">No classes today</p>}
                {schedule?.filter(s => s.dayOfWeek === new Date().toLocaleDateString('en-US', { weekday: 'long' })).length === 0 && (
                  <p className="text-gray-400">No classes today</p>
                )}
              </GlassCard>
            </div>

            {/* Upcoming Deadlines */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">📝 Upcoming Deadlines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deadlines?.slice(0, 3).map((d, i) => {
                  const course = courses?.find(c => c.courseId === d.courseId);
                  return (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-medium">{d.title}</p>
                      <p className="text-sm text-gray-600">{course?.courseName || d.courseId}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                          Due: {new Date(d.dueDate).toLocaleDateString()}
                        </span>
                        {d.weight && <span className="text-xs text-gray-400">{d.weight * 100}%</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">My Courses ({courses?.length || 0})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.map(course => {
                const enrollment = enrollments?.find(e => e.courseId === course.courseId);
                const courseAttendance = attendance?.find(a => a.courseId === course.courseId);
                return (
                  <GlassCard key={course.courseId} className="p-6" hover>
                    <h3 className="text-xl font-semibold mb-2">{course.courseName}</h3>
                    <p className="text-gray-600 mb-1">{course.teacher}</p>
                    <p className="text-sm text-gray-400 mb-4">Course ID: {course.courseId}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Grade</p>
                        <p className="text-xl font-semibold text-[#0071e3]">{enrollment?.grade || 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Credits</p>
                        <p className="text-xl font-semibold">{course.credits}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Attendance</p>
                        <p className="text-xl font-semibold">{courseAttendance?.percentage || 0}%</p>
                      </div>
                    </div>

                    <a 
                      href={course.googleClassroomLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0071e3] text-white rounded-xl hover:bg-[#0077ed] transition-colors"
                    >
                      Go to Classroom <FiExternalLink />
                    </a>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        );

      case 'materials':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Course Materials ({materials?.length || 0})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials?.map(material => {
                const course = courses?.find(c => c.courseId === material.courseId);
                return (
                  <GlassCard key={material.materialId} className="p-6" hover>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {material.type}
                      </span>
                      <span className="text-xs text-gray-400">{material.week}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{course?.courseName}</p>
                    <p className="text-xs text-gray-400 mb-4">{material.uploadedBy}</p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{material.description}</p>
                    <a 
                      href={material.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <FiDownload /> Download
                    </a>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        );

      case 'schedule':
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Weekly Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {days.map(day => (
                <GlassCard key={day} className="p-4">
                  <h3 className="font-semibold mb-4 text-center pb-2 border-b">{day}</h3>
                  {schedule?.filter(s => s.dayOfWeek === day).map((s, i) => {
                    const course = courses?.find(c => c.courseId === s.courseId);
                    return (
                      <div key={i} className="mb-3 p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-sm">{course?.courseName || s.courseId}</p>
                        <p className="text-xs text-gray-600">{s.startTime} - {s.endTime}</p>
                        <p className="text-xs text-gray-400">{s.room} • {s.type}</p>
                      </div>
                    );
                  })}
                  {schedule?.filter(s => s.dayOfWeek === day).length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">No classes</p>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        );

      case 'announcements':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Announcements ({announcements?.length || 0})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {announcements?.map(announcement => (
                <GlassCard key={announcement.id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-800' : 
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {announcement.priority}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{announcement.title}</h3>
                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">{announcement.content}</p>
                  <p className="text-sm text-gray-400">— {announcement.author}</p>
                  {announcement.targetCourses !== 'ALL' && (
                    <p className="text-xs text-blue-600 mt-2">For: {announcement.targetCourses}</p>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-gray-900">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-white/20 z-30 px-4 py-3 flex justify-between items-center">
        <button onClick={() => setSidebarOpen(true)} className="p-2">
          <FiMenu size={24} />
        </button>
        <h1 className="font-semibold">AUY Portal</h1>
        <button onClick={handleRefresh} className="p-2">
          <FiRefreshCw className={syncing ? 'animate-spin' : ''} size={20} />
        </button>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex fixed top-0 right-0 left-72 bg-white/80 backdrop-blur-xl border-b border-white/20 z-30 px-8 py-4 justify-between items-center">
        <h1 className="text-xl font-semibold capitalize">{activeTab}</h1>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <FiRefreshCw className={syncing ? 'animate-spin' : ''} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed top-0 left-0 h-full w-72 bg-white/90 backdrop-blur-xl border-r border-white/20 z-40 shadow-xl"
          >
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  AU
                </div>
                <div>
                  <h2 className="font-semibold">AUY Portal</h2>
                  <p className="text-xs text-gray-400">Student Dashboard</p>
                </div>
              </div>

              {/* User Info */}
              <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {student?.studentName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-semibold">{student?.studentName || 'Student'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: FiHome },
                  { id: 'courses', label: 'Courses', icon: FiBookOpen },
                  { id: 'materials', label: 'Materials', icon: FiDownload },
                  { id: 'schedule', label: 'Schedule', icon: FiCalendar },
                  { id: 'announcements', label: 'Announcements', icon: FiBell },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === item.id 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Logout */}
              <button 
                onClick={logout}
                className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className={`lg:ml-72 min-h-screen transition-all ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="p-6 pt-20 lg:pt-24">
          {renderContent()}
        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
