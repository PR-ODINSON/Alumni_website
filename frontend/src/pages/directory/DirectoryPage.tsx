import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, SlidersHorizontal, GraduationCap, Globe, Briefcase } from 'lucide-react';
import { alumniApi, studentApi } from '../../lib/api';
import { DEPARTMENTS, debounce } from '../../lib/utils';
import AlumniCard from '../alumni/components/AlumniCard';
import AlumniFilters from '../alumni/components/AlumniFilters';
import StudentCard, { SkeletonCard } from '../students/components/StudentCard';
import StudentFilters from '../students/components/StudentFilters';

type RoleTab = 'alumni' | 'students';

const ROLE_TABS: { id: RoleTab; label: string; icon: React.FC<any> }[] = [
  { id: 'alumni',   label: 'Alumni',   icon: Briefcase },
  { id: 'students', label: 'Students', icon: GraduationCap },
];

export default function DirectoryPage() {
  const [activeRole, setActiveRole] = useState<RoleTab>('alumni');

  // ── Alumni state ──────────────────────────────────────────────────────────
  const [alumniSearch, setAlumniSearch] = useState('');
  const [alumniFilters, setAlumniFilters] = useState({
    batch: '', department: '', industry: '', location: '',
    isMentor: false, employmentStatus: '', degreeType: '',
  });
  const [alumniPage, setAlumniPage] = useState(1);
  const [showAlumniFilters, setShowAlumniFilters] = useState(false);

  const debouncedAlumniSearch = useCallback(debounce((val: string) => setAlumniSearch(val), 400), []);

  const alumniActiveFilterCount = Object.values(alumniFilters).filter(v => v !== '' && v !== false).length;
  const clearAlumniFilters = () => {
    setAlumniFilters({ batch: '', department: '', industry: '', location: '', isMentor: false, employmentStatus: '', degreeType: '' });
    setAlumniPage(1);
  };

  const alumniQuery = useQuery({
    queryKey: ['alumni', { alumniSearch, alumniPage, ...alumniFilters }],
    queryFn: () => alumniApi.getAll({
      page: alumniPage, limit: 24,
      search: alumniSearch || undefined,
      ...Object.fromEntries(Object.entries(alumniFilters).filter(([_, v]) => v !== '' && v !== false)),
    }),
    placeholderData: (prev: any) => prev,
    enabled: activeRole === 'alumni',
  });
  const alumni = (alumniQuery.data as any)?.data?.data || [];
  const alumniPagination = (alumniQuery.data as any)?.data?.pagination;

  // ── Student state ─────────────────────────────────────────────────────────
  const [studentSearch, setStudentSearch] = useState('');
  const [debouncedStudentSearch, setDebouncedStudentSearch] = useState('');
  const [studentFilters, setStudentFilters] = useState({ department: '', batch: '', openToWork: false, seekingMentor: false });
  const [studentPage, setStudentPage] = useState(1);
  const [showStudentFilters, setShowStudentFilters] = useState(false);

  const handleStudentSearch = (val: string) => {
    setStudentSearch(val);
    setStudentPage(1);
    setTimeout(() => setDebouncedStudentSearch(val), 400);
  };
  const studentActiveFilterCount = Object.values(studentFilters).filter(Boolean).length;
  const clearStudentFilters = () => {
    setStudentFilters({ department: '', batch: '', openToWork: false, seekingMentor: false });
    setStudentPage(1);
  };

  const studentQuery = useQuery({
    queryKey: ['students', { debouncedStudentSearch, studentPage, ...studentFilters }],
    queryFn: () => {
      const params: Record<string, any> = { page: studentPage, limit: 16 };
      if (debouncedStudentSearch) params.search = debouncedStudentSearch;
      if (studentFilters.department) params.department = studentFilters.department;
      if (studentFilters.batch) params.batch = studentFilters.batch;
      if (studentFilters.openToWork) params.openToWork = true;
      if (studentFilters.seekingMentor) params.seekingMentor = true;
      return studentApi.getAll(params);
    },
    placeholderData: (prev: any) => prev,
    enabled: activeRole === 'students',
  });
  const students = (studentQuery.data as any)?.data?.data || [];
  const studentPagination = (studentQuery.data as any)?.data?.pagination;

  const isLoading = activeRole === 'alumni' ? alumniQuery.isLoading : studentQuery.isLoading;
  const total = activeRole === 'alumni' ? (alumniPagination?.total ?? 0) : (studentPagination?.total ?? 0);

  return (
    <div className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative bg-white rounded-xl border border-slate-200 p-5 md:p-6 mt-4 mb-6 shadow-xs text-slate-900 overflow-hidden font-sans">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-0.5 font-display">People Directory</h1>
              <p className="text-slate-500 text-xs font-semibold">
                {total > 0 ? `${total.toLocaleString()} people` : 'Discover'} across the IITRAM network
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold">
              <span className="flex items-center gap-1.5"><Users size={14} className="text-[#0169FC]" /> Alumni Network</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#0169FC]" /> Global Presence</span>
            </div>
          </div>

          {/* Role Tabs */}
          <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
            {ROLE_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveRole(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeRole === id
                    ? 'bg-white shadow-sm text-[#0169FC] border border-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Search + Filter bar */}
          <div className="flex gap-3.5 max-w-2xl">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                key={activeRole}
                type="text"
                onChange={(e) => {
                  if (activeRole === 'alumni') { debouncedAlumniSearch(e.target.value); setAlumniPage(1); }
                  else { handleStudentSearch(e.target.value); }
                }}
                placeholder={activeRole === 'alumni' ? 'Search by name, company, skills...' : 'Search by name, skill, interest...'}
                className="w-full pl-10 pr-4 h-10 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0169FC]/25 focus:border-[#0169FC]/40"
              />
            </div>
            <button
              onClick={() => activeRole === 'alumni' ? setShowAlumniFilters(f => !f) : setShowStudentFilters(f => !f)}
              className={`flex items-center gap-1.5 px-4 h-10 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                (activeRole === 'alumni' && (showAlumniFilters || alumniActiveFilterCount > 0)) ||
                (activeRole === 'students' && (showStudentFilters || studentActiveFilterCount > 0))
                  ? 'bg-[#0169FC] border-[#0169FC] text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {(activeRole === 'alumni' ? alumniActiveFilterCount : studentActiveFilterCount) > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-[#0169FC] text-[10px] flex items-center justify-center font-extrabold ml-1 border border-[#0169FC]/20">
                  {activeRole === 'alumni' ? alumniActiveFilterCount : studentActiveFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {activeRole === 'alumni' && (
              <AlumniFilters
                filters={alumniFilters}
                setFilters={setAlumniFilters}
                showFilters={showAlumniFilters}
                activeFilterCount={alumniActiveFilterCount}
                clearFilters={clearAlumniFilters}
                setPage={setAlumniPage}
              />
            )}
            {activeRole === 'students' && (
              <StudentFilters
                filters={studentFilters}
                setFilters={setStudentFilters}
                filtersOpen={showStudentFilters}
                activeFilterCount={studentActiveFilterCount}
                clearFilters={clearStudentFilters}
                setPage={setStudentPage}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {activeRole === 'alumni' && (
          <motion.div key="alumni" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="card p-5 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-full skeleton" />
                      <div className="flex-1"><div className="h-4 skeleton rounded mb-2 w-3/4" /><div className="h-3 skeleton rounded w-1/2" /></div>
                    </div>
                    <div className="h-3 skeleton rounded mb-2" /><div className="h-3 skeleton rounded w-5/6" />
                  </div>
                ))}
              </div>
            ) : alumni.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
                <Users size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No alumni found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
                <button onClick={clearAlumniFilters} className="btn btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {alumni.map((a: any) => <AlumniCard key={a._id} alumni={a} />)}
                </div>
                {alumniPagination && alumniPagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button onClick={() => setAlumniPage(p => Math.max(1, p - 1))} disabled={alumniPage === 1} className="btn btn-outline btn-sm disabled:opacity-40">Previous</button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(7, alumniPagination.pages) }, (_, i) => {
                        const p = i + 1;
                        return (
                          <button key={p} onClick={() => setAlumniPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${alumniPage === p ? 'bg-[#0169FC] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{p}</button>
                        );
                      })}
                    </div>
                    <button onClick={() => setAlumniPage(p => Math.min(alumniPagination.pages, p + 1))} disabled={alumniPage === alumniPagination.pages} className="btn btn-outline btn-sm disabled:opacity-40">Next</button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {activeRole === 'students' && (
          <motion.div key="students" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
                <GraduationCap size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No students found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
                {studentActiveFilterCount > 0 && <button onClick={clearStudentFilters} className="btn btn-primary">Clear Filters</button>}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {students.map((student: any) => <StudentCard key={student._id} student={student} />)}
                </div>
                {studentPagination && studentPagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button onClick={() => setStudentPage(p => Math.max(1, p - 1))} disabled={studentPage === 1} className="btn btn-outline btn-sm">Previous</button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, studentPagination.pages) }, (_, i) => {
                        const p = Math.max(1, Math.min(studentPagination.pages - 4, studentPage - 2)) + i;
                        return (
                          <button key={p} onClick={() => setStudentPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p === studentPage ? 'bg-[#0169FC] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{p}</button>
                        );
                      })}
                    </div>
                    <button onClick={() => setStudentPage(p => Math.min(studentPagination.pages, p + 1))} disabled={studentPage === studentPagination.pages} className="btn btn-outline btn-sm">Next</button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
