import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { MessageCircle, Loader2, ArrowRight, Briefcase, Calendar } from 'lucide-react';
import { postApi, alumniApi, eventApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import CreatePostBox from './components/CreatePostBox';
import { PostCard } from './components/PostCard';
import { formatDate } from '../../lib/utils';

const FILTERS = [
  { id: 'all', label: 'All Posts' },
  { id: 'achievement', label: 'Achievements' },
  { id: 'opportunity', label: 'Opportunities' },
  { id: 'question', label: 'Questions' },
];

export default function FeedPage() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['feed', filter],
    queryFn: async ({ pageParam }) => {
      const res = await postApi.getFeed({
        limit: 10,
        postType: filter !== 'all' ? filter : undefined,
        filter,
        cursor: pageParam || undefined,
      });
      return res.data;
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage: any) => lastPage.nextCursor || undefined,
  });

  const { data: eventsData } = useQuery({
    queryKey: ['feed-events'],
    queryFn: () => eventApi.getAll({ upcoming: true, limit: 3 }),
  });

  const { data: alumniData } = useQuery({
    queryKey: ['feed-suggested-alumni'],
    queryFn: () => alumniApi.getAll({ limit: 4, sort: '-createdAt' }),
  });

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage(); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((p: any) => p.data || []) || [];
  const events: any[] = eventsData?.data?.data || [];
  const suggestedAlumni: any[] = alumniData?.data?.data || [];

  return (
    <div className="max-w-7xl mx-auto pb-12">

      {/* Page heading */}
      <div className="mb-6 pt-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight font-display">Community Feed</h1>
        <p className="text-sm text-slate-500 mt-0.5">Share updates, milestones and ideas with the IITRAM network.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6 items-start">

        {/* ── Center — feed ─────────────────────────────────────────────── */}
        <div className="min-w-0">
          {/* Filter tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto scrollbar-none pb-1">
            {FILTERS.map(f => (
              <button key={f.id} type="button" onClick={() => setFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === f.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Create post */}
          <div className="mb-4">
            <CreatePostBox />
          </div>

          {/* Post list */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-5 animate-pulse">
                  <div className="flex gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full skeleton shrink-0" />
                    <div className="flex-1"><div className="h-3.5 skeleton rounded mb-2 w-1/3" /><div className="h-2.5 skeleton rounded w-1/4" /></div>
                  </div>
                  <div className="space-y-2"><div className="h-3 skeleton rounded" /><div className="h-3 skeleton rounded w-5/6" /><div className="h-3 skeleton rounded w-4/6" /></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state bg-white border border-slate-100 rounded-2xl">
              <div className="empty-state-icon"><MessageCircle size={22} className="text-slate-400" /></div>
              <p className="empty-state-title">No posts yet</p>
              <p className="empty-state-text">Be the first to share something with the community.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post: any) => <PostCard key={post._id} post={post} />)}
            </div>
          )}

          <div ref={loadMoreRef} className="flex justify-center py-6">
            {isFetchingNextPage && <Loader2 size={18} className="animate-spin text-slate-400" />}
          </div>
        </div>

        {/* ── Right sidebar ──────────────────────────────────────────────── */}
        <div className="hidden lg:block space-y-5 sticky top-20">

          {/* Upcoming events */}
          {events.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Events</h3>
                <Link to="/events" className="text-xs font-semibold text-[#0169FC] hover:underline">View all</Link>
              </div>
              <div className="space-y-2">
                {events.map((ev: any) => {
                  const d = new Date(ev.startDate);
                  return (
                    <Link key={ev._id} to={`/events/${ev._id}`}
                      className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all group">
                      <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-200 flex flex-col items-center justify-center shrink-0 text-brand-700">
                        <span className="text-[8px] font-bold uppercase leading-none opacity-80">{d.toLocaleString('en',{month:'short'})}</span>
                        <span className="text-sm font-extrabold leading-none">{d.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 truncate transition-colors">{ev.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{ev.location || 'IITRAM'}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* People you may know */}
          {suggestedAlumni.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">People You May Know</h3>
                <Link to="/directory" className="text-xs font-semibold text-brand-600 hover:underline">Browse all</Link>
              </div>
              <div className="space-y-2">
                {suggestedAlumni.map((a: any) => {
                  const u = a.user || {};
                  return (
                    <Link key={a._id} to={`/alumni/${u._id}`}
                      className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-all group">
                      {u.avatar ? (
                        <img src={u.avatar} className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-100" alt="" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0 text-brand-700 text-xs font-bold">
                          {u.firstName?.[0]}{u.lastName?.[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 truncate transition-colors">{u.firstName} {u.lastName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{a.department?.replace(' Engineering','') || 'IITRAM'} · {a.batch}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Platform links */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
            <p className="text-xs font-bold mb-3 text-slate-400 uppercase tracking-wider">Explore Network</p>
            <div className="space-y-1">
              {[
                { to: '/jobs',       icon: Briefcase, label: 'Browse Jobs' },
                { to: '/mentorship', icon: MessageCircle, label: 'Find Mentors' },
                { to: '/events',     icon: Calendar, label: 'Events' },
              ].map(l => (
                <Link key={l.to} to={l.to}
                  className="flex items-center gap-2.5 text-xs font-medium text-slate-600 hover:text-brand-600 hover:bg-slate-50 p-2 rounded-xl transition-colors group">
                  <l.icon size={13} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
                  <span>{l.label}</span>
                  <ArrowRight size={11} className="ml-auto text-slate-300 group-hover:text-brand-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
