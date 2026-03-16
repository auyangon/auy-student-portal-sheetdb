import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiBell, HiX, HiExclamationCircle, HiInformationCircle,
  HiCheckCircle, HiCalendar, HiUser, HiOfficeBuilding, HiFilter
} from 'react-icons/hi';
import { useData } from '../context/DataContext';
import type { Announcement } from '../context/DataContext';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

const PRIORITY_CONFIG = {
  high: { icon: HiExclamationCircle, color: '#f87171', label: 'Urgent' },
  medium: { icon: HiInformationCircle, color: '#fbbf24', label: 'Important' },
  low: { icon: HiCheckCircle, color: '#34d399', label: 'Info' },
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Academic: { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.25)' },
  Campus: { bg: 'rgba(52,211,153,0.12)', text: '#34d399', border: 'rgba(52,211,153,0.25)' },
  Events: { bg: 'rgba(192,132,252,0.12)', text: '#c084fc', border: 'rgba(192,132,252,0.25)' },
  Exam: { bg: 'rgba(248,113,113,0.12)', text: '#f87171', border: 'rgba(248,113,113,0.25)' },
  Financial: { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
};

function AnnouncementModal({ ann, onClose }: { ann: Announcement; onClose: () => void }) {
  const { markAnnouncementRead } = useData();
  const pri = PRIORITY_CONFIG[ann.priority] ?? { icon: HiInformationCircle, color: "#94a3b8", label: "Info" };
  const PriIcon = pri.icon;
  const cat = CATEGORY_COLORS[ann.category] ?? { bg: "rgba(255,255,255,0.1)", text: "#ffffff", border: "rgba(255,255,255,0.2)" };

  const handleOpen = () => {
    markAnnouncementRead(ann.id);
  };

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
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="glass-strong rounded-3xl p-6 w-full max-w-lg relative z-10"
        onClick={e => { e.stopPropagation(); handleOpen(); }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <PriIcon className="text-2xl flex-shrink-0" style={{ color: pri.color }} />
            <div>
              <h2 className="text-white font-bold text-lg leading-snug">{ann.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/8 text-white/40 hover:text-white/80 transition-colors flex-shrink-0">
            <HiX className="text-lg" />
          </button>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-xs px-2.5 py-1.5 rounded-xl font-medium"
            style={{ background: cat.bg, color: cat.text, border: `1px solid ${cat.border}` }}>
            {ann.category}
          </span>
          <span className="text-xs px-2.5 py-1.5 rounded-xl font-medium"
            style={{ background: `${pri.color}15`, color: pri.color, border: `1px solid ${pri.color}30` }}>
            {pri.label}
          </span>
        </div>

        {/* Body */}
        <div className="glass rounded-2xl p-4 mb-5">
          <p className="text-white/70 text-sm leading-relaxed">{ann.body}</p>
        </div>

        {/* Footer info */}
        <div className="flex flex-wrap gap-4 text-white/40 text-xs">
          <div className="flex items-center gap-1.5">
            <HiUser className="text-sm" />
            <span>{ann.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HiOfficeBuilding className="text-sm" />
            <span>{ann.department}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HiCalendar className="text-sm" />
            <span>{new Date(ann.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnnouncementCard({ ann, onClick, delay }: { ann: Announcement; onClick: () => void; delay: number }) {
  const pri = PRIORITY_CONFIG[ann.priority] ?? { icon: HiInformationCircle, color: "#94a3b8", label: "Info" };
  const PriIcon = pri.icon;
  const cat = CATEGORY_COLORS[ann.category] ?? { bg: "rgba(255,255,255,0.1)", text: "#ffffff", border: "rgba(255,255,255,0.2)" };

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay }}
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 cursor-pointer relative overflow-hidden ${!ann.isRead ? 'border-l-2' : ''}`}
      style={!ann.isRead ? { borderLeftColor: pri.color } : {}}
    >
      {/* Unread dot */}
      {!ann.isRead && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full notif-pulse" style={{ background: pri.color }} />
      )}

      <div className="flex items-start gap-3">
        <PriIcon className="text-xl flex-shrink-0 mt-0.5" style={{ color: pri.color }} />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold mb-1 pr-4 ${ann.isRead ? 'text-white/65' : 'text-white'}`}>
            {ann.title}
          </h3>
          <p className="text-white/40 text-xs line-clamp-2 leading-relaxed mb-3">{ann.body}</p>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] px-2 py-0.5 rounded-lg font-medium"
              style={{ background: cat.bg, color: cat.text, border: `1px solid ${cat.border}` }}>
              {ann.category}
            </span>
            <span className="text-white/30 text-[11px]">{ann.department}</span>
            <span className="ml-auto text-white/25 text-[11px]">
              {new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Announcements() {
  const { announcements, isLoading, markAnnouncementRead } = useData();
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [filterCategory, setFilterCategory] = useState<Announcement['category'] | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Announcement['priority'] | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = announcements.filter(a => {
    if (filterCategory !== 'all' && a.category !== filterCategory) return false;
    if (filterPriority !== 'all' && a.priority !== filterPriority) return false;
    if (showUnreadOnly && a.isRead) return false;
    return true;
  });

  const unreadCount = announcements.filter(a => !a.isRead).length;
  const markAllRead = () => {
    announcements.forEach(a => markAnnouncementRead(a.id));
  };

  const categories = ['Academic', 'Campus', 'Events', 'Exam', 'Financial'] as const;
  const priorities = ['high', 'medium', 'low'] as const;

  return (
    <motion.div
      initial="initial" animate="animate" variants={stagger}
      className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-white font-bold text-2xl mb-1">Announcements</h1>
            <p className="text-white/40 text-sm">{announcements.length} total Â· {unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={markAllRead}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white/90 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              Mark all read
            </motion.button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-3 text-center">
            <div className="w-8 h-8 rounded-xl bg-red-400/15 flex items-center justify-center mx-auto mb-1.5">
              <HiExclamationCircle className="text-red-400" />
            </div>
            <p className="text-white font-bold text-lg">{announcements.filter(a => a.priority === 'high').length}</p>
            <p className="text-white/35 text-xs">Urgent</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-400/15 flex items-center justify-center mx-auto mb-1.5">
              <HiInformationCircle className="text-amber-400" />
            </div>
            <p className="text-white font-bold text-lg">{announcements.filter(a => a.priority === 'medium').length}</p>
            <p className="text-white/35 text-xs">Important</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/15 flex items-center justify-center mx-auto mb-1.5">
              <HiBell className="text-emerald-400" />
            </div>
            <p className="text-white font-bold text-lg">{unreadCount}</p>
            <p className="text-white/35 text-xs">Unread</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <HiFilter className="text-white/30 text-sm flex-shrink-0" />
          <button
            onClick={() => setFilterCategory('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
              filterCategory === 'all' ? 'text-white bg-white/10 border border-white/15' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >All</button>
          {categories.map(cat => {
            const c = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(filterCategory === cat ? 'all' : cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200`}
                style={filterCategory === cat ? { background: c.bg, color: c.text, border: `1px solid ${c.border}` } : {}}
              >
                <span className={filterCategory === cat ? '' : 'text-white/40 hover:text-white/70'}>{cat}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {priorities.map(p => {
            const pri = PRIORITY_CONFIG[p];
            const PriIcon = pri.icon;
            return (
              <button
                key={p}
                onClick={() => setFilterPriority(filterPriority === p ? 'all' : p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                  filterPriority === p
                    ? 'border-opacity-100'
                    : 'border-white/8 text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
                style={filterPriority === p ? { background: `${pri.color}15`, color: pri.color, borderColor: `${pri.color}30` } : {}}
              >
                <PriIcon className="text-sm" />
                {pri.label}
              </button>
            );
          })}
          <button
            onClick={() => setShowUnreadOnly(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
              showUnreadOnly ? 'text-blue-400 border-blue-400/30 bg-blue-400/12' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <HiBell className="text-sm" />
            Unread only
          </button>
          <span className="ml-auto text-white/25 text-xs">{filtered.length} results</span>
        </div>
      </motion.div>

      {/* List */}
      <motion.div variants={stagger} className="space-y-3">
        {isLoading
          ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
          : filtered.length === 0
            ? (
              <motion.div variants={fadeUp} className="glass-card rounded-3xl p-16 text-center">
                <HiBell className="text-5xl text-white/15 mx-auto mb-3" />
                <p className="text-white/40 font-medium">No announcements match your filters</p>
              </motion.div>
            )
            : filtered.map((ann, i) => (
              <AnnouncementCard
                key={ann.id}
                ann={ann}
                delay={i * 0.04}
                onClick={() => { setSelected(ann); markAnnouncementRead(ann.id); }}
              />
            ))
        }
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <AnnouncementModal ann={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}

