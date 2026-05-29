import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Archive, Award, Milestone, Users, Building, Globe,
  ChevronRight, BookOpen, Star, TrendingUp, Rocket,
} from 'lucide-react';
import { analyticsApi, successStoryApi } from '../../lib/api';

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
  {
    name: 'Dr. Arjun Mehta',
    batch: '2013',
    dept: 'Civil Engineering',
    achievement: 'IAS Officer, Infrastructure Ministry',
    avatar: null,
  },
  {
    name: 'Priya Sharma',
    batch: '2015',
    dept: 'Computer Science',
    achievement: 'Co-founder, BuildTech (₹500Cr valuation)',
    avatar: null,
  },
  {
    name: 'Rajan Patel',
    batch: '2014',
    dept: 'Mechanical Engineering',
    achievement: 'Senior Engineer, NASA JPL',
    avatar: null,
  },
  {
    name: 'Dr. Anjali Kapoor',
    batch: '2016',
    dept: 'Chemical Engineering',
    achievement: 'Research Lead, IIT Bombay',
    avatar: null,
  },
];

export default function LegacyArchive() {
  const { data: storiesData } = useQuery({
    queryKey: ['success-stories-featured'],
    queryFn: () => successStoryApi.getAll({ category: 'distinguished', limit: 4 }),
  });
  const { data: overviewData } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsApi.getOverview(),
  });

  const overview = (overviewData as any)?.data?.data || {};

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-iitram-950 to-slate-900 text-white">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="page-container py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-iitram-300 text-sm mb-4">
              <Archive size={16} />
              <span>IITRAM Legacy Archive</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              A Legacy of
              <br />
              <span className="gradient-text-gold">Excellence & Innovation</span>
            </h1>
            <p className="text-slate-300 text-lg mt-6 leading-relaxed">
              From its founding in 2013, IITRAM has shaped thousands of engineers, researchers,
              and entrepreneurs who are transforming India's infrastructure landscape and beyond.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              {LEGACY_STATS.slice(0, 3).map(stat => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl px-5 py-3">
                  <p className="text-2xl font-bold text-gold-300">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="page-container py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {LEGACY_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-iitram-700">{stat.value}</p>
                <p className="text-xs font-medium text-slate-700 mt-1">{stat.label}</p>
                <p className="text-xs text-slate-400">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <Milestone size={20} className="text-iitram-600" />
              <h2 className="text-2xl font-bold text-slate-900">Institutional Milestones</h2>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-iitram-600 to-slate-200" />

              <div className="space-y-8">
                {MILESTONES.map((milestone, i) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative pl-20"
                  >
                    {/* Year marker */}
                    <div className="absolute left-0 top-0 w-16 flex flex-col items-center">
                      <div className="w-9 h-9 bg-iitram-700 rounded-full flex items-center justify-center shadow-glow">
                        <milestone.icon size={16} className="text-white" />
                      </div>
                    </div>

                    <div className="card p-5 hover:shadow-soft-lg transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="badge-primary text-xs mb-2 inline-block">{milestone.year}</span>
                          <h3 className="font-semibold text-slate-900">{milestone.title}</h3>
                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{milestone.desc}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Distinguished Alumni */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">Distinguished Alumni</h2>
                <Link to="/alumni" className="text-sm text-iitram-600 hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {DISTINGUISHED_ALUMNI.map((alumni, i) => (
                  <motion.div
                    key={alumni.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-iitram-500 to-iitram-700 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {alumni.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{alumni.name}</p>
                      <p className="text-xs text-slate-500">{alumni.dept}, Batch {alumni.batch}</p>
                      <p className="text-xs text-iitram-600 mt-0.5 truncate">{alumni.achievement}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/stories"
                className="mt-4 flex items-center gap-1 text-sm text-iitram-700 hover:text-iitram-800 font-medium"
              >
                Read Success Stories <ChevronRight size={14} />
              </Link>
            </div>

            {/* Quick Links */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Explore More</h3>
              <div className="space-y-2">
                {[
                  { label: 'Alumni Directory', to: '/alumni', icon: Users },
                  { label: 'Success Stories', to: '/stories', icon: Award },
                  { label: 'Research Projects', to: '/research', icon: BookOpen },
                  { label: 'Startup Ecosystem', to: '/startups', icon: Rocket },
                  { label: 'Analytics Dashboard', to: '/analytics', icon: TrendingUp },
                ].map(link => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-iitram-700 py-1.5 transition-colors"
                  >
                    <link.icon size={15} className="text-slate-400" />
                    {link.label}
                    <ChevronRight size={13} className="ml-auto text-slate-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-iitram-700 to-iitram-900 text-white">
        <div className="page-container py-14 text-center">
          <h2 className="text-3xl font-bold mb-3">Be Part of the Legacy</h2>
          <p className="text-iitram-200 max-w-xl mx-auto">
            Share your story, connect with fellow alumni, and help shape the next chapter of IITRAM's journey.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link to="/alumni" className="btn bg-white text-iitram-700 hover:bg-iitram-50">
              Join Alumni Network
            </Link>
            <Link to="/stories" className="btn border border-white/30 text-white hover:bg-white/10">
              Share Your Story
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
