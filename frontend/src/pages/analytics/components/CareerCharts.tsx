import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Briefcase, Users } from 'lucide-react';

interface CareerChartsProps {
  placement: any[];
  distribution: any;
}

const COLORS = ['#0169FC', '#14b8a6', '#5d40f8', '#2dd4bf', '#2d10cf', '#0d9488'];

export default function CareerCharts({ placement, distribution }: CareerChartsProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      {/* Placement Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5"
      >
        <h3 className="font-bold font-display text-slate-900 text-sm mb-5 flex items-center gap-2">
          <Briefcase size={16} className="text-[#001f54]" /> Placement Statistics
        </h3>
        {placement?.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={placement.slice(-8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
              <Legend formatter={(v) => <span className="text-[10px] text-slate-500 font-bold">{v}</span>} />
              <Bar dataKey="employed" name="Employed" fill="#14b8a6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="entrepreneurs" name="Entrepreneurs" fill="#eab308" radius={[3, 3, 0, 0]} />
              <Bar dataKey="higherStudies" name="Higher Studies" fill="#0169FC" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-52 flex items-center justify-center text-slate-350 text-xs font-bold">No data available</div>
        )}
      </motion.div>

      {/* Employment Status */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5"
      >
        <h3 className="font-bold font-display text-slate-900 text-sm mb-5 flex items-center gap-2">
          <Users size={16} className="text-[#001f54]" /> Employment Status
        </h3>
        {distribution?.byEmploymentStatus?.length > 0 ? (
          <div className="space-y-4 py-2">
            {distribution.byEmploymentStatus.map((item: any, i: number) => {
              const total = distribution.byEmploymentStatus.reduce((acc: number, s: any) => acc + s.count, 0);
              const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
              return (
                <div key={item._id}>
                  <div className="flex items-center justify-between mb-1.5 text-xs font-semibold">
                    <span className="capitalize text-slate-700">{item._id}</span>
                    <span className="text-slate-500">{item.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-52 flex items-center justify-center text-slate-350 text-xs font-bold">No data available</div>
        )}
      </motion.div>
    </div>
  );
}
