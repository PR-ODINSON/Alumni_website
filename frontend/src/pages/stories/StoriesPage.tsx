import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart, Search, BookOpen, Award, Plus, Archive, Milestone,
  Building, Users, Rocket, Globe, TrendingUp, Star, Briefcase,
} from 'lucide-react';
import { successStoryApi } from '../../lib/api';
import { PermissionGuard } from '../../components/auth/guards';
import StoryCard from './components/StoryCard';
import FeaturedStoryCard from './components/FeaturedStoryCard';
import MilestoneCard from '../legacy/components/MilestoneCard';
import LegacySidebar from '../legacy/components/LegacySidebar';

// ── Legacy static data ──────────────────────────────────────────────────────
const MILESTONES = [
  { year: '2013', title: 'IITRAM Founded', desc: 'Established as an autonomous technical university in Ahmedabad, Gujarat.', icon: Building },
  { year: '2013', title: 'First Batch Graduates', desc: 'The pioneering batch of 120 engineers graduated, marking a historic milestone.', icon: Award },
  { year: '2015', title: 'Research Centers Launched', desc: 'Established three dedicated research centers for infrastructure, materials, and sustainability.', icon: BookOpen },
  { year: '2017', title: '500+ Alumni Network', desc: 'Alumni network crossed 500 members with presence across 15 countries.', icon: Users },
  { year: '2019', title: 'First Alumni Startup Unicorn', desc: 'An alumnus co-founded a construction-tech startup that reached ₹1000 Cr valuation.', icon: Rocket },
  { year: '2021', title: '1000+ Alumni Milestone', desc: 'IITRAM alumni community surpassed 1000 members globally.', icon: Globe },
  { year: '2023', title: 'International Research Collaborations', desc: 'Partnered with 12 international universities for joint research programs.', icon: TrendingUp },
  { year: '2025', title: 'Alumni Impact Awards Launched', desc: 'Recognizing alumni who are making transformative impact in their fields.', icon: Star },
];
const LEGACY_STATS = [
  { label: 'Graduating Batches', value: '15+', desc: 'Years of excellence' },
  { label: 'Total Alumni', value: '2,400+', desc: 'Across the world' },
  { label: 'Countries Represented', value: '30+', desc: 'Global presence' },
  { label: 'Alumni Startups', value: '120+', desc: 'Ventures founded' },
  { label: 'Research Papers', value: '800+', desc: 'Published works' },
  { label: 'Placement Rate', value: '94%', desc: 'Average placement' },
];
const DISTINGUISHED_ALUMNI = [
  { name: 'Dr. Arjun Mehta', batch: '2013', dept: 'Civil Engineering', achievement: 'IAS Officer, Infrastructure Ministry', avatar: null },
  { name: 'Priya Sharma', batch: '2015', dept: 'Computer Science', achievement: 'Co-founder, BuildTech (₹500Cr valuation)', avatar: null },
  { name: 'Rajan Patel', batch: '2014', dept: 'Mechanical Engineering', achievement: 'NASA JPL Flight Engineer', avatar: null },
  { name: 'Dr. Anjali Kapoor', batch: '2016', dept: 'Chemical Engineering', achievement: 'Research Lead, IIT Bombay', avatar: null },
];

const CATEGORIES = ['all', 'career', 'entrepreneurship', 'research', 'social-impact', 'leadership', 'arts', 'sports'];

type Tab = 'stories' | 'legacy';

export default function StoriesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('stories');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['stories', category, search],
    queryFn: () => successStoryApi.getAll({
      category: category !== 'all' ? category : undefined,
      search: search || undefined,
      limit: 20,
    }),
    enabled: activeTab === 'stories',
  });

  const stories = data?.data?.data || [];
  const featured = stories.filter((s: any) => s.isFeatured);
  const regular  = stories.filter((s: any) => !s.isFeatured);

  return (
    <div className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950 text-white py-10 px-6 rounded-3xl mt-4 mb-6 shadow-soft-xl overflow-hidden border border-brand-900/50">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/20 border border-brand-500/30 rounded-full text-brand-300 text-xs font-semibold mb-4">
              <Award size={12} /> IITRAM Legacy
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 font-serif tracking-tight">Stories & Legacy</h1>
            <p className="text-slate-350 text-sm leading-relaxed max-w-xl mx-auto mb-5">
              Journeys of IITRAM graduates who transformed industries, built companies, and made an impact across the world.
            </p>
            <PermissionGuard permission="story:create">
              <Link
                to="/stories/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus size={14} /> Share Your Story
              </Link>
            </PermissionGuard>
          </motion.div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {([
          { id: 'stories', label: 'Success Stories', icon: Star },
          { id: 'legacy',  label: 'Legacy Archive',  icon: Archive },
        ] as { id: Tab; label: string; icon: any }[]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === id
                ? 'bg-white shadow-sm text-brand-600 border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── SUCCESS STORIES tab ─────────────────────────────────────────── */}
        {activeTab === 'stories' && (
          <motion.div key="stories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stories..."
                  className="input pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex-shrink-0 capitalize ${category === cat ? 'filter-pill-active' : 'filter-pill'}`}
                  >
                    {cat === 'all' ? 'All Stories' : cat.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Featured</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3"><FeaturedStoryCard story={featured[0]} size="large" /></div>
                  {featured.slice(1, 3).length > 0 && (
                    <div className="lg:col-span-2 space-y-6">
                      {featured.slice(1, 3).map((story: any) => (
                        <FeaturedStoryCard key={story._id} story={story} size="small" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Regular grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-52 skeleton rounded-2xl mb-4" />
                    <div className="h-5 skeleton rounded mb-2 w-3/4" />
                    <div className="h-4 skeleton rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {regular.length > 0 && (
                  <>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-px flex-1 bg-slate-100" />
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">All Stories</span>
                      <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {regular.map((story: any, i: number) => (
                        <StoryCard key={story._id} story={story} index={i} />
                      ))}
                    </div>
                  </>
                )}
                {stories.length === 0 && (
                  <div className="text-center py-20">
                    <BookOpen size={40} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No stories found</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* ── LEGACY ARCHIVE tab ──────────────────────────────────────────── */}
        {activeTab === 'legacy' && (
          <motion.div key="legacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Stats bar */}
            <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {LEGACY_STATS.map((stat) => (
                  <div key={stat.label} className="text-center p-2 rounded-lg border border-transparent hover:bg-slate-50 transition-colors">
                    <p className="text-xl font-bold font-display text-[#0169FC] leading-none">{stat.value}</p>
                    <p className="text-[10px] font-bold text-slate-900 mt-2 uppercase tracking-wide leading-none">{stat.label}</p>
                    <p className="text-[9px] text-slate-450 mt-1 font-semibold">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-1.5 mb-4 px-1">
                  <Milestone size={16} className="text-[#0169FC]" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Institutional Milestones</h2>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />
                  <div className="space-y-5">
                    {MILESTONES.map((milestone, i) => (
                      <MilestoneCard key={milestone.title} milestone={milestone} index={i} />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <LegacySidebar distinguished={DISTINGUISHED_ALUMNI} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
