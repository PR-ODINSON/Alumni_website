import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, type Variants } from 'framer-motion';
import {
  Users, Briefcase, Calendar, Star, GraduationCap,
  ArrowRight, Lightbulb, BookOpen, Rocket, MessageCircle,
  TrendingUp, ChevronRight,
} from 'lucide-react';
import { alumniApi, analyticsApi, successStoryApi, eventApi } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { formatDate } from '../lib/utils';

// Landing page components
import Hero from './home/components/Hero';
import Features from './home/components/Features';
import BranchShowcase from './home/components/BranchShowcase';
import StoriesPreview from './home/components/StoriesPreview';
import EventsPreview from './home/components/EventsPreview';
import AlumniPreview from './home/components/AlumniPreview';
import Cta from './home/components/Cta';
import Footer from './home/components/Footer';

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function Metric({ label, value, icon: Icon, accent }: { label: string; value: string; icon: any; accent: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: accent + '14' }}>
          <Icon size={14} style={{ color: accent }} />
        </div>
        <span className="text-xs font-semibold text-slate-500">{label}</span>
      </div>
      <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">{value}</p>
    </div>
  );
}

function QuickActionLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to}
      className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0169FC] hover:border-[#0169FC]/30 hover:bg-blue-50/50 transition-all group">
      <Icon size={14} className="text-slate-400 group-hover:text-[#0169FC] transition-colors" />
      {label}
      <ChevronRight size={12} className="ml-auto text-slate-300 group-hover:text-[#0169FC] transition-colors" />
    </Link>
  );
}

function DashboardHome() {
  const { user } = useAuthStore();

  const { data: statsData } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsApi.getOverview(),
  });

  const { data: eventsData } = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: () => eventApi.getAll({ upcoming: true, limit: 5 }),
  });

  const { data: storiesData } = useQuery({
    queryKey: ['dashboard-stories'],
    queryFn: () => successStoryApi.getAll({ featured: true, limit: 4 }),
  });

  const { data: alumniData } = useQuery({
    queryKey: ['dashboard-recent-alumni'],
    queryFn: () => alumniApi.getAll({ limit: 6, sort: '-createdAt' }),
  });

  const stats = statsData?.data?.data;
  const events: any[] = eventsData?.data?.data || [];
  const stories: any[] = storiesData?.data?.data || [];
  const recentAlumni: any[] = alumniData?.data?.data || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* ── Greeting header ─────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="pt-2">
        <p className="text-sm text-slate-500 font-medium">{greeting},</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5 font-display">
          {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-slate-400 text-sm mt-1">Stay connected with the IITRAM community.</p>
      </motion.div>

      {/* ── Metrics strip ───────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
        {[
          { label: 'Alumni Network', value: stats?.totalAlumni != null ? Number(stats.totalAlumni).toLocaleString() : '—', icon: GraduationCap, accent: '#0169FC' },
          { label: 'Open Opportunities', value: stats?.totalJobs != null ? String(stats.totalJobs) : '—', icon: Briefcase, accent: '#10b981' },
          { label: 'Active Mentors', value: stats?.activeMentorships != null ? String(stats.activeMentorships) : '—', icon: Lightbulb, accent: '#f59e0b' },
          { label: 'Upcoming Events', value: stats?.totalEvents != null ? String(stats.totalEvents) : '—', icon: Calendar, accent: '#8b5cf6' },
        ].map(m => (
          <div key={m.label} className="bg-white px-5 py-5 sm:px-6 sm:py-6">
            <Metric {...m} />
          </div>
        ))}
      </motion.div>

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Quick actions */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Quick Access</h2>
          <div className="space-y-1.5">
            {[
              { to: '/directory',  icon: Users,         label: 'Alumni Directory' },
              { to: '/jobs',       icon: Briefcase,     label: 'Browse Jobs' },
              { to: '/events',     icon: Calendar,      label: 'Upcoming Events' },
              { to: '/mentorship', icon: Lightbulb,     label: 'Find a Mentor' },
              { to: '/feed',       icon: MessageCircle, label: 'Community Feed' },
              { to: '/research',   icon: BookOpen,      label: 'Research Hub' },
              { to: '/stories',    icon: Star,          label: 'Success Stories' },
              { to: '/startups',   icon: Rocket,        label: 'Startup Ecosystem' },
            ].map(l => <QuickActionLink key={l.to} {...l} />)}
          </div>
        </motion.div>

        {/* Upcoming events */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Upcoming Events</h2>
            <Link to="/events" className="text-xs font-semibold text-[#0169FC] hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-2xl p-10 text-center">
              <Calendar size={24} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400 font-medium">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((ev: any) => {
                const d = new Date(ev.startDate);
                return (
                  <Link key={ev._id} to={`/events/${ev._id}`}
                    className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-[#001129] flex flex-col items-center justify-center shrink-0 text-white">
                      <span className="text-[9px] font-bold uppercase leading-none opacity-70">{d.toLocaleString('en', { month: 'short' })}</span>
                      <span className="text-lg font-extrabold leading-none">{d.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-[#0169FC] transition-colors truncate">{ev.title}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{ev.location || ev.city || 'IITRAM Campus'}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-[#0169FC] shrink-0 transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Stories row ─────────────────────────────────────────────────── */}
      {stories.length > 0 && (
        <motion.section variants={fadeUp} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Featured Stories</h2>
            <Link to="/stories" className="text-xs font-semibold text-[#0169FC] hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stories.map((s: any) => (
              <Link key={s._id} to={`/stories/${s._id}`}
                className="group flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-slate-200 hover:shadow-sm transition-all">
                <div className="h-28 bg-gradient-to-br from-[#001129] to-[#073F7C] relative overflow-hidden shrink-0">
                  {s.coverImage && <img src={s.coverImage} alt="" className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {s.category && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 bg-white/90 text-slate-700 rounded-full capitalize">{s.category}</span>
                  )}
                </div>
                <div className="p-3 flex-1">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#0169FC] line-clamp-2 transition-colors leading-snug">{s.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1.5">{s.alumni?.firstName} {s.alumni?.lastName}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Recently joined alumni ───────────────────────────────────────── */}
      {recentAlumni.length > 0 && (
        <motion.section variants={fadeUp} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Recently Joined</h2>
            <Link to="/directory" className="text-xs font-semibold text-[#0169FC] hover:underline flex items-center gap-1">
              Browse all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {recentAlumni.map((a: any) => {
              const u = a.user || {};
              const initials = `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`;
              return (
                <Link key={a._id || u._id} to={`/alumni/${u._id}`}
                  className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all text-center group">
                  {u.avatar ? (
                    <img src={u.avatar} className="w-11 h-11 rounded-full object-cover border-2 border-slate-100" alt="" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#001129] flex items-center justify-center text-white text-xs font-bold border-2 border-slate-100">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-[#0169FC] line-clamp-1 transition-colors">{u.firstName} {u.lastName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{a.department?.replace(' Engineering','') || 'IITRAM'}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.section>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Landing page (guests)
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  const { data: communityStatsData } = useQuery({ queryKey: ['landing-community-stats'], queryFn: () => alumniApi.getStats(), enabled: !isAuthenticated });
  const { data: distinguishedData } = useQuery({ queryKey: ['landing-distinguished'], queryFn: () => alumniApi.getDistinguished(), enabled: !isAuthenticated });
  const { data: storiesData } = useQuery({ queryKey: ['landing-stories'], queryFn: () => successStoryApi.getAll({ featured: true, limit: 3 }), enabled: !isAuthenticated });
  const { data: eventsData } = useQuery({ queryKey: ['landing-events'], queryFn: () => eventApi.getAll({ upcoming: true, limit: 4 }), enabled: !isAuthenticated });
  const communityStats = communityStatsData?.data?.data;

  if (isAuthenticated) {
    return <DashboardHome />;
  }

  return (
    <div className="overflow-x-hidden">
      <Hero stats={communityStats} isAuthenticated={false} />
      <Features />
      <BranchShowcase stats={communityStats} />
      <StoriesPreview stories={storiesData?.data?.data || []} />
      <EventsPreview events={eventsData?.data?.data || []} />
      <AlumniPreview featured={distinguishedData?.data?.data?.slice(0, 3) || []} />
      <Cta />
      <Footer />
    </div>
  );
}
