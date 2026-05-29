import { useQuery } from '@tanstack/react-query';
import { motion, type Variants } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart,
} from 'recharts';
import {
  Users, Briefcase, Calendar, TrendingUp, Globe, Building,
  GraduationCap, Award, Rocket, Target,
} from 'lucide-react';
import { analyticsApi } from '../../lib/api';

const COLORS = ['#3b1bf2', '#14b8a6', '#5d40f8', '#2dd4bf', '#2d10cf', '#0d9488', '#8172fb', '#0f766e'];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AnalyticsPage() {
  const { data: overviewData } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: analyticsApi.getOverview,
  });

  const { data: distData } = useQuery({
    queryKey: ['analytics-distribution'],
    queryFn: analyticsApi.getAlumniDistribution,
  });

  const { data: placementData } = useQuery({
    queryKey: ['analytics-placement'],
    queryFn: analyticsApi.getPlacementStats,
  });

  const { data: startupData } = useQuery({
    queryKey: ['analytics-startups'],
    queryFn: analyticsApi.getStartupStats,
  });

  const overview = overviewData?.data?.data;
  const distribution = distData?.data?.data;
  const placement = placementData?.data?.data;
  const startups = startupData?.data?.data;

  const overviewCards = [
    { icon: Users, label: 'Total Alumni', value: overview?.totalAlumni, color: 'text-iitram-700', bg: 'bg-iitram-50' },
    { icon: GraduationCap, label: 'Students', value: overview?.totalStudents, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { icon: Briefcase, label: 'Active Jobs', value: overview?.totalJobs, color: 'text-blue-700', bg: 'bg-blue-50' },
    { icon: Calendar, label: 'Upcoming Events', value: overview?.totalEvents, color: 'text-purple-700', bg: 'bg-purple-50' },
    { icon: Target, label: 'Mentorships', value: overview?.activeMentorships, color: 'text-gold-700', bg: 'bg-gold-50' },
    { icon: Award, label: 'Verified Alumni', value: overview?.verifiedAlumni, color: 'text-rose-700', bg: 'bg-rose-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative bg-slate-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/analytics-dashboard.png" alt="Platform Analytics" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 iitram-gradient opacity-90" />
        </div>
        <div className="absolute inset-0 pattern-dots opacity-30 mix-blend-overlay" />
        <div className="relative z-10 page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge bg-white/10 text-white border-white/20 mb-4">Platform Analytics</span>
            <h1 className="text-4xl font-bold mb-3">IITRAM Alumni Network</h1>
            <p className="text-slate-300 text-lg">Real-time insights into our growing community</p>
          </motion.div>
        </div>
      </div>

      <div className="page-container py-10">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
          {overviewCards.map(({ icon: Icon, label, value, color, bg }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              custom={i * 0.05}
              initial="hidden"
              animate="visible"
              className="card-hover p-5"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {value !== undefined ? value.toLocaleString() : '—'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Department Distribution */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <GraduationCap size={18} className="text-iitram-600" /> Alumni by Department
            </h3>
            {distribution?.byDepartment?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={distribution.byDepartment.slice(0, 8)} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="_id" type="category" tick={{ fontSize: 10 }} width={140} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(val: any) => [val, 'Alumni']}
                  />
                  <Bar dataKey="count" fill="#3b1bf2" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-300">No data available</div>
            )}
          </motion.div>

          {/* Industry Distribution */}
          <motion.div variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Building size={18} className="text-iitram-600" /> Industry Distribution
            </h3>
            {distribution?.byIndustry?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={distribution.byIndustry.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="count"
                    nameKey="_id"
                    paddingAngle={3}
                  >
                    {distribution.byIndustry.slice(0, 8).map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(val: any, name: any) => [val, name]}
                  />
                  <Legend
                    formatter={(value) => <span style={{ fontSize: '11px', color: '#64748b' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-300">No data available</div>
            )}
          </motion.div>
        </div>

        {/* Batch-wise Growth */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card p-6 mb-8">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-iitram-600" /> Batch-wise Alumni Growth
          </h3>
          {distribution?.byBatch?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={distribution.byBatch}>
                <defs>
                  <linearGradient id="batchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b1bf2" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b1bf2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(val: any) => [val, 'Alumni']}
                />
                <Area type="monotone" dataKey="count" stroke="#3b1bf2" strokeWidth={2} fill="url(#batchGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-300">No data available</div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Placement Stats */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Briefcase size={18} className="text-iitram-600" /> Placement Statistics
            </h3>
            {placement?.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={placement.slice(-8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend formatter={(v) => <span style={{ fontSize: '11px' }}>{v}</span>} />
                  <Bar dataKey="employed" name="Employed" fill="#14b8a6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="entrepreneurs" name="Entrepreneurs" fill="#eab308" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="higherStudies" name="Higher Studies" fill="#3b1bf2" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-slate-300">No data available</div>
            )}
          </motion.div>

          {/* Employment Status */}
          <motion.div variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users size={18} className="text-iitram-600" /> Employment Status
            </h3>
            {distribution?.byEmploymentStatus?.length > 0 ? (
              <div className="space-y-3">
                {distribution.byEmploymentStatus.map((item: any, i: number) => {
                  const total = distribution.byEmploymentStatus.reduce((acc: number, s: any) => acc + s.count, 0);
                  const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
                  return (
                    <div key={item._id}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="capitalize text-slate-700 font-medium">{item._id}</span>
                        <span className="text-slate-500">{item.count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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
              <div className="h-52 flex items-center justify-center text-slate-300">No data available</div>
            )}
          </motion.div>
        </div>

        {/* Startup Stats */}
        {startups?.totalStartups > 0 && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Rocket size={18} className="text-orange-500" /> Startup Ecosystem
              </h3>
              <span className="text-3xl font-bold text-orange-500">{startups.totalStartups}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">By Stage</h4>
                {startups.startups?.map((s: any, i: number) => (
                  <div key={s._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="capitalize text-sm text-slate-700">{s._id}</span>
                    <span className="font-semibold text-slate-900">{s.count}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Top Sectors</h4>
                {startups.topSectors?.slice(0, 5).map((s: any) => (
                  <div key={s._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-700">{s._id}</span>
                    <span className="font-semibold text-slate-900">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Global Network Visual */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative mt-8 rounded-2xl overflow-hidden text-white">
          <div className="absolute inset-0">
            <img src="/images/global-network.png" alt="Global Network" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 premium-gradient opacity-90" />
            <div className="absolute inset-0 pattern-dots opacity-20 mix-blend-overlay" />
          </div>
          <div className="relative z-10 p-10 md:p-16">
            <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Globe size={28} className="text-iitram-300" /> A Truly Global Network
            </h3>
            <p className="text-slate-300 max-w-lg text-lg leading-relaxed">
              IITRAM alumni are making their mark across 30+ countries worldwide, fostering international collaboration, advanced research, and global technological impact.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
