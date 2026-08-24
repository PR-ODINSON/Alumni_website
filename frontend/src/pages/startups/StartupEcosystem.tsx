import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, DollarSign, Users, Globe, Search, ChevronRight, Lightbulb, X, SlidersHorizontal, Plus, ArrowUpRight, Sparkles, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { alumniApi, analyticsApi } from '../../lib/api';
import StartupCard from './components/StartupCard';
import StartupDetailModal from './components/StartupDetailModal';
import { useAuthStore } from '../../stores/authStore';

const STAGES = ['All', 'Idea', 'MVP', 'Seed', 'Series A', 'Series B+', 'Acquired'];
const SECTORS = ['All', 'Infrastructure Tech', 'Construction', 'Clean Energy', 'AI/ML', 'SaaS', 'FinTech', 'EdTech', 'HealthTech'];

export default function StartupEcosystem() {
  const { isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'stage'>('default');
  const [selectedStartup, setSelectedStartup] = useState<any | null>(null);

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

  const filtered = useMemo(() => {
    return allStartups
      .filter(a => {
        const startup = a.startup || {};
        const matchSearch =
          !search ||
          startup.name?.toLowerCase().includes(search.toLowerCase()) ||
          startup.description?.toLowerCase().includes(search.toLowerCase()) ||
          startup.sector?.toLowerCase().includes(search.toLowerCase()) ||
          a.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          a.user?.lastName?.toLowerCase().includes(search.toLowerCase());

        const matchStage = selectedStage === 'All' || startup.stage === selectedStage;
        const matchSector = selectedSector === 'All' || startup.sector === selectedSector;
        return matchSearch && matchStage && matchSector;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return (a.startup?.name || '').localeCompare(b.startup?.name || '');
        }
        if (sortBy === 'stage') {
          return (a.startup?.stage || '').localeCompare(b.startup?.stage || '');
        }
        return 0;
      });
  }, [allStartups, search, selectedStage, selectedSector, sortBy]);

  const hasActiveFilters = search.trim() !== '' || selectedStage !== 'All' || selectedSector !== 'All';

  const clearFilters = () => {
    setSearch('');
    setSelectedStage('All');
    setSelectedSector('All');
    setSortBy('default');
  };

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Banner with Modern Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#001f54] via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 mt-4 mb-8 shadow-xl border border-slate-800">
        {/* Subtle glowing ambient orbs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-white text-xs font-bold mb-4 backdrop-blur-sm">
                <Rocket size={14} className="text-amber-400" />
                <span>IITRAM Innovation Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-3">
                Alumni Startup Ecosystem
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                Explore innovative ventures, deep-tech spinouts, and fast-growing companies founded by IITRAM graduates worldwide.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <Link
                to="/profile/edit"
                className="btn btn-primary btn-sm sm:btn-lg font-bold text-xs sm:text-sm shadow-md flex items-center gap-2"
              >
                <Plus size={16} />
                <span>List Your Startup</span>
              </Link>
              <Link
                to="/directory"
                className="btn btn-outline border-white/20 text-white hover:bg-white/10 btn-sm sm:btn-lg font-bold text-xs sm:text-sm"
              >
                <span>Browse Founders</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Quick Ecosystem Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/10">
            {[
              { label: 'Ventures Listed', value: stats.totalStartups || (allStartups.length > 0 ? allStartups.length : '120+'), icon: Rocket, color: 'text-amber-400' },
              { label: 'Cumulative Capital', value: '₹2,400Cr+', icon: DollarSign, color: 'text-emerald-400' },
              { label: 'Jobs Created', value: '15,000+', icon: Users, color: 'text-brand-400' },
              { label: 'Global Footprint', value: '18 Countries', icon: Globe, color: 'text-purple-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={14} className={color} />
                  <span className="text-[10px] sm:text-[11px] text-slate-300 font-bold uppercase tracking-wider">{label}</span>
                </div>
                <p className="text-base sm:text-xl md:text-2xl font-extrabold font-display text-white tracking-tight leading-none">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Responsive Filter Dock */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-4 sm:p-5 mb-6 sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div className="space-y-3.5">
          {/* Top Filter Bar: Search + Sort + Reset */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by company name, sector, founder, or keyword..."
                className="input pl-10 pr-9 text-xs h-10 w-full"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="input text-xs h-10 w-full sm:w-40 font-semibold"
              >
                <option value="default">Sort: Default</option>
                <option value="name">Sort by Name</option>
                <option value="stage">Sort by Stage</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn btn-ghost btn-sm text-xs font-bold text-red-600 hover:bg-red-50 shrink-0 flex items-center gap-1"
                >
                  <X size={13} />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Stage Filters (Scrollable on small screens) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline-block">Stage:</span>
            {STAGES.map(stage => (
              <button
                key={stage}
                type="button"
                onClick={() => setSelectedStage(stage)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  selectedStage === stage
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>

          {/* Sector Filters (Scrollable Chips) */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 border-t border-slate-100 pt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline-block">Sector:</span>
            {SECTORS.map(sector => (
              <button
                key={sector}
                type="button"
                onClick={() => setSelectedSector(sector)}
                className={`text-[11px] px-3 py-1 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedSector === sector
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm font-bold text-slate-700">
            {isLoading ? 'Searching ecosystem...' : `${filtered.length} ${filtered.length === 1 ? 'startup' : 'startups'} found`}
          </p>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold border border-brand-100">
              Filtered
            </span>
          )}
        </div>

        <Link to="/directory" className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1">
          Explore all alumni <ChevronRight size={13} />
        </Link>
      </div>

      {/* Startup Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white border border-slate-200 shadow-xs rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 w-32 rounded-md" />
                  <div className="h-3 bg-slate-200 w-24 rounded-md" />
                </div>
              </div>
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-3 bg-slate-100 rounded-md" />
                <div className="h-3 bg-slate-100 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 shadow-xs rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto"
        >
          <div className="w-16 h-16 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-500 shadow-2xs">
            <Lightbulb size={30} />
          </div>
          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 mb-1">No startups found</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-6">
            We couldn't find any ventures matching your current filters. Try changing your search query or reset your filters.
          </p>
          <div className="flex justify-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn btn-outline btn-sm text-xs font-bold"
              >
                Reset Filters
              </button>
            )}
            <Link to="/profile/edit" className="btn btn-primary btn-sm text-xs font-bold shadow-xs">
              List Your Venture
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filtered.map((alumni: any) => (
              <StartupCard
                key={alumni._id || alumni.startup?.name}
                alumni={alumni}
                onSelect={setSelectedStartup}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Startup Detail Modal */}
      <StartupDetailModal
        alumni={selectedStartup}
        onClose={() => setSelectedStartup(null)}
      />

      {/* Call to Action Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-[#001f54] text-white rounded-3xl p-6 sm:p-8 md:p-10 mt-12 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 text-xs font-bold mb-2">
            <Sparkles size={15} />
            <span>Calling All IITRAM Innovators</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight mb-2">
            Building or scaling a new venture?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            Showcase your startup to thousands of fellow alumni, connect with talent, find co-founders, and explore institutional support.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
          <Link
            to="/profile/edit"
            className="btn btn-primary btn-sm sm:btn-lg font-bold text-xs sm:text-sm text-center shadow-xs"
          >
            Add Startup to Directory
          </Link>
        </div>
      </div>
    </div>
  );
}

