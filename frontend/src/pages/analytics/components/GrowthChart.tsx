import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface GrowthChartProps {
  distribution: any;
}

export default function GrowthChart({ distribution }: GrowthChartProps) {
  return (
    <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-5 mb-4 font-sans text-slate-800">
      <h3 className="font-bold font-display text-slate-900 text-xs mb-4 flex items-center gap-1.5 uppercase tracking-wider text-slate-500">
        <TrendingUp size={15} className="text-[#0169FC]" /> Batch-wise Alumni Growth
      </h3>
      {distribution?.byBatch?.length > 0 ? (
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={distribution.byBatch} margin={{ left: -15, right: 10 }}>
            <defs>
              <linearGradient id="batchGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0169FC" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0169FC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
            <XAxis dataKey="_id" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', fontSize: '11px', fontWeight: 600, color: '#0f172a' }}
              formatter={(val: any) => [val, 'Alumni']}
            />
            <Area type="monotone" dataKey="count" stroke="#0169FC" strokeWidth={2.5} fill="url(#batchGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-50 flex items-center justify-center text-slate-350 text-xs font-semibold">No data available</div>
      )}
    </div>
  );
}
