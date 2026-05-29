import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, Briefcase, MapPin, Clock, Bookmark, BookmarkCheck,
  Filter, Building, ExternalLink, Users, Star, Plus, ChevronRight,
  Globe, ArrowUpRight, Zap,
} from 'lucide-react';
import { jobApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate, formatSalary, getJobTypeBadgeColor, getLocationTypeBadge, INDUSTRIES } from '../../lib/utils';
import toast from 'react-hot-toast';

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
  const pagination = data?.data?.pagination;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative bg-slate-900 border-b border-slate-800 text-white">
        <div className="absolute inset-0">
          <img src="/images/career-platform.png" alt="Jobs & Opportunities" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>
        <div className="relative z-10 page-container py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Jobs & Opportunities</h1>
              <p className="text-slate-300 text-lg">Exclusive positions shared by the IITRAM alumni network</p>
            </div>
            {isAuthenticated && (user?.role === 'alumni' || user?.role === 'admin') && (
              <Link to="/jobs/post" className="btn bg-white text-iitram-800 hover:bg-slate-100 font-semibold shrink-0">
                <Plus size={16} /> Post a Job
              </Link>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6">
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
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search jobs, companies, skills..."
                  className="input pl-10 h-11"
                />
              </div>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters(f => ({ ...f, jobType: e.target.value }))}
                className="input h-11 w-40"
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
              <label className="flex items-center gap-2 px-3 h-11 rounded-lg border border-slate-200 cursor-pointer hover:border-iitram-300 transition-colors text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={filters.isReferralAvailable}
                  onChange={(e) => setFilters(f => ({ ...f, isReferralAvailable: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <Zap size={14} className="text-gold-500" /> Referral Available
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="page-container py-8">
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
                <Briefcase size={40} className="text-slate-300 mx-auto mb-4" />
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
                <Bookmark size={40} className="text-slate-300 mx-auto mb-4" />
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
                <Briefcase size={40} className="text-slate-300 mx-auto mb-4" />
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

function JobCard({ job, index }: { job: any; index: number }) {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(job.savedBy?.includes(user?._id));

  const saveMutation = useMutation({
    mutationFn: () => jobApi.saveJob(job._id),
    onMutate: () => setSaved(!saved),
    onError: () => { setSaved(!saved); toast.error('Failed to save job'); },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="card-hover p-5"
    >
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="w-12 h-12 rounded-xl border border-slate-100 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
          {job.companyLogo ? (
            <img src={job.companyLogo} className="w-full h-full object-contain" alt="" />
          ) : (
            <Building size={20} className="text-slate-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link to={`/jobs/${job._id}`} className="font-semibold text-slate-900 hover:text-iitram-700 transition-colors">
                  {job.title}
                </Link>
                {job.isFeatured && (
                  <span className="badge badge-gold"><Star size={10} /> Featured</span>
                )}
                {job.isReferralAvailable && (
                  <span className="badge badge-success"><Zap size={10} /> Referral</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-sm text-slate-600 font-medium">{job.company}</span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={11} /> {job.location}
                </span>
                <span className={`badge border ${getJobTypeBadgeColor(job.jobType)} capitalize text-xs`}>
                  {job.jobType}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getLocationTypeBadge(job.locationType)} capitalize`}>
                  {job.locationType}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAuthenticated && (
                <button
                  onClick={() => saveMutation.mutate()}
                  className={`p-2 rounded-lg transition-colors ${saved ? 'text-iitram-600 bg-iitram-50' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
              )}
              <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
                View <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock size={11} /> {formatDate(job.createdAt)}
            </span>
            {!job.salary?.isHidden && (job.salary?.min || job.salary?.max) && (
              <span className="text-xs font-medium text-emerald-700">
                {formatSalary(job.salary.min, job.salary.max, job.salary.currency, job.salary.period)}
              </span>
            )}
            {job.applicationDeadline && (
              <span className="text-xs text-red-500">Deadline: {formatDate(job.applicationDeadline)}</span>
            )}
            {job.skills?.length > 0 && (
              <div className="flex gap-1">
                {job.skills.slice(0, 3).map((s: string) => (
                  <span key={s} className="text-2xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{s}</span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <img
              src={job.postedBy?.avatar || `https://ui-avatars.com/api/?name=${job.postedBy?.firstName}&background=1d2f88&color=fff`}
              className="w-4 h-4 rounded-full"
              alt=""
            />
            Posted by {job.postedBy?.firstName} {job.postedBy?.lastName}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
