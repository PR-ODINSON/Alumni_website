import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Building, Cpu, GraduationCap, Users, Wrench, Zap,
} from 'lucide-react';

const BRANCHES = [
  {
    key: 'computer',
    name: 'Computer Engineering',
    short: 'CE',
    icon: Cpu,
    color: '#0169FC',
  },
  {
    key: 'mechanical',
    name: 'Mechanical Engineering',
    short: 'ME',
    icon: Wrench,
    color: '#f59e0b',
  },
  {
    key: 'electrical',
    name: 'Electrical Engineering',
    short: 'EE',
    icon: Zap,
    color: '#1597A2',
  },
  {
    key: 'civil',
    name: 'Civil Engineering',
    short: 'CEv',
    icon: Building,
    color: '#10b981',
  },
];

interface DepartmentCount {
  _id: string;
  count: number;
}

interface LandingStats {
  total: number;
  totalStudents: number;
  mentors: number;
  byDepartment: DepartmentCount[];
  studentsByDepartment: DepartmentCount[];
}

function branchKey(department: string): string | null {
  const value = department.toLowerCase();
  if (value.includes('computer')) return 'computer';
  if (value.includes('mechanical')) return 'mechanical';
  if (value.includes('electrical')) return 'electrical';
  if (value.includes('civil')) return 'civil';
  return null;
}

type BranchDefinition = typeof BRANCHES[number];
type BranchData = BranchDefinition & { alumniCount: number | null; studentCount: number | null };

function countForBranch(rows: DepartmentCount[] | undefined, key: string): number {
  return (rows || []).reduce((total, row) => total + (branchKey(row._id) === key ? row.count : 0), 0);
}

function BranchCard({ branch, index }: { branch: BranchData; index: number }) {
  const Icon = branch.icon;
  const total = (branch.alumniCount || 0) + (branch.studentCount || 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      <div className="h-1" style={{ backgroundColor: branch.color }} />
      <div className="p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50" style={{ color: branch.color }}>
            <Icon size={19} />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900">{branch.name}</h3>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{branch.short}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-200 py-3">
          <div className="pr-3">
            <p className="text-xl font-bold text-slate-900">{branch.alumniCount?.toLocaleString() ?? '—'}</p>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">Verified alumni</p>
          </div>
          <div className="pl-3">
            <p className="text-xl font-bold text-slate-900">{branch.studentCount?.toLocaleString() ?? '—'}</p>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">Enrolled students</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-600">{total.toLocaleString()} records</span>
          <Link
            to={`/directory?branch=${encodeURIComponent(branch.name)}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:text-slate-900"
            style={{ color: branch.color }}
          >
            Browse branch <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function otherAcademicFields(stats?: LandingStats) {
  const fields = new Map<string, { name: string; alumni: number; students: number }>();
  for (const row of stats?.byDepartment || []) {
    if (branchKey(row._id)) continue;
    const key = row._id.trim().toLowerCase();
    const field = fields.get(key) || { name: row._id, alumni: 0, students: 0 };
    field.alumni += row.count;
    fields.set(key, field);
  }
  for (const row of stats?.studentsByDepartment || []) {
    if (branchKey(row._id)) continue;
    const key = row._id.trim().toLowerCase();
    const field = fields.get(key) || { name: row._id, alumni: 0, students: 0 };
    field.students += row.count;
    fields.set(key, field);
  }
  return [...fields.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function Summary({ stats }: { stats?: LandingStats }) {
  const fieldNames = new Set([
    ...(stats?.byDepartment || []).map(row => row._id),
    ...(stats?.studentsByDepartment || []).map(row => row._id),
  ].filter(Boolean));
  const metrics = [
    { label: 'Verified alumni', value: stats?.total },
    { label: 'Enrolled students', value: stats?.totalStudents },
    { label: 'Active mentors', value: stats?.mentors },
    { label: 'Academic fields', value: stats ? fieldNames.size : undefined },
  ];

  return (
    <div className="grid grid-cols-2 border-y border-slate-200 bg-white sm:grid-cols-4">
      {metrics.map((metric, index) => (
        <div key={metric.label} className={`px-4 py-4 sm:px-5 ${index > 0 ? 'border-l border-slate-200' : ''}`}>
          <p className="text-2xl font-bold text-slate-900">{typeof metric.value === 'number' ? metric.value.toLocaleString() : '—'}</p>
          <p className="mt-1 text-[11px] font-semibold text-slate-500">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function BranchShowcase({ stats }: { stats?: LandingStats }) {
  const branches: BranchData[] = BRANCHES.map(branch => ({
    ...branch,
    alumniCount: stats ? countForBranch(stats.byDepartment, branch.key) : null,
    studentCount: stats ? countForBranch(stats.studentsByDepartment, branch.key) : null,
  }));
  const otherFields = otherAcademicFields(stats);

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-iitram-700">
              <GraduationCap size={14} /> IITRAM academic network
            </span>
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Engineering branches</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Alumni and active student totals are drawn from current institute records.
            </p>
          </div>
          <Link to="/directory" className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 transition-colors hover:border-slate-500 sm:self-auto">
            Browse directory <ArrowRight size={14} />
          </Link>
        </div>

        <Summary stats={stats} />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {branches.map((branch, index) => <BranchCard key={branch.key} branch={branch} index={index} />)}
        </div>

        {otherFields.length > 0 && (
          <div className="mt-8 border-t border-slate-200 pt-5">
            <h3 className="text-sm font-bold text-slate-800">Other academic fields</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {otherFields.map(field => (
                <span key={field.name} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <span className="font-semibold">{field.name}</span>
                  <span className="text-slate-500">{(field.alumni + field.students).toLocaleString()} records</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
