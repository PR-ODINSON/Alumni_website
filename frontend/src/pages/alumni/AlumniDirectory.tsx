import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, SlidersHorizontal, X, Globe } from 'lucide-react';
import { alumniApi } from '../../lib/api';
import { DEPARTMENTS, INDUSTRIES, debounce } from '../../lib/utils';
import AlumniFilters from './components/AlumniFilters';

import AlumniCard from './components/AlumniCard';

export default function AlumniDirectoryPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    batch: '', department: '', industry: '', location: '',
    isMentor: false, employmentStatus: '', degreeType: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const debouncedSearch = useCallback(debounce((val: string) => setSearch(val), 400), []);

  const queryParams = {
    page,
    limit: 24,
    search: search || undefined,
    ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '' && v !== false)),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['alumni', queryParams],
    queryFn: () => alumniApi.getAll(queryParams),
    placeholderData: (prev: any) => prev,
  });

  const alumni = (data as any)?.data?.data || [];
  const pagination = (data as any)?.data?.pagination;

  const activeFilterCount = Object.values(filters).filter(v => v !== '' && v !== false).length;

  const clearFilters = () => {
    setFilters({ batch: '', department: '', industry: '', location: '', isMentor: false, employmentStatus: '', degreeType: '' });
    setPage(1);
  };

  return (
    <div className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative bg-white rounded-xl border border-slate-200 p-5 md:p-6 mt-4 mb-6 shadow-xs text-slate-900 overflow-hidden font-sans">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-0.5 font-display">Alumni Directory</h1>
              <p className="text-slate-500 text-xs font-semibold">
                {pagination?.total ? `${pagination.total.toLocaleString()} alumni` : 'Discover'} across industries and geographies
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold">
              <span className="flex items-center gap-1.5"><Users size={14} className="text-[#0169FC]" /> Alumni Network</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#0169FC]" /> Global Presence</span>
            </div>
          </div>
 
          {/* Search + Filter bar */}
          <div className="flex gap-3.5 max-w-2xl">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                onChange={(e) => { debouncedSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, company, skills..."
                className="w-full pl-10 pr-4 h-10 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0169FC]/25 focus:border-[#0169FC]/40"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 h-10 rounded-lg border text-xs font-bold transition-all cursor-pointer ${showFilters || activeFilterCount > 0 ? 'bg-[#0169FC] border-[#0169FC] text-white shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-[#0169FC] text-[10px] flex items-center justify-center font-extrabold ml-1 border border-[#0169FC]/20">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
 
          {/* Filters Panel */}
          <AlumniFilters
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            activeFilterCount={activeFilterCount}
            clearFilters={clearFilters}
            setPage={setPage}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="py-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full skeleton" />
                  <div className="flex-1">
                    <div className="h-4 skeleton rounded mb-2 w-3/4" />
                    <div className="h-3 skeleton rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 skeleton rounded mb-2" />
                <div className="h-3 skeleton rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : alumni.length === 0 ? (
          <div className="text-center py-24 bg-white/40 backdrop-blur rounded-3xl p-8 border border-white/40 shadow-soft">
            <Users size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No alumni found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {alumni.map((a: any) => (
                <AlumniCard key={a._id} alumni={a} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-outline btn-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(7, pagination.pages) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="btn btn-outline btn-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
