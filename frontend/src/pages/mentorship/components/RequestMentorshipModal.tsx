import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Star } from 'lucide-react';
import { mentorshipApi } from '../../../lib/api';
import Avatar from '../../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function RequestMentorshipModal({ mentor, onClose }: { mentor: any; onClose: () => void }) {
  const [goals, setGoals] = useState('');
  const [message, setMessage] = useState('');
  const [areas, setAreas] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => mentorshipApi.request({ mentorId: mentor.user._id, areas, goals, message }),
    onSuccess: () => {
      toast.success('Mentorship request sent!');
      queryClient.invalidateQueries({ queryKey: ['my-mentorships'] });
      onClose();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to send request'),
  });

  const toggleArea = (area: string) => {
    setAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-soft-xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
          <h3 className="font-semibold text-slate-900">Request Mentorship</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-650 text-xl font-bold">×</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Mentor info */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
            <Avatar src={mentor.user?.avatar} name={`${mentor.user?.firstName} ${mentor.user?.lastName}`} size="md" />
            <div>
              <p className="font-semibold text-slate-900 text-sm">{mentor.user?.firstName} {mentor.user?.lastName}</p>
              <p className="text-xs text-slate-500 font-medium">{mentor.currentDesignation} at {mentor.currentCompany}</p>
            </div>
          </div>

          {/* Areas */}
          {mentor.mentorAreas?.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Areas of Focus</label>
              <div className="flex flex-wrap gap-2">
                {mentor.mentorAreas.map((area: string) => (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all font-semibold ${
                      areas.includes(area)
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/10'
                        : 'border-slate-200 text-slate-600 hover:border-brand-500/30 hover:bg-slate-50'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Goals *</label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={3}
              className="input resize-none text-sm"
              placeholder="What do you hope to achieve through this mentorship?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Personal Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="input resize-none text-sm"
              placeholder="Introduce yourself and explain why you'd like this mentor..."
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-150">
          <button onClick={onClose} className="btn btn-outline flex-1 rounded-xl">Cancel</button>
          <button
            onClick={() => mutation.mutate()}
            disabled={!goals || !message || mutation.isPending}
            className="btn btn-primary flex-1 rounded-xl"
          >
            {mutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Star size={15} />}
            Send Request
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
