import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Star, Users, Search, Calendar, CheckCircle, Clock, XCircle,
  MessageCircle, Award, Lightbulb, ChevronRight, BookOpen,
  Filter, ArrowRight, GraduationCap, Loader2,
} from 'lucide-react';
import { mentorshipApi, alumniApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate, formatRelativeTime } from '../../lib/utils';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function MentorshipPage() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<'find' | 'my-mentorships'>('find');
  const [requestModal, setRequestModal] = useState<any>(null);

  const { data: mentorsData, isLoading: loadingMentors } = useQuery({
    queryKey: ['mentors'],
    queryFn: () => alumniApi.getMentors({ availability: 'available' }),
    enabled: tab === 'find',
  });

  const { data: mentorshipsData, isLoading: loadingMentorships } = useQuery({
    queryKey: ['my-mentorships'],
    queryFn: () => mentorshipApi.getAll(),
    enabled: tab === 'my-mentorships',
  });

  const mentors = mentorsData?.data?.data || [];
  const mentorships = mentorshipsData?.data?.data || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative bg-slate-900 border-b border-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/mentorship-hub.png" alt="Mentorship Hub" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 iitram-gradient opacity-90" />
          <div className="absolute inset-0 pattern-dots opacity-30 mix-blend-overlay" />
        </div>
        <div className="relative z-10 page-container py-12 md:py-16">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mentorship Hub</h1>
              <p className="text-slate-300 text-lg">Connect with experienced IITRAM alumni mentors</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setTab('find')} className={tab === 'find' ? 'filter-pill-active' : 'filter-pill'}>
              Find Mentors
            </button>
            <button onClick={() => setTab('my-mentorships')} className={tab === 'my-mentorships' ? 'filter-pill-active' : 'filter-pill'}>
              My Mentorships
            </button>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        {tab === 'find' && (
          <>
            {/* How it works */}
            <div className="card p-6 mb-8 border-none bg-white/80 glass shadow-soft">
              <h3 className="font-semibold text-slate-900 mb-4">How Mentorship Works</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { icon: Search, step: '01', title: 'Find Your Mentor', desc: 'Browse experienced alumni by expertise, industry, and availability' },
                  { icon: MessageCircle, step: '02', title: 'Send a Request', desc: 'Tell them about your goals and what guidance you seek' },
                  { icon: Calendar, step: '03', title: 'Schedule Sessions', desc: 'Book 1:1 sessions and track your progress together' },
                ].map(({ icon: Icon, step, title, desc }) => (
                  <div key={step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-iitram-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-iitram-700" />
                    </div>
                    <div>
                      <span className="text-2xs font-bold text-iitram-500 uppercase tracking-wide">{step}</span>
                      <p className="font-medium text-slate-900 text-sm mt-0.5">{title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {loadingMentors ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card p-5 animate-pulse">
                    <div className="flex gap-3 mb-4">
                      <div className="w-14 h-14 rounded-full skeleton" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 skeleton rounded w-3/4" />
                        <div className="h-3 skeleton rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 skeleton rounded mb-2" />
                    <div className="h-3 skeleton rounded w-5/6" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {mentors.map((mentor: any, i: number) => (
                  <MentorCard key={mentor._id} mentor={mentor} index={i} onRequest={setRequestModal} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'my-mentorships' && (
          <div className="space-y-4">
            {loadingMentorships ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="card p-5 animate-pulse h-32" />)
            ) : mentorships.length === 0 ? (
              <div className="card p-16 text-center">
                <Lightbulb size={40} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium mb-2">No mentorships yet</p>
                <p className="text-slate-400 text-sm mb-6">Find an alumni mentor to guide your journey</p>
                <button onClick={() => setTab('find')} className="btn btn-primary">Find Mentors</button>
              </div>
            ) : (
              mentorships.map((m: any) => <MentorshipCard key={m._id} mentorship={m} />)
            )}
          </div>
        )}
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {requestModal && (
          <RequestMentorshipModal mentor={requestModal} onClose={() => setRequestModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function MentorCard({ mentor, index, onRequest }: { mentor: any; index: number; onRequest: (m: any) => void }) {
  const user = mentor.user;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-hover p-5"
    >
      <div className="flex items-start gap-4 mb-4">
        <Link to={`/alumni/${user._id}`}>
          <Avatar src={user?.avatar} name={`${user?.firstName} ${user?.lastName}`} size="lg" verified />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/alumni/${user._id}`} className="font-semibold text-slate-900 hover:text-iitram-700 transition-colors text-sm">
            {user?.firstName} {user?.lastName}
          </Link>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{mentor.currentDesignation} at {mentor.currentCompany}</p>
          <div className="flex items-center gap-2 mt-1">
            <GraduationCap size={11} className="text-slate-400" />
            <span className="text-2xs text-slate-400">{mentor.department} · Batch {mentor.batch}</span>
          </div>
        </div>
      </div>

      {/* Mentor areas */}
      {mentor.mentorAreas?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {mentor.mentorAreas.slice(0, 4).map((area: string) => (
            <span key={area} className="text-2xs px-2 py-0.5 bg-accent-50 text-accent-700 rounded-full border border-accent-200">{area}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
        <span className={`flex items-center gap-1 font-medium ${mentor.mentorAvailability === 'available' ? 'text-emerald-600' : 'text-amber-600'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${mentor.mentorAvailability === 'available' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
          {mentor.mentorAvailability === 'available' ? 'Available' : 'Limited Availability'}
        </span>
        <span>Max {mentor.maxMentees} mentees</span>
      </div>

      <button
        onClick={() => onRequest(mentor)}
        className="btn btn-primary btn-sm w-full justify-center"
      >
        <Star size={13} /> Request Mentorship
      </button>
    </motion.div>
  );
}

function RequestMentorshipModal({ mentor, onClose }: { mentor: any; onClose: () => void }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-soft-xl border border-slate-100 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Request Mentorship</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Mentor info */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <Avatar src={mentor.user?.avatar} name={`${mentor.user?.firstName} ${mentor.user?.lastName}`} size="md" />
            <div>
              <p className="font-semibold text-slate-900 text-sm">{mentor.user?.firstName} {mentor.user?.lastName}</p>
              <p className="text-xs text-slate-500">{mentor.currentDesignation} at {mentor.currentCompany}</p>
            </div>
          </div>

          {/* Areas */}
          {mentor.mentorAreas?.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Areas of Focus</label>
              <div className="flex flex-wrap gap-2">
                {mentor.mentorAreas.map((area: string) => (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                      areas.includes(area)
                        ? 'bg-iitram-700 text-white border-iitram-700'
                        : 'border-slate-200 text-slate-600 hover:border-iitram-300'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Goals *</label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={3}
              className="input resize-none text-sm"
              placeholder="What do you hope to achieve through this mentorship?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Personal Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="input resize-none text-sm"
              placeholder="Introduce yourself and explain why you'd like this mentor..."
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="btn btn-outline flex-1">Cancel</button>
          <button
            onClick={() => mutation.mutate()}
            disabled={!goals || !message || mutation.isPending}
            className="btn btn-primary flex-1"
          >
            {mutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Star size={15} />}
            Send Request
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MentorshipCard({ mentorship }: { mentorship: any }) {
  const { user } = useAuthStore();
  const isMentor = mentorship.mentor?._id === user?._id;
  const otherUser = isMentor ? mentorship.mentee : mentorship.mentor;

  const statusStyles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    active: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-slate-100 text-slate-600',
    rejected: 'bg-red-50 text-red-700',
    cancelled: 'bg-slate-100 text-slate-500',
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
    <div className="card-hover p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={otherUser?.avatar} name={`${otherUser?.firstName} ${otherUser?.lastName}`} size="md" />
          <div>
            <p className="font-semibold text-slate-900">{otherUser?.firstName} {otherUser?.lastName}</p>
            <p className="text-xs text-slate-400 capitalize">{isMentor ? 'Mentee' : 'Mentor'}</p>
          </div>
        </div>
        <span className={`badge ${statusStyles[mentorship.status]} capitalize`}>{mentorship.status}</span>
      </div>

      {mentorship.goals && (
        <div className="p-3 bg-slate-50 rounded-xl mb-4">
          <p className="text-xs font-medium text-slate-500 mb-1">Goals</p>
          <p className="text-sm text-slate-700">{mentorship.goals}</p>
        </div>
      )}

      {mentorship.areas?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {mentorship.areas.map((area: string) => (
            <span key={area} className="text-2xs px-2 py-0.5 bg-iitram-50 text-iitram-700 rounded-full">{area}</span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {mentorship.status === 'pending' && isMentor && (
          <>
            <button
              onClick={() => respondMutation.mutate('accept')}
              disabled={respondMutation.isPending}
              className="btn btn-primary btn-sm flex-1 justify-center"
            >
              <CheckCircle size={13} /> Accept
            </button>
            <button
              onClick={() => respondMutation.mutate('reject')}
              disabled={respondMutation.isPending}
              className="btn btn-danger btn-sm flex-1 justify-center"
            >
              <XCircle size={13} /> Decline
            </button>
          </>
        )}
        {mentorship.status === 'active' && (
          <Link
            to={`/mentorship/${mentorship._id}`}
            className="btn btn-primary btn-sm flex-1 justify-center"
          >
            View Details <ChevronRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
}
