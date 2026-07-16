import { useQuery } from '@tanstack/react-query';
import { Globe, Lock } from 'lucide-react';
import { analyticsApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { Link } from 'react-router-dom';

// Subcomponents
import OverviewCards from './components/OverviewCards';
import DistributionCharts from './components/DistributionCharts';
import GrowthChart from './components/GrowthChart';
import CareerCharts from './components/CareerCharts';
import StartupsSummary from './components/StartupsSummary';

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const { data: overviewData }   = useQuery({ queryKey: ['analytics-overview'],     queryFn: () => analyticsApi.getOverview(),           enabled: isAdmin });
  const { data: distData }       = useQuery({ queryKey: ['analytics-distribution'],  queryFn: () => analyticsApi.getAlumniDistribution(),  enabled: isAdmin });
  const { data: placementData }  = useQuery({ queryKey: ['analytics-placement'],     queryFn: () => analyticsApi.getPlacementStats(),     enabled: isAdmin });
  const { data: startupData }    = useQuery({ queryKey: ['analytics-startups'],      queryFn: () => analyticsApi.getStartupStats(),        enabled: isAdmin });

  const overview     = overviewData?.data?.data;
  const distribution = distData?.data?.data;
  const placement    = placementData?.data?.data || [];
  const startups     = startupData?.data?.data;

  // ── Non-admin gate ─────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="py-4 max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-12 mt-8 shadow-xs">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Global Analytics</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Network-wide analytics are available to administrators only.<br />
            Your personal profile stats are visible on your{' '}
            <Link to="/profile" className="text-[#0169FC] font-semibold hover:underline">Profile page</Link>.
          </p>
          {user?.role === 'alumni' || user?.role === 'student' ? (
            <Link to="/profile" className="btn btn-primary btn-sm">View My Profile</Link>
          ) : null}
        </div>
      </div>
    );
  }

  // ── Admin view ─────────────────────────────────────────────────────────────
  return (
    <div className="py-4 bg-transparent font-sans text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-5 md:p-6 mb-4">
        <div>
          <span className="bg-blue-50/70 border border-blue-100 text-[#0169FC] text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mb-2">
            Platform Analytics
          </span>
          <h1 className="text-2xl font-bold tracking-tight mb-1 font-display">IITRAM Alumni Network</h1>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-xl">
            Real-time insights and distribution statistics of our growing global alumni community.
          </p>
        </div>
      </div>

      <OverviewCards overview={overview} />
      <DistributionCharts distribution={distribution} />
      <GrowthChart distribution={distribution} />
      <CareerCharts placement={placement} distribution={distribution} />
      <StartupsSummary startups={startups} />

      <div className="relative mt-4 rounded-xl overflow-hidden text-slate-850 bg-white border border-slate-200 shadow-xs p-6 md:p-8">
        <div className="relative z-10 max-w-xl">
          <h3 className="text-base font-bold font-display text-slate-900 mb-2 flex items-center gap-2">
            <Globe size={18} className="text-[#0169FC]" /> A Truly Global Network
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed font-semibold">
            IITRAM alumni are making their mark across 30+ countries worldwide, fostering international collaboration, advanced research, and global technological impact.
          </p>
        </div>
      </div>
    </div>
  );
}
