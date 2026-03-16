import { motion } from 'framer-motion';
import {
  HiAcademicCap, HiBookOpen, HiCheckCircle,
  HiTrendingUp, HiClock, HiBell, HiStar, HiChevronRight
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; value: string | number; sub?: string; color: string; delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay, duration: 0.4 }}
      className="glass-card stat-card rounded-3xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="text-xl" style={{ color }} />
        </div>
        <span className="text-white/20 text-xs font-medium bg-white/5 px-2 py-1 rounded-lg">
          {sub || 'This Semester'}
        </span>
      </div>
      <p className="text-white/45 text-xs font-medium uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { courses, schedule, announcements, isLoading } = useData();

  const unread = announcements.filter(a => !a.isRead).length;
  const creditsPercent = Math.round(((user?.credits ?? 0) / (user?.totalCredits ?? 120)) * 100);

  // Next class today
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = schedule.filter(s => s.day === today).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Recent announcements
  const recentAnn = [...announcements].slice(0, 3);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const priorityColors: Record<string, string> = { high: '#f87171', medium: '#fbbf24', low: '#34d399' };
  const categoryColors: Record<string, string> = {
    Academic: '#60a5fa', Campus: '#34d399', Events: '#c084fc',
    Exam: '#f87171', Financial: '#fbbf24',
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={stagger}
      className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Hero Welcome */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.08), transparent)' }} />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full blur-[60px]" style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.06), transparent)' }} />
        </div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="text-white/40 text-sm font-medium mb-1">{getGreeting()} 👋</p>
            <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-2">{user?.name}</h1>
            <div className="flex flex-wrap gap-2">
              <span className="badge-blue text-xs px-3 py-1.5 rounded-xl font-medium">{user?.major}</span>
              <span className="badge-blue text-xs px-3 py-1.5 rounded-xl font-medium">Year {user?.year}</span>
              <span className="badge-blue text-xs px-3 py-1.5 rounded-xl font-medium">{user?.studentId}</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="inline-flex flex-col items-center glass rounded-2xl px-5 py-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Current GPA</p>
              <p className="text-4xl font-bold gradient-text-blue">{user?.gpa.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-1">
                {[1,2,3,4,5].map(i => (
                  <HiStar key={i} className={`text-sm ${i <= Math.round(user?.gpa ?? 0) ? 'text-yellow-400' : 'text-white/15'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Credit progress */}
        <div className="relative mt-6 pt-5 border-t border-white/6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-white/45 text-xs font-medium">Credit Progress</p>
            <p className="text-white/60 text-xs">{user?.credits} / {user?.totalCredits} credits · {creditsPercent}%</p>
          </div>
          <div className="h-2 rounded-full bg-white/8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${creditsPercent}%` }}
              transition={{ delay: 0.4, duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="h-full progress-bar"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiBookOpen} label="Active Courses" value={courses.length} color="#60a5fa" delay={0} />
        <StatCard icon={HiAcademicCap} label="Credits Earned" value={user?.credits ?? 0} sub="Total" color="#818cf8" delay={0.05} />
        <StatCard icon={HiBell} label="Unread Alerts" value={unread} sub="Announcements" color="#f87171" delay={0.1} />
        <StatCard icon={HiTrendingUp} label="Avg Progress" value={`${Math.round(courses.reduce((s, c) => s + c.progress, 0) / (courses.length || 1))}%`} color="#34d399" delay={0.15} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'View Transcript', emoji: '📄', color: '#60a5fa' },
          { label: 'Pay Tuition', emoji: '💳', color: '#34d399' },
          { label: 'Book Library', emoji: '📚', color: '#c084fc' },
          { label: 'Contact Advisor', emoji: '🎓', color: '#fb923c' },
        ].map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="glass-card rounded-2xl p-4 text-center flex flex-col items-center gap-2"
          >
            <span className="text-2xl">{action.emoji}</span>
            <span className="text-white/60 text-xs font-medium">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Current Courses</h2>
            <span className="text-white/30 text-xs">{courses.length} enrolled</span>
          </div>
          <div className="space-y-3">
            {isLoading
              ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-2xl" />
              ))
              : courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card rounded-2xl px-4 py-3 flex items-center gap-4"
                >
                  <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ background: course.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/50 text-xs font-mono">{course.code}</span>
                      <span className="text-white font-medium text-sm truncate">{course.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: course.color }}
                        />
                      </div>
                      <span className="text-white/40 text-xs flex-shrink-0">{course.progress}%</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-white font-bold text-sm">{course.grade}</span>
                    <p className="text-white/30 text-xs">{course.credits} cr</p>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Today's schedule */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 mb-4">
              <HiClock className="text-blue-400" />
              <h2 className="text-white font-semibold text-sm">Today's Classes</h2>
              <span className="text-white/30 text-xs ml-auto">{today}</span>
            </div>
            {todayClasses.length === 0 ? (
              <div className="glass-card rounded-2xl p-5 text-center">
                <HiCheckCircle className="text-emerald-400 text-3xl mx-auto mb-2" />
                <p className="text-white/60 text-sm font-medium">No classes today!</p>
                <p className="text-white/30 text-xs">Enjoy your free day 🎉</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayClasses.map((cls, i) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-2xl p-3 flex items-center gap-3"
                  >
                    <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: cls.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-xs font-medium truncate">{cls.courseName}</p>
                      <p className="text-white/35 text-xs">{cls.room}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white/70 text-xs font-medium">{cls.startTime}</p>
                      <span className="text-white/30 text-[10px]">{cls.type}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Announcements */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 mb-4">
              <HiBell className="text-blue-400" />
              <h2 className="text-white font-semibold text-sm">Recent Alerts</h2>
            </div>
            <div className="space-y-2">
              {recentAnn.map((ann, i) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card rounded-2xl p-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: priorityColors[ann.priority] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-xs font-medium line-clamp-2 leading-snug">{ann.title}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                          style={{
                            background: `${categoryColors[ann.category]}20`,
                            color: categoryColors[ann.category],
                            border: `1px solid ${categoryColors[ann.category]}30`,
                          }}
                        >
                          {ann.category}
                        </span>
                        {!ann.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 notif-pulse" />}
                      </div>
                    </div>
                    <HiChevronRight className="text-white/20 text-sm flex-shrink-0 mt-0.5" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
