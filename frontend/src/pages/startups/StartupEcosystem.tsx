import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Rocket, TrendingUp, Users, DollarSign, Globe,
  ExternalLink, Filter, Search, ChevronRight, Lightbulb,
} from 'lucide-react';
import { useState } from 'react';
import { alumniApi, analyticsApi } from '../../lib/api';

const STAGES = ['All', 'Idea', 'MVP', 'Seed', 'Series A', 'Series B+', 'Acquired'];
const SECTORS = ['All', 'Infrastructure Tech', 'Construction', 'Clean Energy', 'AI/ML', 'SaaS', 'FinTech', 'EdTech', 'HealthTech'];

function StartupCard({ alumni }: { alumni: any }) {
  const startup = alumni.startup;
  const user = alumni.user || {};
  const founderName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-hover p-6 flex flex-col gap-4"
    >
      {/* Startup Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-iitram-50 to-iitram-100 rounded-xl flex items-center justify-center border border-iitram-100">
            {startup.logo ? (
              <img src={startup.logo} alt={startup.name} className="w-10 h-10 object-contain rounded-lg" />
            ) : (
              <Rocket size={22} className="text-iitram-600" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{startup.name}</h3>
            <p className="text-xs text-slate-500">{startup.sector} · {startup.founded ? startup.founded : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {startup.stage && (
            <span className={`badge text-xs ${
              startup.stage === 'Series A' || startup.stage === 'Series B+' ? 'badge-success' :
              startup.stage === 'Seed' ? 'badge-warning' : 'badge-primary'
            }`}>
              {startup.stage}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {startup.description && (
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{startup.description}</p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        {startup.teamSize && (
          <span className="flex items-center gap-1">
            <Users size={12} /> {startup.teamSize} employees
          </span>
        )}
        {startup.valuation && (
          <span className="flex items-center gap-1">
            <DollarSign size={12} /> {startup.valuation}
          </span>
        )}
        {startup.location && (
          <span className="flex items-center gap-1">
            <Globe size={12} /> {startup.location}
          </span>
        )}
      </div>

      {/* Founder */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-iitram-100 rounded-full flex items-center justify-center text-xs font-medium text-iitram-700">
            {founderName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-700">{founderName}</p>
            <p className="text-xs text-slate-400">Batch {alumni.batch} · {alumni.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {startup.website && (
            <a
              href={startup.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-700"
            >
              <ExternalLink size={13} />
            </a>
          )}
          <Link
            to={`/alumni/${alumni.user?._id}`}
            className="text-xs text-iitram-600 hover:underline"
          >
            Profile →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

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
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero */}
      <div className="relative bg-slate-900 border-b border-slate-800 text-white">
        <div className="absolute inset-0">
          <img src="/images/startup-ecosystem.png" alt="Startup Ecosystem" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>
        <div className="relative z-10 page-container py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-iitram-300 text-sm mb-3">
              <Rocket size={16} />
              <span>Startup Ecosystem</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">IITRAM Alumni Startups</h1>
            <p className="text-slate-300 max-w-2xl">
              Discover the innovative companies and ventures founded by IITRAM graduates.
              From infrastructure tech to deep-tech, our alumni are building the future.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[
                { label: 'Startups Founded', value: stats.totalStartups || '120+', icon: Rocket },
                { label: 'Total Funding', value: '₹2,400Cr+', icon: DollarSign },
                { label: 'Jobs Created', value: '15,000+', icon: Users },
                { label: 'Countries', value: '18', icon: Globe },
              ].map(s => (
                <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                  <s.icon size={20} className="text-iitram-300 mb-2" />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-10">
        <div className="page-container py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search startups..."
                className="input pl-9 text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
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
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-none pb-1">
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

      {/* Grid */}
      <div className="page-container py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{filtered.length} startups found</p>
          <Link to="/alumni" className="text-sm text-iitram-600 hover:underline flex items-center gap-1">
            View all alumni <ChevronRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card p-6 space-y-3">
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
          <div className="text-center py-20">
            <Lightbulb size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No startups found</h3>
            <p className="text-slate-400 mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((alumni: any) => (
              <StartupCard key={alumni._id} alumni={alumni} />
            ))}
          </div>
        )}
      </div>

      {/* CTA for alumni to list their startup */}
      <div className="bg-gradient-to-r from-gold-50 to-amber-50 border-t border-gold-200">
        <div className="page-container py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Founded a startup?</h3>
            <p className="text-slate-600 mt-1">Add your venture to the IITRAM startup ecosystem directory.</p>
          </div>
          <Link to="/profile/edit" className="btn-primary whitespace-nowrap">
            List Your Startup
          </Link>
        </div>
      </div>
    </div>
  );
}
