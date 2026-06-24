import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../stores/authStore';
import { mentorshipApi } from '../../../lib/api';
import Avatar from '../../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function MentorshipCard({ mentorship }: { mentorship: any }) {
  const { user } = useAuthStore();
  const isMentor = mentorship.mentor?._id === user?._id;
  const otherUser = isMentor ? mentorship.mentee : mentorship.mentor;

  const statusStyles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-705 border-amber-100',
    active: 'bg-emerald-50 text-emerald-705 border-emerald-100',
    completed: 'bg-slate-100 text-slate-650 border-slate-200',
    rejected: 'bg-red-50 text-red-705 border-red-100',
    cancelled: 'bg-slate-150 text-slate-500 border-slate-200',
  };

  const queryClient = useQueryClient();

  const respondMutation = useMutation({
    mutationFn: (action: string) => mentorshipApi.respond(mentorship._id, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-mentorships'] });
      toast.success('Response sent');
    },
    onError: () => toast.error('Failed to respond'),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="card p-5 cursor-pointer bg-white/90 border border-white/60 shadow-soft"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={otherUser?.avatar} name={`${otherUser?.firstName} ${otherUser?.lastName}`} size="md" />
          <div>
            <p className="font-semibold text-slate-900">{otherUser?.firstName} {otherUser?.lastName}</p>
            <p className="text-xs text-slate-400 font-medium capitalize">{isMentor ? 'Mentee' : 'Mentor'}</p>
          </div>
        </div>
        <span className={`badge border ${statusStyles[mentorship.status]} capitalize`}>{mentorship.status}</span>
      </div>

      {mentorship.goals && (
        <div className="p-3.5 bg-slate-50 rounded-2xl mb-4 border border-slate-200/50">
          <p className="text-xs font-semibold text-slate-400 mb-1">Goals</p>
          <p className="text-sm text-slate-700 leading-relaxed">{mentorship.goals}</p>
        </div>
      )}

      {mentorship.areas?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {mentorship.areas.map((area: string) => (
            <span key={area} className="text-2xs px-2.5 py-0.5 bg-brand-50 text-brand-700 rounded-full border border-brand-100">{area}</span>
          ))}
        </div>
      )}

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        {mentorship.status === 'pending' && isMentor && (
          <>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => respondMutation.mutate('accept')}
              disabled={respondMutation.isPending}
              className="btn btn-primary btn-sm flex-1 justify-center rounded-xl py-2"
            >
              <CheckCircle size={13} /> Accept
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => respondMutation.mutate('reject')}
              disabled={respondMutation.isPending}
              className="btn btn-danger btn-sm flex-1 justify-center rounded-xl py-2"
            >
              <XCircle size={13} /> Decline
            </motion.button>
          </>
        )}
        {mentorship.status === 'active' && (
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to={`/mentorship/${mentorship._id}`}
              className="w-full btn btn-primary btn-sm flex-1 justify-center rounded-xl py-2"
            >
              View Details <ChevronRight size={13} />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
