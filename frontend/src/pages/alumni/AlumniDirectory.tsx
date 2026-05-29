import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, Filter, MapPin, Building, GraduationCap, Users,
  Briefcase, Star, ChevronDown, X, SlidersHorizontal, Award,
  MessageCircle, UserPlus, Globe,
} from 'lucide-react';
import { alumniApi } from '../../lib/api';
import { DEPARTMENTS, INDUSTRIES, debounce } from '../../lib/utils';
import Avatar from '../../components/ui/Avatar';

const EMPLOYMENT_STATUSES = ['employed', 'self-employed', 'entrepreneur', 'higher-studies', 'unemployed'];
const DEGREE_TYPES = ['B.Tech', 'M.Tech', 'MBA', 'PhD', 'Diploma'];
const CURRENT_YEAR = new Date().getFullYear();
const BATCHES = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR - i);

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative bg-slate-900 border-b border-slate-800 text-white">
        <div className="absolute inset-0">
          <img src="/images/alumni-directory.png" alt="Alumni Directory" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>
        <div className="relative z-10 page-container py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Alumni Directory</h1>
              <p className="text-slate-300 text-lg">
                {pagination?.total ? `${pagination.total.toLocaleString()} alumni` : 'Discover'} across industries and geographies
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-300 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/10">
              <span className="flex items-center gap-1.5"><Users size={16} className="text-iitram-300" /> Alumni Network</span>
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="flex items-center gap-1.5"><Globe size={16} className="text-iitram-300" /> Global Presence</span>
            </div>
          </div>

          {/* Search + Filter bar */}
          <div className="flex gap-3 max-w-3xl">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                onChange={(e) => { debouncedSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, company, skills..."
                className="w-full pl-12 pr-4 h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-iitram-500 backdrop-blur-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-medium transition-all backdrop-blur-sm ${showFilters || activeFilterCount > 0 ? 'bg-iitram-600 border-iitram-500 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-iitram-700 text-xs flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>


          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    <select
                      value={filters.batch}
                      onChange={(e) => { setFilters(f => ({ ...f, batch: e.target.value })); setPage(1); }}
                      className="input text-sm"
                    >
                      <option value="">All Batches</option>
                      {BATCHES.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>

                    <select
                      value={filters.department}
                      onChange={(e) => { setFilters(f => ({ ...f, department: e.target.value })); setPage(1); }}
                      className="input text-sm"
                    >
                      <option value="">All Depts.</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select
                      value={filters.industry}
                      onChange={(e) => { setFilters(f => ({ ...f, industry: e.target.value })); setPage(1); }}
                      className="input text-sm"
                    >
                      <option value="">All Industries</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>

                    <select
                      value={filters.degreeType}
                      onChange={(e) => { setFilters(f => ({ ...f, degreeType: e.target.value })); setPage(1); }}
                      className="input text-sm"
                    >
                      <option value="">All Degrees</option>
                      {DEGREE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select
                      value={filters.employmentStatus}
                      onChange={(e) => { setFilters(f => ({ ...f, employmentStatus: e.target.value })); setPage(1); }}
                      className="input text-sm"
                    >
                      <option value="">All Status</option>
                      {EMPLOYMENT_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>

                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => { setFilters(f => ({ ...f, location: e.target.value })); setPage(1); }}
                      placeholder="Location..."
                      className="input text-sm"
                    />

                    <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 cursor-pointer hover:border-iitram-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.isMentor}
                        onChange={(e) => { setFilters(f => ({ ...f, isMentor: e.target.checked })); setPage(1); }}
                        className="w-4 h-4 rounded border-slate-300 text-iitram-700 focus:ring-iitram-500"
                      />
                      <span className="text-sm text-slate-700">Mentors only</span>
                    </label>
                  </div>

                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="flex items-center gap-1.5 mt-3 text-sm text-slate-500 hover:text-red-600 transition-colors">
                      <X size={14} /> Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid */}
      <div className="page-container py-8">
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
          <div className="text-center py-24">
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
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-iitram-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
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

function AlumniCard({ alumni }: { alumni: any }) {
  const user = alumni.user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-hover p-5 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <Link to={`/alumni/${user._id}`} className="flex items-center gap-3">
          <Avatar
            src={user?.avatar}
            name={`${user?.firstName} ${user?.lastName}`}
            size="lg"
            verified={alumni.verificationStatus === 'verified'}
          />
          <div>
            <p className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-iitram-700 transition-colors">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[140px]">
              {alumni.currentDesignation || 'Alumni'}
            </p>
          </div>
        </Link>
        {alumni.isDistinguished && (
          <Award size={16} className="text-gold-500 flex-shrink-0" />
        )}
      </div>

      {/* Current company */}
      {alumni.currentCompany && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Building size={12} className="flex-shrink-0" />
          <span className="truncate">{alumni.currentCompany}</span>
        </div>
      )}

      {/* Location */}
      {user?.location?.city && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <MapPin size={12} className="flex-shrink-0" />
          <span>{user.location.city}{user.location.country ? `, ${user.location.country}` : ''}</span>
        </div>
      )}

      {/* Batch & Dept */}
      <div className="flex items-center gap-2 mb-3">
        <div className="badge badge-primary">{alumni.degreeType} {alumni.batch}</div>
        {alumni.isMentor && (
          <div className="badge badge-success">Mentor</div>
        )}
      </div>

      {/* Skills */}
      {alumni.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {alumni.skills.slice(0, 3).map((skill: string) => (
            <span key={skill} className="text-2xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              {skill}
            </span>
          ))}
          {alumni.skills.length > 3 && (
            <span className="text-2xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
              +{alumni.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-slate-100">
        <Link
          to={`/alumni/${user._id}`}
          className="flex-1 btn btn-secondary btn-sm text-center justify-center"
        >
          View Profile
        </Link>
        {alumni.isMentor && (
          <Link
            to={`/mentorship?mentor=${user._id}`}
            className="btn btn-primary btn-sm"
          >
            <Star size={13} />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
