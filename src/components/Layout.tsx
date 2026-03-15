import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineDocument,
  HiOutlineCalendar,
  HiOutlineSpeakerphone,
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Dashboard from './Dashboard';
import Courses from './Courses';
import Materials from './Materials';
import Schedule from './Schedule';
import Announcements from './Announcements';

type TabType = 'dashboard' | 'courses' | 'materials' | 'schedule' | 'announcements';

const tabs = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: HiOutlineHome },
  { id: 'courses' as TabType, label: 'Courses', icon: HiOutlineBookOpen },
  { id: 'materials' as TabType, label: 'Materials', icon: HiOutlineDocument },
  { id: 'schedule' as TabType, label: 'Schedule', icon: HiOutlineCalendar },
  { id: 'announcements' as TabType, label: 'Announcements', icon: HiOutlineSpeakerphone },
];

export function Layout() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { student, logout } = useAuth();
  const { getUnreadCount, refreshData, loading, lastUpdated } = useData();
  const unreadCount = getUnreadCount();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <Courses />;
      case 'materials':
        return <Materials />;
      case 'schedule':
        return <Schedule />;
      case 'announcements':
        return <Announcements />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-40">
        <div className="glass border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white font-bold text-lg">AU</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-800">Student Portal</h1>
                  <p className="text-xs text-slate-500">American University of Yangon</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="flex items-center gap-1 bg-white/30 backdrop-blur-md rounded-2xl p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'tab-active'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {tab.id === 'announcements' && unreadCount > 0 && (
                      <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Right Side */}
              <div className="flex items-center gap-4">
                {/* Refresh Button */}
                <button
                  onClick={refreshData}
                  disabled={loading}
                  className="p-2 rounded-xl hover:bg-white/50 transition-colors"
                  title="Refresh data"
                >
                  <HiOutlineRefresh
                    className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`}
                  />
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl hover:bg-white/50 transition-colors">
                  <HiOutlineBell className="w-5 h-5 text-slate-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200/50">
                  <img
                    src={student?.profileImage}
                    alt={`${student?.firstName} ${student?.lastName}`}
                    className="w-9 h-9 rounded-xl object-cover"
                  />
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-slate-800">
                      {student?.firstName} {student?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{student?.major}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 glass border-b border-white/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold">AU</span>
              </div>
              <div>
                <h1 className="text-base font-semibold text-slate-800">
                  {student?.firstName} {student?.lastName}
                </h1>
                <p className="text-xs text-slate-500">{student?.major}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 rounded-xl hover:bg-white/50 transition-colors"
              >
                <HiOutlineRefresh
                  className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`}
                />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
              >
                <HiOutlineLogout className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Last Updated Indicator */}
      {lastUpdated && (
        <div className="hidden md:flex justify-center py-2">
          <span className="text-xs text-slate-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden mobile-nav">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mobile-nav-item ${activeTab === tab.id ? 'active' : 'text-slate-500'}`}
            >
              <div className="relative">
                <tab.icon className="w-6 h-6" />
                {tab.id === 'announcements' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Layout;
