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

import StudentCard, { SkeletonCard } from './components/StudentCard';
import StudentFilters from './components/StudentFilters';
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
    <div className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative bg-white/70 backdrop-blur-md rounded-[1.75rem] border border-white/50 p-6 md:p-8 mt-4 mb-6 shadow-soft text-slate-900 overflow-hidden">
        {/* Subtle gradient decorative glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Student Directory</h1>
              <p className="text-slate-500 text-sm md:text-base">Connect with current IITRAM students</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-100/60 px-4 py-2 rounded-xl border border-slate-200/50">
              <Users size={16} className="text-brand-500" />
              <span>{pagination?.total || 0} students</span>
            </div>
          </div>

          {/* Search + Filter bar */}
          <div className="flex gap-3">
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
                activeFilterCount > 0 && 'border-brand-400 text-brand-700 bg-brand-50'
              )}
            >
              <Filter size={15} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters panel */}
          <StudentFilters
            filters={filters}
            setFilters={setFilters}
            filtersOpen={filtersOpen}
            clearFilters={clearFilters}
            setPage={setPage}
            activeFilterCount={activeFilterCount}
          />
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
              <button onClick={clearFilters} className="btn btn-primary mt-4">Clear Filters</button>
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
                      p === page ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100'
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
