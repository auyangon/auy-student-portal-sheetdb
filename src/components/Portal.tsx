import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar, { type PageKey } from './Sidebar';
import Topbar from './Topbar';
import Dashboard from '../pages/Dashboard';
import Courses from '../pages/Courses';
import Materials from '../pages/Materials';
import Schedule from '../pages/Schedule';
import Announcements from '../pages/Announcements';

const PAGE_COMPONENTS: Record<PageKey, React.ComponentType> = {
  dashboard: Dashboard,
  courses: Courses,
  materials: Materials,
  schedule: Schedule,
  announcements: Announcements,
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function Portal() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PageComponent = PAGE_COMPONENTS[activePage];

  return (
    <div className="min-h-screen hero-bg flex">
      {/* Ambient background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/4 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full bg-purple-600/4 blur-[100px]" />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-emerald-600/3 blur-[80px]" />
      </div>

      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar
          activePage={activePage}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
        />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
