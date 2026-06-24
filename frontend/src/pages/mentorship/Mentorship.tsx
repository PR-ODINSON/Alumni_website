import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, Calendar, Lightbulb } from 'lucide-react';
import { mentorshipApi, alumniApi } from '../../lib/api';
import MentorCard from './components/MentorCard';
import MentorshipCard from './components/MentorshipCard';
import RequestMentorshipModal from './components/RequestMentorshipModal';

export default function MentorshipPage() {
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
    <div className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative bg-white rounded-xl border border-slate-200 p-5 md:p-6 mt-4 mb-6 shadow-xs text-slate-900 overflow-hidden font-sans">
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-0.5 font-display">Mentorship Hub</h1>
              <p className="text-slate-500 text-xs font-semibold">Connect with experienced IITRAM alumni mentors</p>
            </div>
          </div>
 
          <div className="flex gap-1.5">
            <button onClick={() => setTab('find')} className={tab === 'find' ? 'filter-pill-active' : 'filter-pill'}>
              Find Mentors
            </button>
            <button onClick={() => setTab('my-mentorships')} className={tab === 'my-mentorships' ? 'filter-pill-active' : 'filter-pill'}>
              My Mentorships
            </button>
          </div>
        </div>
      </div>
 
      <div className="py-2">
        {tab === 'find' && (
          <>
            {/* How it works */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-6 font-sans text-slate-805">
              <h3 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">How Mentorship Works</h3>
              <div className="grid sm:grid-cols-3 gap-5">
                {[
                  { icon: Search, step: '01', title: 'Find Your Mentor', desc: 'Browse experienced alumni by expertise, industry, and availability' },
                  { icon: MessageCircle, step: '02', title: 'Send a Request', desc: 'Tell them about your goals and what guidance you seek' },
                  { icon: Calendar, step: '03', title: 'Schedule Sessions', desc: 'Book 1:1 sessions and track your progress together' },
                ].map(({ icon: Icon, step, title, desc }) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <Icon size={16} className="text-[#0169FC]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#0169FC] uppercase tracking-wide">{step}</span>
                      <p className="font-bold text-slate-900 text-xs mt-0.5">{title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-semibold">{desc}</p>
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
                <Lightbulb size={40} className="text-slate-350 mx-auto mb-4" />
                <p className="text-slate-605 font-semibold mb-2">No mentorships yet</p>
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
