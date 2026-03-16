import { motion, AnimatePresence } from 'framer-motion';
import {
  HiAcademicCap, HiHome, HiBookOpen, HiCollection,
  HiCalendar, HiBell, HiLogout, HiChevronRight,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export type PageKey = 'dashboard' | 'courses' | 'materials' | 'schedule' | 'announcements';

const NAV_ITEMS: { key: PageKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: HiHome },
  { key: 'courses', label: 'Courses', icon: HiBookOpen },
  { key: 'materials', label: 'Materials', icon: HiCollection },
  { key: 'schedule', label: 'Schedule', icon: HiCalendar },
  { key: 'announcements', label: 'Announcements', icon: HiBell },
];

interface SidebarProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ activePage, onNavigate, onClose }: Omit<SidebarProps, 'isOpen'>) {
  const { user, logout } = useAuth();
  const { announcements } = useData();
  const unread = announcements.filter(a => !a.isRead).length;

  return (
    <div className="h-full flex flex-col py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
          <HiAcademicCap className="text-white text-lg" />
        </div>
        <div>
          <span className="text-white font-bold text-sm tracking-tight">AUY Portal</span>
          <p className="text-white/30 text-[10px]">Student Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">Navigation</p>
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = activePage === key;
          return (
            <motion.button
              key={key}
              onClick={() => { onNavigate(key); onClose(); }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 relative group ${
                isActive
                  ? 'sidebar-item-active text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <Icon className={`text-xl flex-shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-white/40 group-hover:text-white/60'}`} />
              <span className="flex-1 text-left">{label}</span>
              {key === 'announcements' && unread > 0 && (
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold notif-pulse">
                  {unread}
                </span>
              )}
              {isActive && (
                <HiChevronRight className="text-sm text-blue-400/60" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Status */}
      <div className="mb-4">
        <div className="glass rounded-2xl px-3 py-3 flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-400 dot-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/60 text-[11px]">Data Sync</p>
            <p className="text-emerald-400 text-[11px] font-medium">Live · Updates every 60s</p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="glass rounded-2xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
          {user?.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-xs font-semibold truncate">{user?.name}</p>
          <p className="text-white/30 text-[10px] truncate">{user?.studentId}</p>
        </div>
        <motion.button
          onClick={logout}
          whileTap={{ scale: 0.9 }}
          className="text-white/30 hover:text-red-400 transition-colors p-1.5 rounded-xl hover:bg-red-400/10"
          title="Sign out"
        >
          <HiLogout className="text-base" />
        </motion.button>
      </div>
    </div>
  );
}

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 flex-shrink-0 glass border-r border-white/6">
        <SidebarContent activePage={activePage} onNavigate={onNavigate} onClose={() => {}} />
      </aside>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-backdrop lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-screen w-64 z-50 lg:hidden glass-strong border-r border-white/8"
          >
            <SidebarContent activePage={activePage} onNavigate={onNavigate} onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
