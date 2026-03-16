import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiClock, HiLocationMarker, HiCalendar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useData } from '../context/DataContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAY_ABBR: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri'
};
const TYPE_COLORS: Record<string, string> = {
  Lecture: '#60a5fa', Lab: '#34d399', Tutorial: '#c084fc', Exam: '#f87171'
};

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

export default function Schedule() {
  const { schedule, isLoading } = useData();
  const [activeDay, setActiveDay] = useState<string>(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return DAYS.includes(today) ? today : 'Monday';
  });

  const todayClasses = schedule
    .filter(s => s.day === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getDateForDay = (day: string) => {
    const today = new Date();
    const todayIdx = today.getDay(); // 0=Sun
    const targetIdx = DAYS.indexOf(day) + 1; // 1=Mon
    const diff = targetIdx - todayIdx;
    const d = new Date(today);
    d.setDate(today.getDate() + diff);
    return d;
  };

  const prevDay = () => {
    const idx = DAYS.indexOf(activeDay);
    if (idx > 0) setActiveDay(DAYS[idx - 1]);
  };
  const nextDay = () => {
    const idx = DAYS.indexOf(activeDay);
    if (idx < DAYS.length - 1) setActiveDay(DAYS[idx + 1]);
  };

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Time grid
  const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8am-5pm

  const getTopPercent = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return ((h - 8) * 60 + m) / (10 * 60) * 100;
  };
  const getHeightPercent = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    return mins / (10 * 60) * 100;
  };

  return (
    <motion.div
      initial="initial" animate="animate" variants={stagger}
      className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-2xl mb-1">Weekly Schedule</h1>
          <p className="text-white/40 text-sm">{schedule.length} classes · Semester 2 · AY 2023–2024</p>
        </div>
        <div className="flex items-center gap-1.5">
          {(['Lecture', 'Lab', 'Tutorial', 'Exam'] as const).map(t => (
            <div key={t} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
              style={{ background: `${TYPE_COLORS[t]}12`, border: `1px solid ${TYPE_COLORS[t]}25` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[t] }} />
              <span className="text-xs font-medium" style={{ color: TYPE_COLORS[t] }}>{t}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Day picker */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-4">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={prevDay}
            disabled={activeDay === DAYS[0]}
            className="p-2 rounded-xl hover:bg-white/8 text-white/40 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <HiChevronLeft />
          </motion.button>
          <div className="flex-1 grid grid-cols-5 gap-2">
            {DAYS.map(day => {
              const d = getDateForDay(day);
              const isToday = day === todayName;
              const isActive = day === activeDay;
              const count = schedule.filter(s => s.day === day).length;
              return (
                <motion.button
                  key={day}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveDay(day)}
                  className={`relative rounded-2xl py-3 px-2 text-center transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(129,140,248,0.15))', border: '1px solid rgba(96,165,250,0.2)' } : {}}
                >
                  {isToday && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 dot-pulse" />
                  )}
                  <p className="text-xs font-medium mb-0.5">{DAY_ABBR[day]}</p>
                  <p className="text-lg font-bold">{d.getDate()}</p>
                  <p className="text-[10px] opacity-60">{count} class{count !== 1 ? 'es' : ''}</p>
                </motion.button>
              );
            })}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={nextDay}
            disabled={activeDay === DAYS[DAYS.length - 1]}
            className="p-2 rounded-xl hover:bg-white/8 text-white/40 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <HiChevronRight />
          </motion.button>
        </div>
      </motion.div>

      {/* Classes for day */}
      <motion.div variants={fadeUp} layout>
        <div className="flex items-center gap-2 mb-4">
          <HiCalendar className="text-blue-400" />
          <h2 className="text-white font-semibold text-sm">{activeDay}</h2>
          <span className="text-white/30 text-xs">— {todayClasses.length} class{todayClasses.length !== 1 ? 'es' : ''}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
              </div>
            ) : todayClasses.length === 0 ? (
              <div className="glass-card rounded-3xl p-16 text-center">
                <HiCalendar className="text-5xl text-white/15 mx-auto mb-3" />
                <p className="text-white/50 font-semibold text-lg">No classes on {activeDay}</p>
                <p className="text-white/30 text-sm mt-1">Take a break or use this time to study! 📚</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayClasses.map((cls, i) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Time */}
                    <div className="flex-shrink-0 flex flex-col items-center justify-center sm:w-24 text-center">
                      <p className="text-white font-bold text-lg">{cls.startTime}</p>
                      <div className="w-px h-4 bg-white/15 my-1" />
                      <p className="text-white/45 text-sm">{cls.endTime}</p>
                    </div>

                    {/* Color bar */}
                    <div className="hidden sm:block w-1 rounded-full flex-shrink-0" style={{ background: cls.color }} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-white font-semibold text-base">{cls.courseName}</h3>
                          <p className="text-white/45 text-sm mt-0.5">{cls.instructor}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-xl"
                            style={{ background: `${cls.color}18`, color: cls.color, border: `1px solid ${cls.color}30` }}>
                            {cls.type}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-xl"
                            style={{ background: `${TYPE_COLORS[cls.type]}12`, color: TYPE_COLORS[cls.type] }}>
                            {/* Duration */}
                            {(() => {
                              const [sh, sm] = cls.startTime.split(':').map(Number);
                              const [eh, em] = cls.endTime.split(':').map(Number);
                              const mins = (eh * 60 + em) - (sh * 60 + sm);
                              return `${mins} min`;
                            })()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-white/40 text-xs">
                          <HiLocationMarker className="text-sm flex-shrink-0" />
                          <span>{cls.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/40 text-xs">
                          <HiClock className="text-sm flex-shrink-0" />
                          <span>{cls.startTime} – {cls.endTime}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Weekly overview grid */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-5 overflow-x-auto">
        <h2 className="text-white font-semibold text-sm mb-4">Weekly Overview</h2>
        <div className="min-w-[640px]">
          <div className="grid grid-cols-6 gap-2 mb-3">
            <div className="text-white/30 text-xs text-center">Time</div>
            {DAYS.map(d => (
              <div key={d} className={`text-xs text-center font-medium ${d === todayName ? 'text-blue-400' : 'text-white/50'}`}>
                {DAY_ABBR[d]}
              </div>
            ))}
          </div>
          <div className="relative grid grid-cols-6 gap-2" style={{ height: 320 }}>
            {/* Hour labels */}
            <div className="flex flex-col justify-between py-1">
              {hours.map(h => (
                <span key={h} className="text-white/25 text-[10px] text-right pr-2">
                  {h > 12 ? `${h - 12}pm` : h === 12 ? '12pm' : `${h}am`}
                </span>
              ))}
            </div>
            {/* Day columns */}
            {DAYS.map(day => {
              const dayClasses = schedule.filter(s => s.day === day);
              return (
                <div key={day} className="relative rounded-xl overflow-hidden"
                  style={{ background: day === activeDay ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                  {/* Hour lines */}
                  {hours.map((_, i) => (
                    <div key={i} className="absolute w-full border-t border-white/4" style={{ top: `${i / 10 * 100}%` }} />
                  ))}
                  {/* Classes */}
                  {dayClasses.map(cls => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="absolute left-0.5 right-0.5 rounded-lg overflow-hidden cursor-pointer"
                      style={{
                        top: `${getTopPercent(cls.startTime)}%`,
                        height: `${getHeightPercent(cls.startTime, cls.endTime)}%`,
                        background: `${cls.color}20`,
                        border: `1px solid ${cls.color}40`,
                        transformOrigin: 'top',
                      }}
                      onClick={() => setActiveDay(day)}
                    >
                      <div className="p-1 h-full">
                        <p className="text-[9px] font-bold truncate leading-tight" style={{ color: cls.color }}>
                          {cls.courseName.split(' ').slice(0,2).join(' ')}
                        </p>
                        <p className="text-[8px] text-white/40 truncate">{cls.startTime}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
