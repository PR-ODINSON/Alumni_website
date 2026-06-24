import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Rocket, DollarSign, Users, Globe, Search, ChevronRight, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { alumniApi, analyticsApi } from '../../lib/api';
import StartupCard from './components/StartupCard';

const STAGES = ['All', 'Idea', 'MVP', 'Seed', 'Series A', 'Series B+', 'Acquired'];
const SECTORS = ['All', 'Infrastructure Tech', 'Construction', 'Clean Energy', 'AI/ML', 'SaaS', 'FinTech', 'EdTech', 'HealthTech'];

export default function StartupEcosystem() {
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');

  const { data: startupData, isLoading } = useQuery({
    queryKey: ['startup-ecosystem'],
    queryFn: () => alumniApi.getStartupEcosystem(),
  });

  const { data: statsData } = useQuery({
    queryKey: ['startup-stats'],
    queryFn: () => analyticsApi.getStartupStats(),
  });

  const stats = (statsData as any)?.data?.data || {};
  const allStartups: any[] = (startupData as any)?.data?.data || [];

  const filtered = allStartups.filter(a => {
    const startup = a.startup || {};
    const matchSearch = !search ||
      startup.name?.toLowerCase().includes(search.toLowerCase()) ||
      startup.description?.toLowerCase().includes(search.toLowerCase());
    const matchStage = selectedStage === 'All' || startup.stage === selectedStage;
    const matchSector = selectedSector === 'All' || startup.sector === selectedSector;
    return matchSearch && matchStage && matchSector;
  });

  return (
    <div className="py-6 bg-transparent">
      {/* Solid White Header */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 lg:p-8 mb-6">
        <div>
          <div className="flex items-center gap-2 text-slate-600 text-xs font-bold mb-3">
            <Rocket size={14} className="text-slate-500" />
            <span>Startup Ecosystem</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 mb-3 tracking-tight">IITRAM Alumni Startups</h1>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed font-medium">
            Discover the innovative companies and ventures founded by IITRAM graduates.
            From infrastructure tech to deep-tech, our alumni are building the future.
          </p>

          {/* Quick stats in solid white layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Startups Founded', value: stats.totalStartups || '120+', icon: Rocket },
              { label: 'Total Funding', value: '₹2,400Cr+', icon: DollarSign },
              { label: 'Jobs Created', value: '15,000+', icon: Users },
              { label: 'Countries', value: '18', icon: Globe },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <s.icon size={16} className="text-slate-500 mb-2" />
                <p className="text-lg md:text-xl font-bold font-display text-slate-900 leading-none">{s.value}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solid White Filters Dock */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mb-6 sticky top-16 z-20">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search startups..."
                className="input pl-10 text-xs h-10 bg-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
              {STAGES.map(stage => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={selectedStage === stage ? 'filter-pill-active' : 'filter-pill'}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Sector pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 border-t border-slate-100 pt-2.5">
            {SECTORS.map(sector => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={selectedSector === sector ? 'filter-pill-active' : 'filter-pill'}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-xs font-bold text-slate-500">{filtered.length} startups found</p>
        <Link to="/alumni" className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1">
          View all alumni <ChevronRight size={12} />
        </Link>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-3">
              <div className="flex gap-3">
                <div className="skeleton w-12 h-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-3 w-24 rounded" />
                </div>
              </div>
              <div className="skeleton h-14 w-full rounded" />
              <div className="flex gap-3">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-16 text-center">
          <Lightbulb size={40} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-base font-bold font-display text-slate-700">No startups found</h3>
          <p className="text-xs text-slate-400 mt-1">Try a different search query or select another filter stage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((alumni: any) => (
            <StartupCard key={alumni._id} alumni={alumni} />
          ))}
        </div>
      )}

      {/* Solid list-your-startup CTA */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-8 mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold font-display text-slate-900 tracking-tight">Founded a startup?</h3>
          <p className="text-slate-500 text-xs mt-1 font-medium">Add your venture to the IITRAM startup ecosystem directory.</p>
        </div>
        <Link to="/profile/edit" className="btn btn-primary whitespace-nowrap shrink-0">
          List Your Startup
        </Link>
      </div>
    </div>
  );
}
