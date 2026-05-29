import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Building, Briefcase, Users, ExternalLink, Zap,
  ChevronLeft, Bookmark, BookmarkCheck, Send, CheckCircle, Star,
  Globe, Calendar, ArrowRight,
} from 'lucide-react';
import { jobApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate, formatSalary, getJobTypeBadgeColor } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobApi.getJob(jobId!),
  });

  const applyMutation = useMutation({
    mutationFn: (data: any) => jobApi.applyToJob(jobId!, data),
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      setApplying(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to apply'),
  });

  const saveMutation = useMutation({
    mutationFn: () => jobApi.saveJob(jobId!),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="card p-8 space-y-4">
          <div className="h-8 skeleton rounded w-1/2" />
          <div className="h-4 skeleton rounded w-1/3" />
          <div className="h-32 skeleton rounded" />
        </div>
      </div>
    );
  }

  const job = data?.data?.data;
  if (!job) return <div className="text-center py-24 text-slate-400">Job not found</div>;

  const alreadyApplied = job.applicants?.some((a: any) => a.user === user?._id);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ChevronLeft size={16} /> Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl border border-slate-100 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} className="w-full h-full object-contain" alt="" />
                  ) : (
                    <Building size={24} className="text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
                  <p className="text-lg text-iitram-700 font-medium mt-0.5">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
                    <span className={`badge border ${getJobTypeBadgeColor(job.jobType)} capitalize`}>{job.jobType}</span>
                    {job.isReferralAvailable && (
                      <span className="badge badge-success"><Zap size={11} /> Referral Available</span>
                    )}
                    {job.isFeatured && (
                      <span className="badge badge-gold"><Star size={11} /> Featured</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Applicants</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{job.applicants?.length || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Posted</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{formatDate(job.createdAt)}</p>
                </div>
                {job.applicationDeadline && (
                  <div>
                    <p className="text-xs text-slate-400">Deadline</p>
                    <p className="font-semibold text-red-600 mt-0.5">{formatDate(job.applicationDeadline)}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-4">About This Role</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {job.responsibilities?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-iitram-500 mt-2 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 bg-iitram-50 text-iitram-700 text-sm rounded-lg border border-iitram-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Apply */}
            <div className="card p-5 sticky top-20">
              {!job.salary?.isHidden && (job.salary?.min || job.salary?.max) && (
                <div className="text-center mb-4 py-4 bg-emerald-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Salary Range</p>
                  <p className="text-xl font-bold text-emerald-700">
                    {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                  </p>
                  {job.salary.isNegotiable && <p className="text-xs text-slate-400 mt-0.5">Negotiable</p>}
                </div>
              )}

              {isAuthenticated ? (
                <>
                  {alreadyApplied ? (
                    <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 rounded-xl text-emerald-700 text-sm font-medium">
                      <CheckCircle size={16} /> Application Submitted
                    </div>
                  ) : job.applicationLink ? (
                    <a href={job.applicationLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-center">
                      Apply on Company Site <ExternalLink size={15} />
                    </a>
                  ) : (
                    <>
                      {!applying ? (
                        <button onClick={() => setApplying(true)} className="btn btn-primary w-full justify-center">
                          Apply Now <ArrowRight size={15} />
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Write a brief cover letter (optional)..."
                            rows={4}
                            className="input resize-none text-sm"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setApplying(false)} className="btn btn-secondary flex-1">Cancel</button>
                            <button
                              onClick={() => applyMutation.mutate({ coverLetter })}
                              disabled={applyMutation.isPending}
                              className="btn btn-primary flex-1"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => saveMutation.mutate()}
                    className="btn btn-outline w-full justify-center mt-3"
                  >
                    <Bookmark size={15} /> Save Job
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary w-full justify-center">
                  Sign In to Apply
                </Link>
              )}
            </div>

            {/* Job Details */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 text-sm mb-4">Job Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Industry', value: job.industry },
                  { label: 'Category', value: job.category },
                  { label: 'Experience', value: `${job.experience?.min}–${job.experience?.max} ${job.experience?.unit}` },
                  { label: 'Location Type', value: job.locationType, className: 'capitalize' },
                ].map(({ label, value, className }) => value && (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <span className="text-xs text-slate-400">{label}</span>
                    <span className={`text-xs font-medium text-slate-700 text-right ${className}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Posted by */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Posted By</h3>
              <Link to={`/alumni/${job.postedBy?._id}`} className="flex items-center gap-3 group">
                <img
                  src={job.postedBy?.avatar || `https://ui-avatars.com/api/?name=${job.postedBy?.firstName}&background=1d2f88&color=fff`}
                  className="w-10 h-10 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <p className="font-medium text-slate-900 text-sm group-hover:text-iitram-700 transition-colors">
                    {job.postedBy?.firstName} {job.postedBy?.lastName}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">{job.postedBy?.role}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
