import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface StartupsSummaryProps {
  startups: any;
}

export default function StartupsSummary({ startups }: StartupsSummaryProps) {
  if (!startups || !startups.totalStartups) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold font-display text-slate-900 text-sm flex items-center gap-2">
          <Rocket size={16} className="text-orange-500" /> Startup Ecosystem
        </h3>
        <span className="text-sm font-bold font-display text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">{startups.totalStartups} Total</span>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">By Funding Stage</h4>
          <div className="space-y-3">
            {startups.startups?.map((s: any) => (
              <div key={s._id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0 text-xs">
                <span className="capitalize text-slate-600 font-semibold">{s._id}</span>
                <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">Top Sectors</h4>
          <div className="space-y-3">
            {startups.topSectors?.slice(0, 5).map((s: any) => (
              <div key={s._id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0 text-xs">
                <span className="text-slate-600 font-semibold truncate max-w-[200px]">{s._id}</span>
                <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
