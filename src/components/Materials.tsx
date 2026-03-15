import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlineExternalLink,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineUser,
  HiOutlineClock,
} from 'react-icons/hi';
import { useData } from '../contexts/DataContext';
import { MaterialsSkeleton } from './LoadingSkeleton';
import {
  formatDate,
  getMaterialTypeIcon,
  getMaterialTypeColor,
} from '../utils/helpers';
import { Material } from '../types';

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

const materialTypes = [
  'All Types',
  'Lecture Notes',
  'Slides',
  'Video',
  'Assignment',
  'Reading',
  'Quiz',
  'Exam',
  'Resource',
];

export function Materials() {
  const { materials, courses, loading, getCourseById } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedWeek, setSelectedWeek] = useState<string>('all');

  // Get unique weeks
  const weeks = useMemo(() => {
    const uniqueWeeks = [...new Set(materials.map((m) => m.weekNumber))].sort((a, b) => a - b);
    return uniqueWeeks;
  }, [materials]);

  // Filter materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        searchQuery === '' ||
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.tags.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse = selectedCourse === 'all' || material.courseId === selectedCourse;
      const matchesType = selectedType === 'All Types' || material.type === selectedType;
      const matchesWeek =
        selectedWeek === 'all' || material.weekNumber.toString() === selectedWeek;

      return matchesSearch && matchesCourse && matchesType && matchesWeek;
    });
  }, [materials, searchQuery, selectedCourse, selectedType, selectedWeek]);

  // Group materials by course
  const groupedMaterials = useMemo(() => {
    const groups: { [key: string]: Material[] } = {};
    filteredMaterials.forEach((material) => {
      const course = getCourseById(material.courseId);
      const key = course?.courseCode || material.courseId;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(material);
    });
    return groups;
  }, [filteredMaterials, getCourseById]);

  if (loading) {
    return <MaterialsSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-slate-800">Course Materials</h1>
        <p className="text-slate-500 mt-1">
          {materials.length} materials available
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-4 flex flex-col md:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10"
          />
        </div>

        {/* Course Filter */}
        <div className="relative">
          <HiOutlineFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="glass-input pl-10 pr-8 appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseCode}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="glass-input appearance-none cursor-pointer min-w-[130px]"
        >
          {materialTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Week Filter */}
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="glass-input appearance-none cursor-pointer min-w-[120px]"
        >
          <option value="all">All Weeks</option>
          {weeks.map((week) => (
            <option key={week} value={week.toString()}>
              Week {week}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Materials List */}
      {filteredMaterials.length === 0 ? (
        <motion.div variants={itemVariants} className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <HiOutlineSearch className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500">No materials found matching your filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCourse('all');
              setSelectedType('All Types');
              setSelectedWeek('all');
            }}
            className="mt-4 text-blue-500 hover:underline"
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMaterials).map(([courseCode, courseMaterials]) => (
            <motion.div key={courseCode} variants={itemVariants} className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-600 text-sm font-medium">
                  {courseCode}
                </span>
                <span className="text-slate-400 text-sm font-normal">
                  {getCourseById(courseMaterials[0]?.courseId)?.courseName}
                </span>
              </h2>

              <motion.div variants={containerVariants} className="space-y-2">
                {courseMaterials.map((material) => (
                  <motion.div
                    key={material.materialId}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="material-card group"
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getMaterialTypeColor(
                        material.type
                      )}`}
                    >
                      {getMaterialTypeIcon(material.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-medium text-slate-800 truncate">
                            {material.title}
                          </h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                            {material.description}
                          </p>
                        </div>
                        {material.isRequired && (
                          <span className="shrink-0 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                            Required
                          </span>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMaterialTypeColor(
                              material.type
                            )}`}
                          >
                            {material.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiOutlineCalendar className="w-4 h-4" />
                          <span>Week {material.weekNumber}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiOutlineUser className="w-4 h-4" />
                          <span>{material.uploadedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiOutlineClock className="w-4 h-4" />
                          <span>{formatDate(material.uploadDate)}</span>
                        </div>
                        {material.fileSize && (
                          <span className="text-slate-400">{material.fileSize}</span>
                        )}
                      </div>

                      {/* Tags */}
                      {material.tags && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {material.tags.split(',').map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs"
                            >
                              <HiOutlineTag className="w-3 h-3" />
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Due Date */}
                      {material.dueDate && (
                        <div className="mt-2 text-sm text-amber-600 flex items-center gap-1">
                          <HiOutlineClock className="w-4 h-4" />
                          <span>Due: {formatDate(material.dueDate)}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={material.fileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                        title="Open"
                      >
                        <HiOutlineExternalLink className="w-5 h-5" />
                      </a>
                      <a
                        href={material.fileLink}
                        download
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-500 hover:bg-emerald-100 transition-colors"
                        title="Download"
                      >
                        <HiOutlineDownload className="w-5 h-5" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Materials;
