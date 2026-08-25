import type { InstituteStatistic } from '../../data/iitram/types';
import { SourceAttribution } from './OfficialSource';

interface StatMetricGridProps {
  statistics: InstituteStatistic[];
  title?: string;
}

export function StatMetricGrid({ statistics, title = 'Institute Highlights' }: StatMetricGridProps) {
  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
        {title}
      </h2>
      <p className="text-[10px] text-slate-400 font-medium mb-4 px-1">
        According to IITRAM&apos;s official website — figures are time-sensitive snapshots.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {statistics.map((stat) => (
          <div key={stat.id} className="stat-card">
            <p className="text-xl font-bold font-display text-brand-600 leading-none">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-900 mt-2 uppercase tracking-wide">{stat.metric}</p>
            {stat.note && (
              <p className="text-[9px] text-slate-400 mt-1 font-medium leading-snug">{stat.note}</p>
            )}
            <SourceAttribution source={stat.source} className="mt-2" />
          </div>
        ))}
      </div>
    </section>
  );
}
