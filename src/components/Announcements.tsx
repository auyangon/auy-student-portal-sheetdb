import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSpeakerphone,
  HiOutlineCheckCircle,
  HiOutlineExternalLink,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineTag,
  HiOutlineFilter,
  HiOutlineEye,
  HiOutlineEyeOff,
} from 'react-icons/hi';
import { useData } from '../contexts/DataContext';
import { AnnouncementsSkeleton } from './LoadingSkeleton';
import {
  formatDate,
  getRelativeTime,
  getPriorityColor,
  getCategoryColor,
} from '../utils/helpers';
import { Announcement } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

interface AnnouncementCardProps {
  announcement: Announcement;
  isRead: boolean;
  onToggleRead: () => void;
  courseName?: string;
}

function AnnouncementCard({
  announcement,
  isRead,
  onToggleRead,
  courseName,
}: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      layout
      className={`announcement-card ${!isRead ? 'unread' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`badge ${getPriorityColor(announcement.priority)}`}>
              {announcement.priority}
            </span>
            <span className={`badge ${getCategoryColor(announcement.category)}`}>
              {announcement.category}
            </span>
            {announcement.targetAudience !== 'ALL' && courseName && (
              <span className="badge bg-blue-100 text-blue-600">
                {courseName}
              </span>
            )}
            {announcement.targetAudience === 'ALL' && (
              <span className="badge bg-purple-100 text-purple-600">
                All Students
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-800 text-lg">{announcement.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleRead}
            className={`p-2 rounded-xl transition-colors ${
              isRead
                ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title={isRead ? 'Mark as unread' : 'Mark as read'}
          >
            {isRead ? (
              <HiOutlineEyeOff className="w-5 h-5" />
            ) : (
              <HiOutlineEye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <HiOutlineUser className="w-4 h-4" />
          <span>{announcement.author}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400">{announcement.authorRole}</span>
        </div>
        <div className="flex items-center gap-1">
          <HiOutlineClock className="w-4 h-4" />
          <span>{getRelativeTime(announcement.publishDate)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <p
          className={`text-slate-600 ${
            isExpanded ? '' : 'line-clamp-3'
          }`}
        >
          {announcement.content}
        </p>
        {announcement.content.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-600 text-sm mt-2"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-400">
          Posted: {formatDate(announcement.publishDate)}
          {announcement.expiryDate && (
            <span> • Expires: {formatDate(announcement.expiryDate)}</span>
          )}
        </div>

        {announcement.attachmentLink && (
          <a
            href={announcement.attachmentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600"
          >
            <HiOutlineExternalLink className="w-4 h-4" />
            View Attachment
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function Announcements() {
  const { announcements, notifications, loading, markNotificationRead, getCourseById } = useData();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Create a map of announcement read status
  const readStatusMap = useMemo(() => {
    const map: { [key: string]: boolean } = {};
    notifications.forEach((n) => {
      map[n.announcementId] = n.isRead;
    });
    return map;
  }, [notifications]);

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter((announcement) => {
        const isRead = readStatusMap[announcement.announcementId] ?? false;

        // Read/Unread filter
        if (filter === 'unread' && isRead) return false;
        if (filter === 'read' && !isRead) return false;

        // Priority filter
        if (priorityFilter !== 'all' && announcement.priority !== priorityFilter) return false;

        // Category filter
        if (categoryFilter !== 'all' && announcement.category !== categoryFilter) return false;

        return true;
      })
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [announcements, readStatusMap, filter, priorityFilter, categoryFilter]);

  // Get unread count
  const unreadCount = useMemo(() => {
    return announcements.filter((a) => !readStatusMap[a.announcementId]).length;
  }, [announcements, readStatusMap]);

  // Handle toggle read
  const handleToggleRead = (announcementId: string) => {
    const notification = notifications.find((n) => n.announcementId === announcementId);
    if (notification) {
      markNotificationRead(notification.notificationId);
    }
  };

  if (loading) {
    return <AnnouncementsSkeleton />;
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
          <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
          <p className="text-slate-500 mt-1">
            {unreadCount} unread • {announcements.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <HiOutlineSpeakerphone className="w-6 h-6 text-blue-500" />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-4 flex flex-col sm:flex-row gap-4"
      >
        {/* Read/Unread Filter */}
        <div className="flex items-center gap-1 bg-white/50 rounded-xl p-1">
          {[
            { value: 'all', label: 'All' },
            { value: 'unread', label: 'Unread' },
            { value: 'read', label: 'Read' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === option.value
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <HiOutlineFilter className="w-5 h-5 text-slate-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="glass-input text-sm py-2"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <HiOutlineTag className="w-5 h-5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="glass-input text-sm py-2"
          >
            <option value="all">All Categories</option>
            <option value="General">General</option>
            <option value="Academic">Academic</option>
            <option value="Event">Event</option>
            <option value="Administrative">Administrative</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </motion.div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <motion.div variants={itemVariants} className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <HiOutlineCheckCircle className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500">
            {filter === 'unread'
              ? "You're all caught up! No unread announcements."
              : 'No announcements match your filters.'}
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => {
                setFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('all');
              }}
              className="mt-4 text-blue-500 hover:underline"
            >
              Clear filters
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="space-y-4">
          <AnimatePresence>
            {filteredAnnouncements.map((announcement) => {
              const course = getCourseById(announcement.targetAudience);
              const isRead = readStatusMap[announcement.announcementId] ?? false;

              return (
                <AnnouncementCard
                  key={announcement.announcementId}
                  announcement={announcement}
                  isRead={isRead}
                  onToggleRead={() => handleToggleRead(announcement.announcementId)}
                  courseName={course?.courseCode}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Announcements;
