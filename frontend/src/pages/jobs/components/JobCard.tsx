import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building, Star, Zap, MapPin, BookmarkCheck, Bookmark, ChevronRight, Clock } from 'lucide-react';
import { jobApi } from '../../../lib/api';
import { useAuthStore } from '../../../stores/authStore';
import { formatDate, formatSalary, getJobTypeBadgeColor, getLocationTypeBadge } from '../../../lib/utils';
import toast from 'react-hot-toast';

export default function JobCard({ job, index }: { job: any; index: number }) {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(job.savedBy?.includes(user?._id));

  const saveMutation = useMutation({
    mutationFn: () => jobApi.saveJob(job._id),
    onMutate: () => setSaved(!saved),
    onError: () => { setSaved(!saved); toast.error('Failed to save job'); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.012, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="card p-5 group cursor-pointer bg-white/90 border border-white/60 shadow-soft"
    >
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="w-12 h-12 rounded-xl border border-slate-100 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
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
                <Link to={`/jobs/${job._id}`} className="font-semibold text-slate-900 hover:text-brand-500 transition-colors">
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
                <span className="text-sm text-slate-650 font-medium">{job.company}</span>
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
            <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => saveMutation.mutate()}
                  className={`p-2 rounded-xl transition-colors border border-transparent ${saved ? 'text-brand-600 bg-brand-50/55 border-brand-100' : 'text-slate-400 hover:bg-slate-100 hover:border-slate-200'}`}
                >
                  {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </motion.button>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm rounded-xl">
                  View <ChevronRight size={14} />
                </Link>
              </motion.div>
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
                  <span key={s} className="text-2xs px-2 py-0.5 bg-slate-100/70 text-slate-650 rounded-full border border-slate-200/50">{s}</span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <img
              src={job.postedBy?.avatar || `https://ui-avatars.com/api/?name=${job.postedBy?.firstName}&background=1d2f88&color=fff`}
              className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-slate-100"
              alt=""
            />
            Posted by {job.postedBy?.firstName} {job.postedBy?.lastName}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
