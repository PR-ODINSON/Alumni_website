import { useQuery } from '@tanstack/react-query';
import { Globe } from 'lucide-react';
import { analyticsApi } from '../../lib/api';

// Subcomponents
import OverviewCards from './components/OverviewCards';
import DistributionCharts from './components/DistributionCharts';
import GrowthChart from './components/GrowthChart';
import CareerCharts from './components/CareerCharts';
import StartupsSummary from './components/StartupsSummary';

export default function AnalyticsPage() {
  const { data: overviewData } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsApi.getOverview(),
  });

  const { data: distData } = useQuery({
    queryKey: ['analytics-distribution'],
    queryFn: () => analyticsApi.getAlumniDistribution(),
  });

  const { data: placementData } = useQuery({
    queryKey: ['analytics-placement'],
    queryFn: () => analyticsApi.getPlacementStats(),
  });

  const { data: startupData } = useQuery({
    queryKey: ['analytics-startups'],
    queryFn: () => analyticsApi.getStartupStats(),
  });

  const overview = overviewData?.data?.data;
  const distribution = distData?.data?.data;
  const placement = placementData?.data?.data || [];
  const startups = startupData?.data?.data;

  return (
    <div className="py-4 bg-transparent font-sans text-slate-800">
      {/* Solid White Header */}
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

      {/* KPI Overview Cards */}
      <OverviewCards overview={overview} />

      {/* Charts: Department & Industry */}
      <DistributionCharts distribution={distribution} />

      {/* Area Chart: Growth over time */}
      <GrowthChart distribution={distribution} />

      {/* Bar & Progress Charts: Careers & Placement */}
      <CareerCharts placement={placement} distribution={distribution} />

      {/* Card Section: Startup details */}
      <StartupsSummary startups={startups} />

      {/* Global Network Card */}
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
