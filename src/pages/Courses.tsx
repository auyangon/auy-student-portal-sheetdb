import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiUser, HiLocationMarker, HiClock, HiUsers, HiStar } from 'react-icons/hi';
import { useData } from '../context/DataContext';
import type { Course } from '../context/DataContext';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.07 } } };

function GradeRing({ grade, gradePoints, color }: { grade: string; gradePoints: number; color: string }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const pct = gradePoints / 4.0;
  const dash = circ * pct;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="80" height="80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <motion.circle
          cx="40" cy="40" r={r} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <div className="text-center">
        <p className="text-white font-bold text-lg leading-none">{grade}</p>
        <p className="text-white/35 text-[10px]">{gradePoints.toFixed(1)}</p>
      </div>
    </div>
  );
}

function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-strong rounded-3xl p-6 w-full max-w-md relative z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <span className="text-white/40 text-xs font-mono">{course.code}</span>
            <h2 className="text-white font-bold text-xl mt-0.5">{course.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/8 text-white/40 hover:text-white/80 transition-colors">
            <HiX className="text-lg" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <GradeRing grade={course.grade} gradePoints={course.gradePoints} color={course.color} />
          <div className="flex-1 ml-5 space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <HiUser className="text-white/30 flex-shrink-0" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <HiLocationMarker className="text-white/30 flex-shrink-0" />
              <span>{course.room}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <HiClock className="text-white/30 flex-shrink-0" />
              <span>{course.schedule}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <HiUsers className="text-white/30 flex-shrink-0" />
              <span>{course.enrolled}/{course.capacity} students</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="glass rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Course Completion</p>
            <span className="text-white font-bold text-sm">{course.progress}%</span>
          </div>
          <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="h-full rounded-full"
              style={{ background: course.color }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 glass rounded-2xl p-3 text-center">
            <p className="text-white/40 text-xs mb-1">Credits</p>
            <p className="text-white font-bold text-lg">{course.credits}</p>
          </div>
          <div className="flex-1 glass rounded-2xl p-3 text-center">
            <p className="text-white/40 text-xs mb-1">Grade Points</p>
            <p className="text-white font-bold text-lg">{course.gradePoints.toFixed(1)}</p>
          </div>
          <div className="flex-1 glass rounded-2xl p-3 text-center">
            <p className="text-white/40 text-xs mb-1">Enrollment</p>
            <p className="text-white font-bold text-lg">{Math.round(course.enrolled/course.capacity*100)}%</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Courses() {
  const { courses, isLoading } = useData();
  const [selected, setSelected] = useState<Course | null>(null);
  const [filter, setFilter] = useState<'all' | 'A' | 'B' | 'C'>('all');

  const filtered = courses.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'A') return c.grade.startsWith('A');
    if (filter === 'B') return c.grade.startsWith('B');
    if (filter === 'C') return c.grade.startsWith('C');
    return true;
  });

  const totalGPA = courses.length
    ? (courses.reduce((s, c) => s + c.gradePoints * c.credits, 0) / courses.reduce((s, c) => s + c.credits, 0)).toFixed(2)
    : 'â€”';

  return (
    <motion.div
      initial="initial" animate="animate" variants={stagger}
      className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-2xl mb-1">My Courses</h1>
          <p className="text-white/40 text-sm">Semester 2 Â· AY 2023â€“2024 Â· {courses.length} courses enrolled</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-2xl px-5 py-3 text-center">
            <p className="text-white/40 text-xs mb-0.5">Semester GPA</p>
            <p className="text-white font-bold text-2xl gradient-text-blue">{totalGPA}</p>
          </div>
          <div className="glass rounded-2xl px-5 py-3 text-center">
            <p className="text-white/40 text-xs mb-0.5">Total Credits</p>
            <p className="text-white font-bold text-2xl">{courses.reduce((s, c) => s + c.credits, 0)}</p>
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div variants={fadeUp} className="flex items-center gap-2">
        {(['all', 'A', 'B', 'C'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === f
                ? 'text-white border border-blue-400/30'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
            style={filter === f ? { background: 'rgba(96,165,250,0.12)' } : {}}
          >
            {f === 'all' ? 'All Courses' : `Grade ${f}`}
          </button>
        ))}
        <span className="ml-auto text-white/30 text-xs">{filtered.length} results</span>
      </motion.div>

      {/* Grid */}
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading
          ? Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-52 rounded-3xl" />)
          : filtered.map((course, i) => (
            <motion.div
              key={course.id}
              variants={fadeUp}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(course)}
              className="glass-card rounded-3xl p-5 cursor-pointer"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg font-medium"
                    style={{ background: `${course.color}18`, color: course.color, border: `1px solid ${course.color}30` }}>
                    {course.code}
                  </span>
                  <h3 className="text-white font-semibold text-base mt-2 leading-snug">{course.name}</h3>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div className="glass rounded-2xl px-3 py-2 text-center">
                    <p className="text-white font-bold text-xl">{course.grade}</p>
                    <p className="text-white/35 text-[10px]">Grade</p>
                  </div>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: course.color }}>
                  {course?.instructor?.split(' ').filter((_, i2) => i2 > 0).map(w => w[0]).join('').slice(0,2)}
                </div>
                <span className="text-white/50 text-xs">{course.instructor}</span>
                <span className="ml-auto text-white/30 text-xs">{course.credits} cr</span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white/35 text-xs">Completion</span>
                  <span className="text-white/60 text-xs font-medium">{course.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ delay: 0.2 + i * 0.04, duration: 0.7 }}
                    className="h-full rounded-full"
                    style={{ background: course.color }}
                  />
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mt-3">
                {[1,2,3,4].map(s => (
                  <HiStar key={s} className={`text-xs ${s <= Math.round(course.gradePoints) ? 'text-yellow-400' : 'text-white/12'}`} />
                ))}
                <span className="text-white/30 text-xs ml-1">{course.gradePoints.toFixed(1)} GP</span>
                <span className="ml-auto text-white/25 text-[10px]">{course.room}</span>
              </div>
            </motion.div>
          ))
        }
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <CourseModal course={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}

