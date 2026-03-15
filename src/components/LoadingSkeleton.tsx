import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`shimmer rounded-lg ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="glass-card p-6">
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="glass-card p-4 flex items-center gap-4">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Schedule */}
        <div className="glass-card p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Deadlines */}
        <div className="glass-card p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CoursesSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {[...Array(6)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </motion.div>
  );
}

export function MaterialsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Materials list */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="glass-card p-4 flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export function ScheduleSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="grid grid-cols-5 border-b border-slate-200/50">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 text-center border-r border-slate-200/50 last:border-r-0">
            <Skeleton className="h-4 w-16 mx-auto mb-1" />
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-5">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="calendar-cell">
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function AnnouncementsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {[...Array(5)].map((_, i) => (
        <div key={i} className="glass-card p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default {
  Skeleton,
  CardSkeleton,
  StatsCardSkeleton,
  ListItemSkeleton,
  DashboardSkeleton,
  CoursesSkeleton,
  MaterialsSkeleton,
  ScheduleSkeleton,
  AnnouncementsSkeleton,
};
