import { format, formatDistanceToNow, differenceInDays, differenceInHours, differenceInMinutes, isPast, isToday, parseISO } from 'date-fns';

// Date formatting helpers
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatTime(timeString: string): string {
  if (!timeString) return '';
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return format(date, 'h:mm a');
  } catch {
    return timeString;
  }
}

export function formatDateTime(dateString: string, timeString: string): string {
  if (!dateString) return '';
  try {
    const dateTime = parseISO(`${dateString}T${timeString || '00:00'}`);
    return format(dateTime, 'MMM d, yyyy h:mm a');
  } catch {
    return `${dateString} ${timeString}`;
  }
}

export function getRelativeTime(dateString: string): string {
  if (!dateString) return '';
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

// Countdown helpers
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  isPast: boolean;
  isUrgent: boolean;
  label: string;
}

export function getCountdown(dateString: string, timeString: string = '23:59'): CountdownTime {
  try {
    const deadline = parseISO(`${dateString}T${timeString}`);
    const now = new Date();
    
    if (isPast(deadline)) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        isPast: true,
        isUrgent: false,
        label: 'Overdue',
      };
    }

    const days = differenceInDays(deadline, now);
    const hours = differenceInHours(deadline, now) % 24;
    const minutes = differenceInMinutes(deadline, now) % 60;
    const isUrgent = days < 2;

    let label = '';
    if (days > 0) {
      label = `${days}d ${hours}h`;
    } else if (hours > 0) {
      label = `${hours}h ${minutes}m`;
    } else {
      label = `${minutes}m`;
    }

    return {
      days,
      hours,
      minutes,
      isPast: false,
      isUrgent,
      label,
    };
  } catch {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      isPast: false,
      isUrgent: false,
      label: 'Unknown',
    };
  }
}

export function isTodayDate(dateString: string): boolean {
  if (!dateString) return false;
  try {
    return isToday(parseISO(dateString));
  } catch {
    return false;
  }
}

// Grade helpers
export function getGradeColor(grade: string): string {
  switch (grade.charAt(0)) {
    case 'A':
      return 'text-emerald-500';
    case 'B':
      return 'text-blue-500';
    case 'C':
      return 'text-amber-500';
    case 'D':
      return 'text-orange-500';
    case 'F':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

export function getGradeBgColor(grade: string): string {
  switch (grade.charAt(0)) {
    case 'A':
      return 'bg-emerald-500/10 border-emerald-500/20';
    case 'B':
      return 'bg-blue-500/10 border-blue-500/20';
    case 'C':
      return 'bg-amber-500/10 border-amber-500/20';
    case 'D':
      return 'bg-orange-500/10 border-orange-500/20';
    case 'F':
      return 'bg-red-500/10 border-red-500/20';
    default:
      return 'bg-gray-500/10 border-gray-500/20';
  }
}

// Attendance helpers
export function getAttendanceColor(percentage: number): string {
  if (percentage >= 90) return 'text-emerald-500';
  if (percentage >= 80) return 'text-blue-500';
  if (percentage >= 70) return 'text-amber-500';
  return 'text-red-500';
}

export function getAttendanceBgColor(percentage: number): string {
  if (percentage >= 90) return 'bg-emerald-500';
  if (percentage >= 80) return 'bg-blue-500';
  if (percentage >= 70) return 'bg-amber-500';
  return 'bg-red-500';
}

// Priority helpers
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'High':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'Normal':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'Low':
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
}

// Material type helpers
export function getMaterialTypeIcon(type: string): string {
  switch (type) {
    case 'Lecture Notes':
      return '📝';
    case 'Slides':
      return '📊';
    case 'Video':
      return '🎬';
    case 'Assignment':
      return '📋';
    case 'Reading':
      return '📖';
    case 'Quiz':
      return '❓';
    case 'Exam':
      return '📝';
    case 'Resource':
      return '📁';
    default:
      return '📄';
  }
}

export function getMaterialTypeColor(type: string): string {
  switch (type) {
    case 'Lecture Notes':
      return 'bg-blue-500/10 text-blue-500';
    case 'Slides':
      return 'bg-purple-500/10 text-purple-500';
    case 'Video':
      return 'bg-red-500/10 text-red-500';
    case 'Assignment':
      return 'bg-amber-500/10 text-amber-500';
    case 'Reading':
      return 'bg-emerald-500/10 text-emerald-500';
    case 'Quiz':
      return 'bg-pink-500/10 text-pink-500';
    case 'Exam':
      return 'bg-rose-500/10 text-rose-500';
    case 'Resource':
      return 'bg-gray-500/10 text-gray-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
}

// Day helpers
export function getDayIndex(day: string): number {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.indexOf(day);
}

export function getCurrentDayName(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

// GPA helpers
export function getGPAColor(gpa: number): string {
  if (gpa >= 3.7) return 'text-emerald-500';
  if (gpa >= 3.0) return 'text-blue-500';
  if (gpa >= 2.0) return 'text-amber-500';
  return 'text-red-500';
}

// Schedule type helpers
export function getScheduleTypeColor(type: string): string {
  switch (type) {
    case 'Lecture':
      return 'bg-blue-500';
    case 'Lab':
      return 'bg-purple-500';
    case 'Tutorial':
      return 'bg-emerald-500';
    case 'Seminar':
      return 'bg-amber-500';
    case 'Office Hours':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
}

// Category helpers
export function getCategoryColor(category: string): string {
  switch (category) {
    case 'General':
      return 'bg-blue-500/10 text-blue-500';
    case 'Academic':
      return 'bg-purple-500/10 text-purple-500';
    case 'Event':
      return 'bg-emerald-500/10 text-emerald-500';
    case 'Administrative':
      return 'bg-amber-500/10 text-amber-500';
    case 'Emergency':
      return 'bg-red-500/10 text-red-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
}

// Generate random gradient for cards
export function getCardGradient(index: number): string {
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-red-600',
    'from-cyan-500 to-blue-600',
  ];
  return gradients[index % gradients.length];
}
