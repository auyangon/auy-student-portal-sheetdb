import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineExternalLink,
  HiOutlineX,
  HiOutlineChartBar,
  HiOutlineClipboardCheck,
  HiOutlineBookOpen,
} from 'react-icons/hi';
import { useData } from '../contexts/DataContext';
import { CoursesSkeleton } from './LoadingSkeleton';
import {
  getCardGradient,
  getGradeColor,
  getGradeBgColor,
  getAttendanceColor,
  getAttendanceBgColor,
} from '../utils/helpers';
import { Course, Enrollment, AttendanceSummary } from '../types';

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

interface CourseModalProps {
  course: Course;
  enrollment: Enrollment | undefined;
  attendance: AttendanceSummary | undefined;
  onClose: () => void;
}

function CourseModal({ course, enrollment, attendance, onClose }: CourseModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${getCardGradient(0)} text-white rounded-t-2xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
          <p className="text-sm font-medium opacity-80">{course.courseCode}</p>
          <h2 className="text-2xl font-bold mt-1">{course.courseName}</h2>
          <p className="mt-2 opacity-90">{course.description}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-slate-50">
              <p className={`text-2xl font-bold ${getGradeColor(enrollment?.grade || '')}`}>
                {enrollment?.grade || 'N/A'}
              </p>
              <p className="text-sm text-slate-500">Current Grade</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-50">
              <p className={`text-2xl font-bold ${getAttendanceColor(attendance?.attendancePercentage || 0)}`}>
                {attendance?.attendancePercentage?.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-slate-500">Attendance</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-50">
              <p className="text-2xl font-bold text-blue-500">{course.credits}</p>
              <p className="text-sm text-slate-500">Credits</p>
            </div>
          </div>

          {/* Course Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <HiOutlineBookOpen className="w-5 h-5 text-blue-500" />
                Course Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <HiOutlineClock className="w-4 h-4 text-slate-400" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                  <span>{course.room}, {course.building}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <HiOutlineAcademicCap className="w-4 h-4 text-slate-400" />
                  <span>{course.department}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <HiOutlineUser className="w-5 h-5 text-purple-500" />
                Instructor
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <HiOutlineUser className="w-4 h-4 text-slate-400" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <HiOutlineMail className="w-4 h-4 text-slate-400" />
                  <a
                    href={`mailto:${course.instructorEmail}`}
                    className="text-blue-500 hover:underline"
                  >
                    {course.instructorEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Grade Breakdown */}
          {enrollment && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <HiOutlineChartBar className="w-5 h-5 text-emerald-500" />
                Grade Breakdown
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-blue-50">
                  <p className="text-lg font-bold text-blue-600">{enrollment.assignmentScore}%</p>
                  <p className="text-xs text-slate-500">Assignments</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50">
                  <p className="text-lg font-bold text-purple-600">{enrollment.quizScore}%</p>
                  <p className="text-xs text-slate-500">Quizzes</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50">
                  <p className="text-lg font-bold text-emerald-600">{enrollment.participationScore}%</p>
                  <p className="text-xs text-slate-500">Participation</p>
                </div>
              </div>
              {enrollment.midtermGrade && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50">
                  <span className="text-sm text-slate-600">Midterm Grade:</span>
                  <span className={`font-bold ${getGradeColor(enrollment.midtermGrade)}`}>
                    {enrollment.midtermGrade}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Attendance Details */}
          {attendance && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <HiOutlineClipboardCheck className="w-5 h-5 text-amber-500" />
                Attendance Record
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-3 rounded-xl bg-emerald-50">
                  <p className="text-lg font-bold text-emerald-600">{attendance.classesAttended}</p>
                  <p className="text-xs text-slate-500">Attended</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-red-50">
                  <p className="text-lg font-bold text-red-600">{attendance.classesAbsent}</p>
                  <p className="text-xs text-slate-500">Absent</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-amber-50">
                  <p className="text-lg font-bold text-amber-600">{attendance.classesExcused}</p>
                  <p className="text-xs text-slate-500">Excused</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-100">
                  <p className="text-lg font-bold text-slate-600">{attendance.totalClasses}</p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-bar-fill ${getAttendanceBgColor(attendance.attendancePercentage)}`}
                  style={{ width: `${attendance.attendancePercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-3">
            {course.googleClassroomLink && (
              <a
                href={course.googleClassroomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-shadow"
              >
                <HiOutlineExternalLink className="w-5 h-5" />
                Google Classroom
              </a>
            )}
            {course.syllabusLink && (
              <a
                href={course.syllabusLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-white/50 transition-colors"
              >
                <HiOutlineBookOpen className="w-5 h-5" />
                Syllabus
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Courses() {
  const { enrollments, loading, getCourseById, getEnrollmentByCourseId, getAttendanceByCourseId } = useData();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const enrolledCourses = useMemo(() => {
    return enrollments.map((e) => ({
      enrollment: e,
      course: getCourseById(e.courseId),
      attendance: getAttendanceByCourseId(e.courseId),
    })).filter((item) => item.course);
  }, [enrollments, getCourseById, getAttendanceByCourseId]);

  if (loading) {
    return <CoursesSkeleton />;
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Courses</h1>
            <p className="text-slate-500 mt-1">
              {enrolledCourses.length} courses enrolled this semester
            </p>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {enrolledCourses.map(({ course, enrollment, attendance }, index) => (
            <motion.div
              key={course!.courseId}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="course-card"
              onClick={() => setSelectedCourse(course!)}
            >
              {/* Card Header */}
              <div className={`-mx-6 -mt-6 p-4 bg-gradient-to-r ${getCardGradient(index)} text-white rounded-t-2xl`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">{course!.courseCode}</p>
                    <h3 className="text-lg font-bold mt-1">{course!.courseName}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getGradeBgColor(enrollment.grade)} border bg-white/20 text-white`}
                  >
                    {enrollment.grade || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="mt-4 space-y-4">
                {/* Instructor */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <HiOutlineUser className="w-4 h-4 text-slate-400" />
                  <span>{course!.instructor}</span>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <HiOutlineClock className="w-4 h-4 text-slate-400" />
                  <span>{course!.schedule}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                  <span>{course!.room}</span>
                </div>

                {/* Attendance Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-500">Attendance</span>
                    <span className={`font-medium ${getAttendanceColor(attendance?.attendancePercentage || 0)}`}>
                      {attendance?.attendancePercentage?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-bar-fill ${getAttendanceBgColor(attendance?.attendancePercentage || 0)}`}
                      style={{ width: `${attendance?.attendancePercentage || 0}%` }}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <HiOutlineAcademicCap className="w-4 h-4" />
                    <span>{course!.credits} credits</span>
                  </div>
                  {course!.googleClassroomLink && (
                    <a
                      href={course!.googleClassroomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                    >
                      <HiOutlineExternalLink className="w-4 h-4" />
                      Classroom
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Course Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <CourseModal
            course={selectedCourse}
            enrollment={getEnrollmentByCourseId(selectedCourse.courseId)}
            attendance={getAttendanceByCourseId(selectedCourse.courseId)}
            onClose={() => setSelectedCourse(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Courses;
