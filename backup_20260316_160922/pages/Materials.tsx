import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiDownload, HiPlay, HiDocument, HiPresentationChartBar,
  HiClipboardList, HiExternalLink, HiSearch, HiFilter
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useData } from '../context/DataContext';
import type { Material } from '../context/DataContext';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.05 } } };

const TYPE_CONFIG = {
  PDF: { icon: HiDocument, color: '#f87171', bg: 'rgba(248,113,113,0.12)', label: 'PDF' },
  Video: { icon: HiPlay, color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', label: 'Video' },
  Slides: { icon: HiPresentationChartBar, color: '#c084fc', bg: 'rgba(192,132,252,0.12)', label: 'Slides' },
  Assignment: { icon: HiClipboardList, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', label: 'Assignment' },
  Link: { icon: HiExternalLink, color: '#34d399', bg: 'rgba(52,211,153,0.12)', label: 'Link' },
};

function MaterialCard({ material, delay }: { material: Material; delay: number }) {
  const cfg = TYPE_CONFIG[material.type];
  const Icon = cfg.icon;

  const handleDownload = () => {
    toast.success(`Downloading "${material.title}"`, {
      style: { background: 'rgba(20,20,30,0.95)', color: '#fff', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '14px' },
      icon: '⬇️',
    });
  };

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -2, scale: 1.005 }}
      className="glass-card rounded-2xl p-4 flex items-center gap-4 cursor-default"
    >
      {/* Type icon */}
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: cfg.bg, border: `1px solid ${cfg.color}25` }}>
        <Icon className="text-xl" style={{ color: cfg.color } as React.CSSProperties} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white/85 text-sm font-medium truncate mb-0.5">{material.title}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-white/40 text-xs">{material.courseName}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-white/40 text-xs">{material.instructor}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex-shrink-0 flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end gap-0.5">
          <span className="text-xs px-2.5 py-1 rounded-lg font-medium"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
            {cfg.label}
          </span>
          <span className="text-white/25 text-[10px]">{material.size}</span>
        </div>
        <span className="text-white/25 text-xs hidden md:block whitespace-nowrap">
          {new Date(material.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleDownload}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/8 transition-colors"
        >
          {material.type === 'Video' ? <HiPlay className="text-sm" /> :
           material.type === 'Link' ? <HiExternalLink className="text-sm" /> :
           <HiDownload className="text-sm" />}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Materials() {
  const { materials, courses, isLoading } = useData();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<Material['type'] | 'all'>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const filtered = materials.filter(m => {
    const matchSearch = search === '' ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.courseName.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'all' || m.type === selectedType;
    const matchCourse = selectedCourse === 'all' || m.courseId === selectedCourse;
    return matchSearch && matchType && matchCourse;
  });

  const typeCounts = Object.keys(TYPE_CONFIG).reduce((acc, t) => {
    acc[t] = materials.filter(m => m.type === t).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      initial="initial" animate="animate" variants={stagger}
      className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-5">
          <div>
            <h1 className="text-white font-bold text-2xl mb-1">Course Materials</h1>
            <p className="text-white/40 text-sm">{materials.length} files · All your course resources in one place</p>
          </div>
          <div className="relative w-full sm:w-64">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search materials..."
              className="input-glass w-full pl-9 pr-4 py-2.5 rounded-2xl text-sm"
            />
          </div>
        </div>

        {/* Type stats */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {(Object.keys(TYPE_CONFIG) as Material['type'][]).map(type => {
            const cfg = TYPE_CONFIG[type];
            const TypeIcon = cfg.icon;
            return (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(selectedType === type ? 'all' : type)}
                className={`rounded-2xl p-3 text-center transition-all duration-200 border ${
                  selectedType === type
                    ? 'border-opacity-100'
                    : 'border-white/8 hover:border-white/15 hover:bg-white/4'
                }`}
                style={selectedType === type ? { background: cfg.bg, borderColor: `${cfg.color}30` } : {}}
              >
                <TypeIcon className="text-xl mx-auto mb-1" style={{ color: cfg.color } as React.CSSProperties} />
                <p className="text-white/70 text-xs font-medium">{type}</p>
                <p className="text-white/40 text-xs">{typeCounts[type] || 0}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Course filter */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 overflow-x-auto pb-1">
        <HiFilter className="text-white/30 flex-shrink-0 text-sm" />
        <button
          onClick={() => setSelectedCourse('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
            selectedCourse === 'all' ? 'text-white bg-white/10 border border-white/15' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
          }`}
        >All Courses</button>
        {courses.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCourse(selectedCourse === c.id ? 'all' : c.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
              selectedCourse === c.id ? 'text-white border' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
            style={selectedCourse === c.id ? { background: `${c.color}18`, borderColor: `${c.color}35`, color: c.color } : {}}
          >
            {c.code}
          </button>
        ))}
      </motion.div>

      {/* Material list */}
      <motion.div variants={stagger} className="space-y-3">
        {isLoading
          ? Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)
          : filtered.length === 0
            ? (
              <motion.div variants={fadeUp} className="glass-card rounded-3xl p-12 text-center">
                <HiDocument className="text-5xl text-white/15 mx-auto mb-3" />
                <p className="text-white/40 font-medium">No materials found</p>
                <p className="text-white/25 text-sm mt-1">Try adjusting your search or filters</p>
              </motion.div>
            )
            : filtered.map((m, i) => <MaterialCard key={m.id} material={m} delay={i * 0.04} />)
        }
      </motion.div>

      {/* Footer count */}
      {filtered.length > 0 && (
        <motion.p variants={fadeUp} className="text-center text-white/25 text-xs pb-4">
          Showing {filtered.length} of {materials.length} materials
        </motion.p>
      )}
    </motion.div>
  );
}
