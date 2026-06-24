import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { GraduationCap, Building } from 'lucide-react';

interface DistributionChartsProps {
  distribution: any;
}

const COLORS = ['#0169FC', '#10b981', '#6366f1', '#14b8a6', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function DistributionCharts({ distribution }: DistributionChartsProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-4 mb-4 font-sans text-slate-800">
      {/* Department Distribution */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-5">
        <h3 className="font-bold font-display text-slate-900 text-xs mb-4 flex items-center gap-1.5 uppercase tracking-wider text-slate-500">
          <GraduationCap size={15} className="text-[#0169FC]" /> Alumni by Department
        </h3>
        {distribution?.byDepartment?.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distribution.byDepartment.slice(0, 8)} layout="vertical" margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="_id" type="category" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} width={120} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', fontSize: '11px', fontWeight: 600, color: '#0f172a' }}
                formatter={(val: any) => [val, 'Alumni']}
              />
              <Bar dataKey="count" fill="#0169FC" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-60 flex items-center justify-center text-slate-350 text-xs font-semibold">No data available</div>
        )}
      </div>

      {/* Industry Distribution */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-5">
        <h3 className="font-bold font-display text-slate-900 text-xs mb-4 flex items-center gap-1.5 uppercase tracking-wider text-slate-500">
          <Building size={15} className="text-[#0169FC]" /> Industry Distribution
        </h3>
        {distribution?.byIndustry?.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distribution.byIndustry.slice(0, 8)}
                cx="50%"
                cy="45%"
                innerRadius={45}
                outerRadius={70}
                dataKey="count"
                nameKey="_id"
                paddingAngle={3}
              >
                {distribution.byIndustry.slice(0, 8).map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', fontSize: '11px', fontWeight: 600, color: '#0f172a' }}
                formatter={(val: any, name: any) => [val, name]}
              />
              <Legend
                verticalAlign="bottom"
                iconSize={8}
                iconType="circle"
                formatter={(value) => <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-60 flex items-center justify-center text-slate-350 text-xs font-semibold">No data available</div>
        )}
      </div>
    </div>
  );
}
