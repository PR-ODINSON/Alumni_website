import { Archive, Milestone, Building, Award, Users, Rocket, Globe, TrendingUp, BookOpen, Star } from 'lucide-react';
import MilestoneCard from './components/MilestoneCard';
import LegacySidebar from './components/LegacySidebar';

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

export default function LegacyArchive() {
  return (
    <div className="py-4 bg-transparent font-sans text-slate-800">
      {/* Solid White Header */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-5 md:p-6 mb-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-2">
            <Archive size={14} className="text-slate-450" />
            <span>IITRAM Legacy Archive</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight leading-tight">
            A Legacy of <span className="text-[#0169FC]">Excellence & Innovation</span>
          </h1>
          <p className="text-slate-500 text-xs leading-relaxed mt-2.5 font-semibold">
            From its founding in 2013, IITRAM has shaped thousands of engineers, researchers,
            and entrepreneurs who are transforming India's infrastructure landscape and beyond.
          </p>
        </div>
      </div>

      {/* Legacy Stats Quick Grid (Single, non-duplicated placement) */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {LEGACY_STATS.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-2 rounded-lg border border-transparent hover:bg-slate-50 transition-colors duration-150"
            >
              <p className="text-xl font-bold font-display text-[#0169FC] leading-none">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-900 mt-2 uppercase tracking-wide leading-none">{stat.label}</p>
              <p className="text-[9px] text-slate-450 mt-1 font-semibold">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Timeline + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-1.5 mb-4 px-1">
            <Milestone size={16} className="text-[#0169FC]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Institutional Milestones</h2>
          </div>

          <div className="relative">
            {/* Timeline vertical bar (aligned perfectly to center of 32px markers positioned at left-0) */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />

            <div className="space-y-5">
              {MILESTONES.map((milestone, i) => (
                <MilestoneCard key={milestone.title} milestone={milestone} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <LegacySidebar distinguished={DISTINGUISHED_ALUMNI} />
        </div>
      </div>
    </div>
  );
}
