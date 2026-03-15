import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
} from 'react-icons/hi';
import { useData } from '../contexts/DataContext';
import { ScheduleSkeleton } from './LoadingSkeleton';
import {
  formatTime,
  getScheduleTypeColor,
  getCurrentDayName,
} from '../utils/helpers';
import { ScheduleEntry } from '../types';

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

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

interface ScheduleBlockProps {
  entry: ScheduleEntry;
  courseName: string;
  courseCode: string;
}

function ScheduleBlock({ entry, courseName, courseCode }: ScheduleBlockProps) {
  const startHour = parseInt(entry.startTime.split(':')[0], 10);
  const endHour = parseInt(entry.endTime.split(':')[0], 10);
  const duration = endHour - startHour;
  const top = (startHour - 8) * 60; // 60px per hour
  const height = duration * 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      className={`absolute left-1 right-1 rounded-lg p-2 ${getScheduleTypeColor(
        entry.type
      )} text-white shadow-lg cursor-pointer overflow-hidden`}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        minHeight: '50px',
      }}
    >
      <div className="text-xs font-medium opacity-90">{courseCode}</div>
      <div className="text-sm font-semibold truncate">{courseName}</div>
      <div className="flex items-center gap-1 text-xs opacity-80 mt-1">
        <HiOutlineClock className="w-3 h-3" />
        {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
      </div>
      <div className="flex items-center gap-1 text-xs opacity-80">
        <HiOutlineLocationMarker className="w-3 h-3" />
        {entry.room}
      </div>
      {entry.notes && (
        <div className="text-xs mt-1 opacity-80 truncate">{entry.notes}</div>
      )}
    </motion.div>
  );
}

export function Schedule() {
  const { schedule, loading, getCourseById } = useData();
  const currentDay = getCurrentDayName();

  // Group schedule by day
  const scheduleByDay = useMemo(() => {
    const grouped: { [key: string]: ScheduleEntry[] } = {};
    days.forEach((day) => {
      grouped[day] = schedule
        .filter((s) => s.dayOfWeek === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return grouped;
  }, [schedule]);

  // Get today's classes for summary
  const todaysClasses = useMemo(() => {
    return schedule
      .filter((s) => s.dayOfWeek === currentDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedule, currentDay]);

  if (loading) {
    return <ScheduleSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Weekly Schedule</h1>
          <p className="text-slate-500 mt-1">
            {schedule.length} classes scheduled this week
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Today</p>
          <p className="text-lg font-semibold text-blue-600">{currentDay}</p>
        </div>
      </motion.div>

      {/* Today's Summary */}
      <motion.div variants={itemVariants} className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-blue-50">
            <HiOutlineCalendar className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Today's Classes</h2>
          <span className="ml-auto px-2.5 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
            {todaysClasses.length} classes
          </span>
        </div>

        {todaysClasses.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-slate-500">No classes scheduled for today! 🎉</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todaysClasses.map((entry) => {
              const course = getCourseById(entry.courseId);
              return (
                <motion.div
                  key={entry.scheduleId}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl bg-white/50 border border-white/50"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-12 rounded-full ${getScheduleTypeColor(entry.type)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {course?.courseName}
                      </p>
                      <p className="text-sm text-slate-500">{course?.courseCode}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <HiOutlineClock className="w-4 h-4" />
                          {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <HiOutlineLocationMarker className="w-4 h-4" />
                          {entry.room}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium text-white ${getScheduleTypeColor(
                        entry.type
                      )}`}
                    >
                      {entry.type}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Weekly Calendar - Desktop */}
      <motion.div
        variants={itemVariants}
        className="hidden lg:block glass-card overflow-hidden"
      >
        {/* Header */}
        <div className="grid grid-cols-5 border-b border-slate-200/50 bg-slate-50/50">
          {days.map((day) => (
            <div
              key={day}
              className={`p-4 text-center border-r border-slate-200/50 last:border-r-0 ${
                day === currentDay ? 'bg-blue-50' : ''
              }`}
            >
              <p
                className={`font-semibold ${
                  day === currentDay ? 'text-blue-600' : 'text-slate-800'
                }`}
              >
                {day}
              </p>
              {day === currentDay && (
                <span className="text-xs text-blue-500">Today</span>
              )}
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="relative grid grid-cols-5">
          {/* Time labels */}
          <div className="absolute -left-16 top-0 bottom-0 w-14 pt-4">
            {timeSlots.map((time, index) => (
              <div
                key={time}
                className="absolute text-xs text-slate-400 -translate-y-1/2"
                style={{ top: `${index * 60}px` }}
              >
                {formatTime(time)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => (
            <div
              key={day}
              className={`relative border-r border-slate-200/50 last:border-r-0 ${
                day === currentDay ? 'bg-blue-50/30' : ''
              }`}
              style={{ height: `${timeSlots.length * 60}px` }}
            >
              {/* Time grid lines */}
              {timeSlots.map((_, index) => (
                <div
                  key={index}
                  className="absolute left-0 right-0 border-t border-slate-100"
                  style={{ top: `${index * 60}px` }}
                />
              ))}

              {/* Schedule blocks */}
              {scheduleByDay[day]?.map((entry) => {
                const course = getCourseById(entry.courseId);
                return (
                  <ScheduleBlock
                    key={entry.scheduleId}
                    entry={entry}
                    courseName={course?.courseName || ''}
                    courseCode={course?.courseCode || ''}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Mobile/Tablet View - List by Day */}
      <motion.div variants={itemVariants} className="lg:hidden space-y-4">
        {days.map((day) => {
          const daySchedule = scheduleByDay[day];
          const isToday = day === currentDay;

          return (
            <div key={day} className="glass-card p-4">
              <div
                className={`flex items-center justify-between mb-3 ${
                  isToday ? 'text-blue-600' : 'text-slate-800'
                }`}
              >
                <h3 className="font-semibold">{day}</h3>
                {isToday && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                    Today
                  </span>
                )}
              </div>

              {daySchedule.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No classes</p>
              ) : (
                <div className="space-y-2">
                  {daySchedule.map((entry) => {
                    const course = getCourseById(entry.courseId);
                    return (
                      <div
                        key={entry.scheduleId}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/50"
                      >
                        <div
                          className={`w-1.5 h-12 rounded-full ${getScheduleTypeColor(
                            entry.type
                          )}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 text-sm truncate">
                            {course?.courseName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span>{formatTime(entry.startTime)} - {formatTime(entry.endTime)}</span>
                            <span>•</span>
                            <span>{entry.room}</span>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium text-white ${getScheduleTypeColor(
                            entry.type
                          )}`}
                        >
                          {entry.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Legend */}
      <motion.div variants={itemVariants} className="glass-card p-4">
        <h3 className="text-sm font-medium text-slate-600 mb-3">Class Types</h3>
        <div className="flex flex-wrap gap-3">
          {['Lecture', 'Lab', 'Tutorial', 'Seminar', 'Office Hours'].map((type) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${getScheduleTypeColor(type)}`} />
              <span className="text-sm text-slate-600">{type}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Schedule;
