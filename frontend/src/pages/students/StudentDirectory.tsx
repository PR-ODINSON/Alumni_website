import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, GraduationCap, MapPin, Briefcase, BookOpen,
  Filter, X, ChevronLeft, ChevronRight, Users, Star,
} from 'lucide-react';
import { studentApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatRelativeTime, cn } from '../../lib/utils';
import Avatar from '../../components/ui/Avatar';

const DEPARTMENTS = [
  'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
  'Computer Science', 'Chemical Engineering', 'Infrastructure Engineering',
  'Environmental Engineering', 'Architecture',
];

const YEARS = [2024, 2025, 2026, 2027, 2028];

function StudentCard({ student }: { student: any }) {
  const user = student.user || {};
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <Link to={`/students/${user._id}`} className="block group">
        <div className="card-hover p-5 flex items-start gap-4 h-full">
          <Avatar
            src={user.avatar}
            initials={`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-slate-900 group-hover:text-iitram-700 transition-colors truncate">
                {fullName || 'IITRAM Student'}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                {student.openToWork && (
                  <span className="badge-success text-xs">Open to Work</span>
                )}
                {student.seekingMentor && (
                  <span className="badge-primary text-xs">Seeking Mentor</span>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
              <GraduationCap size={13} />
              <span>{student.department} · Batch {student.batch}</span>
            </p>

            {user.location?.city && (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin size={11} />
                {user.location.city}{user.location.country ? `, ${user.location.country}` : ''}
              </p>
            )}

            {student.currentRole && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Briefcase size={11} />
                {student.currentRole}
              </p>
            )}

            {user.bio && (
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{user.bio}</p>
            )}

            {student.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {student.skills.slice(0, 4).map((skill: string) => (
                  <span key={skill} className="badge bg-slate-100 text-slate-600 text-xs">{skill}</span>
                ))}
                {student.skills.length > 4 && (
                  <span className="badge bg-slate-100 text-slate-500 text-xs">+{student.skills.length - 4}</span>
                )}
              </div>
            )}

            {student.interests?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {student.interests.slice(0, 3).map((interest: string) => (
                  <span key={interest} className="badge bg-iitram-50 text-iitram-600 text-xs">{interest}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className="skeleton w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-36 rounded" />
        <div className="skeleton h-3 w-48 rounded" />
        <div className="skeleton h-3 w-32 rounded" />
        <div className="flex gap-1 mt-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-5 w-16 rounded-full" />)}
        </div>
      </div>
    </div>
  );
}

export default function StudentDirectory() {
  const { isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    batch: '',
    openToWork: false,
    seekingMentor: false,
  });
  const [page, setPage] = useState(1);

  const debounce = useCallback((value: string) => {
    const t = setTimeout(() => setDebouncedSearch(value), 400);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    debounce(e.target.value);
  };

  const queryParams: Record<string, any> = { page, limit: 16 };
  if (debouncedSearch) queryParams.search = debouncedSearch;
  if (filters.department) queryParams.department = filters.department;
  if (filters.batch) queryParams.batch = filters.batch;
  if (filters.openToWork) queryParams.openToWork = true;
  if (filters.seekingMentor) queryParams.seekingMentor = true;

  const { data, isLoading } = useQuery({
    queryKey: ['students', queryParams],
    queryFn: () => studentApi.getAll(queryParams),
    placeholderData: (prev: any) => prev,
  });

  const students = (data as any)?.data?.data || [];
  const pagination = (data as any)?.data?.pagination;
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ department: '', batch: '', openToWork: false, seekingMentor: false });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="page-container py-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
              <p className="text-slate-500 mt-1">Connect with current IITRAM students</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <Users size={16} />
              <span>{pagination?.total || 0} students</span>
            </div>
          </div>

          {/* Search + Filter bar */}
          <div className="flex gap-3 mt-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by name, skill, interest..."
                className="input pl-10"
              />
            </div>
            <button
              onClick={() => setFiltersOpen(o => !o)}
              className={cn(
                'btn-outline flex items-center gap-2',
                activeFilterCount > 0 && 'border-iitram-400 text-iitram-700 bg-iitram-50'
              )}
            >
              <Filter size={15} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-iitram-700 text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">Department</label>
                    <select
                      value={filters.department}
                      onChange={e => { setFilters(f => ({ ...f, department: e.target.value })); setPage(1); }}
                      className="input text-sm"
                    >
                      <option value="">All Departments</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">Batch Year</label>
                    <select
                      value={filters.batch}
                      onChange={e => { setFilters(f => ({ ...f, batch: e.target.value })); setPage(1); }}
                      className="input text-sm"
                    >
                      <option value="">All Batches</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-3 justify-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.openToWork}
                        onChange={e => { setFilters(f => ({ ...f, openToWork: e.target.checked })); setPage(1); }}
                        className="w-4 h-4 rounded border-slate-300 text-iitram-600"
                      />
                      <span className="text-sm text-slate-700">Open to Work</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.seekingMentor}
                        onChange={e => { setFilters(f => ({ ...f, seekingMentor: e.target.checked })); setPage(1); }}
                        className="w-4 h-4 rounded border-slate-300 text-iitram-600"
                      />
                      <span className="text-sm text-slate-700">Seeking Mentor</span>
                    </label>
                  </div>
                  <div className="flex items-end">
                    <button onClick={clearFilters} className="btn-ghost flex items-center gap-1 text-sm w-full justify-center">
                      <X size={14} /> Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid */}
      <div className="page-container py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : students.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No students found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {students.map((student: any) => (
                <StudentCard key={student._id} student={student} />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline btn-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const p = Math.max(1, Math.min(pagination.pages - 4, page - 2)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-9 h-9 rounded-lg text-sm font-medium transition-all',
                      p === page ? 'bg-iitram-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="btn-outline btn-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
