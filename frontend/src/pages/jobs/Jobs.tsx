import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Briefcase, Bookmark, Plus, Zap } from 'lucide-react';
import { jobApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { INDUSTRIES } from '../../lib/utils';
import JobCard from './components/JobCard';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    jobType: '', industry: '', locationType: '', isReferralAvailable: false,
  });
  const [page, setPage] = useState(1);
  const tab = searchParams.get('tab') || 'browse';

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', search, filters, page],
    queryFn: () => jobApi.getAll({ search: search || undefined, page, limit: 20, ...filters }),
  });

  const { data: savedJobsData } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: jobApi.getSaved,
    enabled: isAuthenticated && tab === 'saved',
  });

  const { data: applicationsData } = useQuery({
    queryKey: ['my-applications'],
    queryFn: jobApi.getApplications,
    enabled: isAuthenticated && tab === 'applications',
  });

  const jobs = data?.data?.data || [];

  return (
    <div className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative bg-white rounded-xl border border-slate-200 p-5 md:p-6 mt-4 mb-6 shadow-xs text-slate-900 overflow-hidden font-sans">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-0.5 font-display">Jobs & Opportunities</h1>
              <p className="text-slate-500 text-xs font-semibold">Exclusive positions shared by the IITRAM alumni network</p>
            </div>
            {isAuthenticated && (user?.role === 'alumni' || user?.role === 'admin') && (
              <Link to="/jobs/post" className="btn btn-primary shadow-xs hover:-translate-y-0.5 transition-all shrink-0 py-2 px-4 text-xs font-bold rounded-lg cursor-pointer">
                <Plus size={14} /> Post a Job
              </Link>
            )}
          </div>
 
          {/* Tabs */}
          <div className="flex gap-1.5 mb-5">
            {[
              { label: 'Browse Jobs', value: 'browse' },
              ...(isAuthenticated ? [
                { label: 'Saved', value: 'saved' },
                { label: 'My Applications', value: 'applications' },
              ] : []),
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSearchParams({ tab: value })}
                className={tab === value ? 'filter-pill-active' : 'filter-pill'}
              >
                {label}
              </button>
            ))}
          </div>
 
          {tab === 'browse' && (
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search jobs, companies, skills..."
                  className="input pl-9 h-10 text-xs"
                />
              </div>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters(f => ({ ...f, jobType: e.target.value }))}
                className="input h-10 w-40 text-xs py-1 px-2.5"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
              <select
                value={filters.locationType}
                onChange={(e) => setFilters(f => ({ ...f, locationType: e.target.value }))}
                className="input h-11 w-36"
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
              <select
                value={filters.industry}
                onChange={(e) => setFilters(f => ({ ...f, industry: e.target.value }))}
                className="input h-11 w-44"
              >
                <option value="">All Industries</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <label className="flex items-center gap-2 px-3 h-11 rounded-lg border border-slate-200 cursor-pointer bg-white/60 hover:border-brand-500/40 hover:bg-white/80 transition-colors text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={filters.isReferralAvailable}
                  onChange={(e) => setFilters(f => ({ ...f, isReferralAvailable: e.target.checked }))}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 focus:outline-none"
                />
                <Zap size={14} className="text-amber-500" /> Referral Available
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="py-4">
        {tab === 'browse' && (
          <>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card p-5 animate-pulse flex gap-4">
                    <div className="w-12 h-12 rounded-xl skeleton" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 skeleton rounded w-1/3" />
                      <div className="h-4 skeleton rounded w-1/4" />
                      <div className="h-3 skeleton rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="card p-16 text-center">
                <Briefcase size={40} className="text-slate-350 mx-auto mb-4" />
                <p className="text-slate-500">No jobs found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job: any, i: number) => (
                  <JobCard key={job._id} job={job} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'saved' && (
          <div className="space-y-4">
            {savedJobsData?.data?.data?.length === 0 ? (
              <div className="card p-16 text-center">
                <Bookmark size={40} className="text-slate-355 mx-auto mb-4" />
                <p className="text-slate-500">No saved jobs yet</p>
                <button onClick={() => setSearchParams({ tab: 'browse' })} className="btn btn-primary mt-4">Browse Jobs</button>
              </div>
            ) : (
              savedJobsData?.data?.data?.map((job: any, i: number) => (
                <JobCard key={job._id} job={job} index={i} />
              ))
            )}
          </div>
        )}

        {tab === 'applications' && (
          <div className="space-y-4">
            {applicationsData?.data?.data?.length === 0 ? (
              <div className="card p-16 text-center">
                <Briefcase size={40} className="text-slate-350 mx-auto mb-4" />
                <p className="text-slate-500">No applications yet</p>
              </div>
            ) : (
              applicationsData?.data?.data?.map((job: any, i: number) => (
                <JobCard key={job._id} job={job} index={i} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
