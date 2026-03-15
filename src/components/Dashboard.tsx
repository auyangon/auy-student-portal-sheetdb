import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineClipboardCheck,
  HiOutlineClock,
  HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineChevronRight,
  HiOutlineExternalLink,
  HiOutlineLocationMarker,
} from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { DashboardSkeleton } from './LoadingSkeleton';
import {
  formatTime,
  getCountdown,
  getCurrentDayName,
  getGPAColor,
  getAttendanceColor,
  getScheduleTypeColor,
  getCardGradient,
} from '../utils/helpers';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Dashboard() {
  const { student } = useAuth();
  const { enrollments, attendanceSummary, schedule, deadlines, loading, getUnreadCount, getCourseById } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCredits = enrollments.reduce((sum, e) => {
      const course = getCourseById(e.courseId);
      return sum + (course?.credits || 0);
    }, 0);

    const avgAttendance =
      attendanceSummary.length > 0
        ? attendanceSummary.reduce((sum, a) => sum + a.attendancePercentage, 0) / attendanceSummary.length
        : 0;

    return {
      gpa: student?.gpa || 0,
      totalCredits: student?.totalCredits || 0,
      currentCredits: totalCredits,
      attendance: Math.round(avgAttendance),
      unreadAnnouncements: getUnreadCount(),
    };
  }, [student, enrollments, attendanceSummary, getUnreadCount, getCourseById]);

  // Get today's schedule
  const todaySchedule = useMemo(() => {
    const today = getCurrentDayName();
    return schedule
      .filter((s) => s.dayOfWeek === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedule]);

  // Get upcoming deadlines (sorted by date)
  const upcomingDeadlines = useMemo(() => {
    return [...deadlines]
      .filter((d) => !getCountdown(d.dueDate, d.dueTime).isPast)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [deadlines]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="glass-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              Welcome back, {student?.firstName}! 👋
            </h1>
            <p className="text-slate-500 mt-1">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-slate-500">{student?.academicStanding}</p>
              <p className="text-lg font-semibold text-slate-800">{student?.major}</p>
            </div>
            <img
              src={student?.profileImage}
              alt={`${student?.firstName} ${student?.lastName}`}
              className="w-14 h-14 rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GPA */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <HiOutlineAcademicCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-slate-400">Cumulative</span>
          </div>
          <div className="mt-3">
            <p className={`stat-value ${getGPAColor(stats.gpa)}`}>{stats.gpa.toFixed(2)}</p>
            <p className="stat-label">Current GPA</p>
          </div>
        </motion.div>

        {/* Credits */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <HiOutlineClipboardCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-slate-400">This Semester</span>
          </div>
          <div className="mt-3">
            <p className="stat-value text-blue-600">{stats.currentCredits}</p>
            <p className="stat-label">Credits Enrolled</p>
          </div>
        </motion.div>

        {/* Attendance */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
              <HiOutlineClock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-slate-400">Average</span>
          </div>
          <div className="mt-3">
            <p className={`stat-value ${getAttendanceColor(stats.attendance)}`}>
              {stats.attendance}%
            </p>
            <p className="stat-label">Attendance Rate</p>
          </div>
        </motion.div>

        {/* Announcements */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/20">
              <HiOutlineBell className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-slate-400">Unread</span>
          </div>
          <div className="mt-3">
            <p className="stat-value text-rose-500">{stats.unreadAnnouncements}</p>
            <p className="stat-label">Announcements</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Schedule and Deadlines */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50">
                <HiOutlineCalendar className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Today's Schedule</h2>
            </div>
            <span className="text-sm text-slate-400">{getCurrentDayName()}</span>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <HiOutlineCalendar className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">No classes scheduled for today</p>
              <p className="text-sm text-slate-400 mt-1">Enjoy your day off! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((item, index) => {
                const course = getCourseById(item.courseId);
                return (
                  <motion.div
                    key={item.scheduleId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors"
                  >
                    <div
                      className={`w-1.5 h-14 rounded-full ${getScheduleTypeColor(item.type)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {course?.courseName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatTime(item.startTime)} - {formatTime(item.endTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <HiOutlineLocationMarker className="w-4 h-4" />
                        <span>{item.room}</span>
                      </div>
                      <span className="text-xs text-slate-400">{item.type}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-50">
                <HiOutlineClock className="w-5 h-5 text-rose-500" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Upcoming Deadlines</h2>
            </div>
            <span className="text-sm text-slate-400">{upcomingDeadlines.length} items</span>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <HiOutlineClipboardCheck className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">No upcoming deadlines</p>
              <p className="text-sm text-slate-400 mt-1">You're all caught up! ✨</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => {
                const course = getCourseById(deadline.courseId);
                const countdown = getCountdown(deadline.dueDate, deadline.dueTime);
                return (
                  <motion.div
                    key={deadline.deadlineId}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`deadline-card ${countdown.isUrgent ? 'urgent' : ''}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCardGradient(index)} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                    >
                      {deadline.type.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{deadline.title}</p>
                      <p className="text-sm text-slate-500">{course?.courseCode}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          countdown.isUrgent ? 'text-red-500' : 'text-slate-600'
                        }`}
                      >
                        {countdown.label}
                      </p>
                      <p className="text-xs text-slate-400">{deadline.type}</p>
                    </div>
                    {deadline.submissionLink && (
                      <a
                        href={deadline.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-white/50 text-slate-400 hover:text-blue-500 transition-colors"
                      >
                        <HiOutlineExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Course Progress Overview */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50">
              <HiOutlineAcademicCap className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Course Progress</h2>
          </div>
          <span className="text-sm text-slate-400">{enrollments.length} courses</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {enrollments.slice(0, 4).map((enrollment, index) => {
            const course = getCourseById(enrollment.courseId);
            const attendance = attendanceSummary.find((a) => a.courseId === enrollment.courseId);
            const avgScore = Math.round(
              (enrollment.assignmentScore + enrollment.quizScore + enrollment.participationScore) / 3
            );

            return (
              <motion.div
                key={enrollment.enrollmentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getCardGradient(index)} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                    >
                      {course?.courseCode.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{course?.courseCode}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[150px]">
                        {course?.courseName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getAttendanceColor(avgScore)}`}>
                      {enrollment.grade || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Attendance</span>
                    <span className={`font-medium ${getAttendanceColor(attendance?.attendancePercentage || 0)}`}>
                      {attendance?.attendancePercentage?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-bar-fill ${getScheduleTypeColor(course?.status || 'Active')}`}
                      style={{ width: `${attendance?.attendancePercentage || 0}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {enrollments.length > 4 && (
          <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-500 hover:text-blue-600 transition-colors">
            View all courses
            <HiOutlineChevronRight className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
