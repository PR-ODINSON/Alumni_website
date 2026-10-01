import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Cpu, Zap, Building, Flame, FlaskConical, Wrench,
  TrendingUp, ArrowRight, Users, GraduationCap, ChevronLeft, ChevronRight,
} from 'lucide-react';

// ── Branch data ───────────────────────────────────────────────────────────────
const BRANCHES = [
  {
    id: 'ce',
    name: 'Computer Engineering',
    short: 'CE',
    icon: Cpu,
    color: '#0169FC',
    bg: 'from-blue-600 to-blue-800',
    light: 'bg-blue-50 text-blue-700 border-blue-200',
    alumni: 420,
    topRoles: ['Software Engineer', 'Data Scientist', 'DevOps'],
    companies: ['Google', 'Microsoft', 'Infosys', 'TCS'],
    description: 'The largest and most placement-active branch at IITRAM, producing engineers across software, AI, and cloud.',
  },
  {
    id: 'me',
    name: 'Mechanical Engineering',
    short: 'ME',
    icon: Wrench,
    color: '#f59e0b',
    bg: 'from-amber-500 to-orange-600',
    light: 'bg-amber-50 text-amber-700 border-amber-200',
    alumni: 380,
    topRoles: ['Design Engineer', 'Product Manager', 'R&D Lead'],
    companies: ['L&T', 'ISRO', 'Tata Motors', 'Bosch'],
    description: 'Core engineering with strong industry ties to manufacturing, automotive, and space research.',
  },
  {
    id: 'ci',
    name: 'Civil Engineering',
    short: 'CI',
    icon: Building,
    color: '#10b981',
    bg: 'from-emerald-500 to-teal-600',
    light: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    alumni: 290,
    topRoles: ['Site Engineer', 'Urban Planner', 'Consultant'],
    companies: ['L&T Construction', 'AECOM', 'NHAI', 'GIDC'],
    description: 'Infrastructure-focused program aligned with Gujarat\'s rapid urban and industrial development.',
  },
  {
    id: 'ee',
    name: 'Electrical Engineering',
    short: 'EE',
    icon: Zap,
    color: '#8b5cf6',
    bg: 'from-violet-500 to-purple-700',
    light: 'bg-violet-50 text-violet-700 border-violet-200',
    alumni: 240,
    topRoles: ['Power Systems Eng.', 'Control Systems', 'Automation'],
    companies: ['Siemens', 'ABB', 'PGVCL', 'GETCO'],
    description: 'Covers power systems, smart grids, and industrial automation with strong utility-sector placements.',
  },
  {
    id: 'ec',
    name: 'Electronics & Comm.',
    short: 'EC',
    icon: Flame,
    color: '#f43f5e',
    bg: 'from-rose-500 to-pink-700',
    light: 'bg-rose-50 text-rose-700 border-rose-200',
    alumni: 210,
    topRoles: ['VLSI Engineer', 'Embedded Systems', 'RF Engineer'],
    companies: ['Qualcomm', 'Texas Instruments', 'DRDO', 'Jio'],
    description: 'Deep focus on semiconductors, IoT, and communication systems with research-oriented curriculum.',
  },
  {
    id: 'ch',
    name: 'Chemical Engineering',
    short: 'CH',
    icon: FlaskConical,
    color: '#06b6d4',
    bg: 'from-cyan-500 to-sky-700',
    light: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    alumni: 160,
    topRoles: ['Process Engineer', 'Plant Manager', 'Research Sci.'],
    companies: ['Reliance', 'ONGC', 'GSPC', 'UPL'],
    description: 'Strategic program for Gujarat\'s petrochemical and pharmaceutical industrial corridor.',
  },
];

// ── Card component ────────────────────────────────────────────────────────────
function BranchCard({ branch, index }: { branch: typeof BRANCHES[0]; index: number }) {
  const Icon = branch.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${branch.bg}`} />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: branch.color + '18' }}
            >
              <Icon size={20} style={{ color: branch.color }} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{branch.name}</h3>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 inline-block"
                style={{ backgroundColor: branch.color + '12', color: branch.color, borderColor: branch.color + '30' }}
              >
                {branch.short}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-extrabold text-slate-900 leading-none">{branch.alumni}+</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Alumni</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed mb-4">{branch.description}</p>

        {/* Top roles */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Top Roles</p>
          <div className="flex flex-wrap gap-1.5">
            {branch.topRoles.map(role => (
              <span key={role} className="text-[10px] font-semibold px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg">
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Companies */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Where They Work</p>
          <div className="flex flex-wrap gap-1.5">
            {branch.companies.map(co => (
              <span
                key={co}
                className="text-[10px] font-bold px-2 py-1 rounded-lg border"
                style={{ backgroundColor: branch.color + '08', color: branch.color, borderColor: branch.color + '25' }}
              >
                {co}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <Link
          to={`/directory?branch=${encodeURIComponent(branch.name)}`}
          className="flex items-center justify-between w-full pt-3 border-t border-slate-100 text-xs font-bold transition-colors"
          style={{ color: branch.color }}
        >
          <span className="flex items-center gap-1.5">
            <Users size={12} /> View {branch.short} Alumni
          </span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Animated bottom glow on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ boxShadow: `inset 0 0 0 2px ${branch.color}30` }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function StatsBar() {
  const total = BRANCHES.reduce((s, b) => s + b.alumni, 0);
  return (
    <div className="bg-[#001129] rounded-2xl p-5 sm:p-6 mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-4">
        {[
          { icon: GraduationCap, value: `${total}+`, label: 'Alumni Across Branches', color: '#4FA9FF' },
          { icon: Building,      value: '6',         label: 'Engineering Branches',   color: '#10b981' },
          { icon: TrendingUp,    value: '86%',        label: 'Placement Rate',         color: '#f59e0b' },
          { icon: Users,         value: '300+',       label: 'Active Mentors',         color: '#a78bfa' },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '18' }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className="text-white font-extrabold text-base leading-none">{value}</p>
              <p className="text-slate-500 text-[10px] font-semibold mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Branch share bar */}
      <div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Alumni Distribution by Branch</p>
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          {BRANCHES.map(b => (
            <motion.div
              key={b.id}
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.round((b.alumni / total) * 100)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full rounded-sm"
              style={{ backgroundColor: b.color }}
              title={`${b.short}: ${b.alumni} alumni`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {BRANCHES.map(b => (
            <span key={b.id} className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
              {b.short}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function BranchShowcase() {
  const ref = useRef(null);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-3">
              <GraduationCap size={12} /> Branch-wise Network
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Alumni by<br className="hidden sm:block" />{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0169FC] to-[#1597A2]">
                Engineering Branch
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-lg">
              Explore IITRAM's alumni across 6 engineering disciplines — see where they work, what roles they hold, and connect with them directly.
            </p>
          </div>
          <Link
            to="/directory"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#001129] hover:bg-[#0169FC] text-white font-bold text-xs rounded-xl transition-all shrink-0 self-start sm:self-auto shadow-lg"
          >
            Browse Directory <ArrowRight size={13} />
          </Link>
        </motion.div>

        {/* Stats bar */}
        <StatsBar />

        {/* Branch cards grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BRANCHES.map((branch, i) => (
            <BranchCard key={branch.id} branch={branch} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
