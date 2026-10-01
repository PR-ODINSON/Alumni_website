import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  GraduationCap,
  Users,
  Building2,
  Calendar,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { adminApi } from '../../lib/api';
import toast from 'react-hot-toast';

export default function AcademicAnalyticsTab() {
  // Filter states
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  // Drill-down records state
  const [cohortType, setCohortType] = useState<'all' | 'students' | 'alumni'>('all');
  const [drillSearch, setDrillSearch] = useState('');
  const [drillPage, setDrillPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // 1. Fetch Aggregated Academic Stats
  const {
    data: statsRes,
    isLoading: statsLoading,
    isRefetching: statsRefetching,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['admin-academic-stats', selectedDegree, selectedDept, startYear, endYear],
    queryFn: () =>
      adminApi.getAcademicStats({
        degree: selectedDegree,
        department: selectedDept,
        yearFrom: startYear || undefined,
        yearTo: endYear || undefined,
      }),
  });

  // 2. Fetch Paginated Cohort Records for Drill-Down
  const { data: recordsRes, isLoading: recordsLoading } = useQuery({
    queryKey: [
      'admin-academic-records',
      cohortType,
      selectedDept,
      selectedDegree,
      drillSearch,
      drillPage,
    ],
    queryFn: () =>
      adminApi.getAcademicRecords({
        cohortType,
        department: selectedDept,
        degree: selectedDegree,
        search: drillSearch,
        page: drillPage,
        limit: 15,
      }),
  });

  const academicData = statsRes?.data?.data;
  const summary = academicData?.summary;
  const matrix = academicData?.matrix;
  const distinctYears: number[] = academicData?.distinctYears || [];
  const distinctDepartments: string[] = academicData?.distinctDepartments || [];
  const distinctDegrees: string[] = academicData?.distinctDegrees || ['B.Tech', 'M.Tech', 'PhD', 'Diploma'];
  const passingYearBreakdown = academicData?.passingYearBreakdown || [];

  const recordsData = recordsRes?.data?.data || [];
  const pagination = recordsRes?.data?.pagination || { total: 0, page: 1, pages: 1 };

  // Export CSV handler
  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      toast.loading('Preparing academic cohort report...', { id: 'csv-toast' });
      const response = await adminApi.exportAcademicRecordsCsv({
        cohortType,
        department: selectedDept,
        degree: selectedDegree,
        search: drillSearch,
      });

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `iitram_academic_cohort_data_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully!', { id: 'csv-toast' });
    } catch {
      toast.error('Failed to export CSV report.', { id: 'csv-toast' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedDegree('All');
    setSelectedDept('All');
    setStartYear('');
    setEndYear('');
    setDrillSearch('');
    setDrillPage(1);
    toast.success('Filters reset to default');
  };

  // Prepare chart data for department comparison
  const deptChartData = (matrix?.rows || []).slice(0, 8).map((row: any) => ({
    name: row.department.replace(' Engineering', '').replace('Computer Science & Engineering', 'CSE'),
    fullName: row.department,
    Enrolled: row.enrolledStudents,
    PassedOut: row.totalGraduated,
    Total: row.grandTotal,
  }));

  // Prepare year timeline chart data
  const yearTimelineData = passingYearBreakdown.map((item: any) => ({
    year: String(item.year),
    'Passed Students': item.totalPassed,
  }));

  return (
    <div className="space-y-6 text-slate-800">
      {/* ── Top Header & Context Card ────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#001f54] text-xs font-bold mb-2">
            <Building2 size={13} className="text-[#0169FC]" />
            IITRAM Academic Directorate Analytics
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">
            Field Demographics & Passing Year Cohorts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
            Comprehensive breakdown of enrolled students and graduated alumni across all engineering branches, sciences, and graduation batches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => refetchStats()}
            disabled={statsLoading || statsRefetching}
            className="btn btn-outline btn-sm text-xs font-bold gap-1.5"
            title="Refresh statistics"
          >
            <RefreshCw size={13} className={statsRefetching ? 'animate-spin text-[#0169FC]' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="btn btn-primary btn-sm text-xs font-bold gap-1.5 shadow-xs"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── Filter Bar ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter size={14} className="text-[#0169FC]" />
          Filter Analytics Dataset
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Degree Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Degree Program</label>
            <select
              value={selectedDegree}
              onChange={(e) => {
                setSelectedDegree(e.target.value);
                setDrillPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="All">All Degrees (B.Tech, M.Tech, PhD...)</option>
              {distinctDegrees.map((deg) => (
                <option key={deg} value={deg}>
                  {deg}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Field / Department</label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setDrillPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="All">All Fields & Departments</option>
              {distinctDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Year Range: From */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Passing Year (From)</label>
            <select
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="">Any Starting Year</option>
              {distinctYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Year Range: To */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Passing Year (To)</label>
            <div className="flex gap-2">
              <select
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="">Any Ending Year</option>
                {distinctYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              {(selectedDegree !== 'All' || selectedDept !== 'All' || startYear || endYear) && (
                <button
                  onClick={handleResetFilters}
                  className="btn btn-secondary btn-sm px-2.5 text-[11px] font-bold shrink-0"
                  title="Clear all filters"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Summary Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Enrolled Students */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0169FC] flex items-center justify-center">
              <Users size={15} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-display">
            {summary?.totalEnrolled?.toLocaleString() ?? '—'}
          </p>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
            Active in Fields
          </span>
        </div>

        {/* Total Passed Out Alumni */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Passed Out Alumni
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap size={15} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-display">
            {summary?.totalGraduated?.toLocaleString() ?? '—'}
          </p>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
            Graduated Batches
          </span>
        </div>

        {/* Combined Academic Network */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Cohort
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles size={15} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-display">
            {summary?.grandTotal?.toLocaleString() ?? '—'}
          </p>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
            Students & Alumni
          </span>
        </div>

        {/* Peak Passing Year */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Peak Passing Year
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar size={15} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-display">
            {summary?.peakYear?.year ?? '—'}
          </p>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1.5 inline-block truncate max-w-full">
            {summary?.peakYear?.count ?? 0} graduates
          </span>
        </div>

        {/* Top Field */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Top Engineering Field
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award size={15} />
            </div>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-900 font-display truncate" title={summary?.topDepartment?.department}>
            {summary?.topDepartment?.department?.replace(' Engineering', '') ?? '—'}
          </p>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded mt-1.5 inline-block truncate max-w-full">
            {summary?.topDepartment?.count ?? 0} members
          </span>
        </div>

        {/* Total Academic Fields */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Fields
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Building2 size={15} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-display">
            {summary?.totalDepartments ?? 0}
          </p>
          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mt-1.5 inline-block">
            Disciplines
          </span>
        </div>
      </div>

      {/* ── Charts Grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Field Comparison Chart */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <Building2 size={16} className="text-[#0169FC]" />
                Field Breakdown (Students vs Passed Alumni)
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Top disciplines by demographic distribution</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            {deptChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fill: '#334155', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="PassedOut" name="Passed Alumni" fill="#10b981" radius={[0, 4, 4, 0]} barSize={10} />
                  <Bar dataKey="Enrolled" name="Enrolled Students" fill="#0169FC" radius={[0, 4, 4, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-semibold">
                No field data matches selected filters
              </div>
            )}
          </div>
        </div>

        {/* Passing Year Cohort Trend */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-600" />
                Graduation Cohort Timeline (Passed Per Year)
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Annual progression of students passing out</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            {yearTimelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearTimelineData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="yearGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0169FC" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0169FC" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Passed Students"
                    stroke="#0169FC"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#yearGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-semibold">
                No graduation year records found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Cross-Tabulation Matrix: Field vs Passing Year ───────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <FileSpreadsheet size={17} className="text-[#0169FC]" />
              Field × Passing Year Distribution Matrix
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Exact number of students enrolled and passed out in each year by branch.
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-400 self-start sm:self-auto bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            Swipe table horizontally on mobile →
          </span>
        </div>

        {/* Matrix Table Container with horizontal scroll and sticky column */}
        <div className="relative overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3 sticky left-0 z-10 bg-slate-100 min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                  Field / Department
                </th>
                <th className="px-3 py-3 text-center bg-blue-50/60 text-[#001f54] min-w-[100px]">
                  Enrolled Students
                </th>
                {distinctYears.map((yr) => (
                  <th key={yr} className="px-3 py-3 text-center min-w-[70px]">
                    Passed {yr}
                  </th>
                ))}
                <th className="px-4 py-3 text-center bg-slate-100 text-slate-800 min-w-[90px]">
                  Total Passed
                </th>
                <th className="px-4 py-3 text-center bg-emerald-50 text-emerald-800 min-w-[90px]">
                  Grand Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(matrix?.rows || []).map((row: any) => (
                <tr key={row.department} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 sticky left-0 z-10 bg-white hover:bg-slate-50/70 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0169FC]" />
                      <span>{row.department}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-blue-700 bg-blue-50/20">
                    {row.enrolledStudents > 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px]">
                        {row.enrolledStudents}
                      </span>
                    ) : (
                      <span className="text-slate-300">0</span>
                    )}
                  </td>
                  {distinctYears.map((yr) => {
                    const count = row.graduatedByYear[yr] || 0;
                    return (
                      <td key={yr} className="px-3 py-3 text-center font-semibold text-slate-700">
                        {count > 0 ? (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              count >= 50
                                ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                                : count >= 20
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {count}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center font-extrabold text-slate-800 bg-slate-50/50">
                    {row.totalGraduated.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center font-extrabold text-emerald-700 bg-emerald-50/30">
                    {row.grandTotal.toLocaleString()}
                  </td>
                </tr>
              ))}

              {/* Bottom Summary Row */}
              <tr className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300 text-xs">
                <td className="px-4 py-3.5 sticky left-0 z-10 bg-slate-200 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                  Total Across Fields
                </td>
                <td className="px-3 py-3.5 text-center text-blue-800 bg-blue-100/60 font-black">
                  {summary?.totalEnrolled?.toLocaleString() ?? 0}
                </td>
                {distinctYears.map((yr) => (
                  <td key={yr} className="px-3 py-3.5 text-center text-slate-900 font-black">
                    {matrix?.yearTotals?.[yr]?.toLocaleString() ?? 0}
                  </td>
                ))}
                <td className="px-4 py-3.5 text-center text-slate-900 font-black bg-slate-200/80">
                  {summary?.totalGraduated?.toLocaleString() ?? 0}
                </td>
                <td className="px-4 py-3.5 text-center text-emerald-800 font-black bg-emerald-100/60">
                  {summary?.grandTotal?.toLocaleString() ?? 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Scalable Searchable Cohort Directory (Drill-Down) ────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <Users size={17} className="text-[#0169FC]" />
              Cohort Member Records Directory
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Browse individual students and graduated alumni matching your selected department and degree filters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Cohort Type Toggle */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              {(['all', 'students', 'alumni'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setCohortType(t);
                    setDrillPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    cohortType === t
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t === 'all' ? 'All Members' : t}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, enrollment, field..."
                value={drillSearch}
                onChange={(e) => {
                  setDrillSearch(e.target.value);
                  setDrillPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Records Table */}
        {recordsLoading ? (
          <div className="py-16 text-center text-xs font-semibold text-slate-400">
            Loading cohort records...
          </div>
        ) : recordsData.length === 0 ? (
          <div className="py-16 text-center">
            <GraduationCap size={36} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No records found</p>
            <p className="text-xs text-slate-400 mt-1">Try relaxing your search terms or filters above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-4 py-3">Member Details</th>
                  <th className="px-4 py-3">Enrollment No</th>
                  <th className="px-4 py-3">Degree & Program</th>
                  <th className="px-4 py-3">Department / Field</th>
                  <th className="px-4 py-3">Passing / Current Year</th>
                  <th className="px-4 py-3">Role & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recordsData.map((rec: any) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {rec.avatar ? (
                          <img src={rec.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 text-xs">
                            {rec.fullName?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{rec.fullName}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{rec.email || 'No email provided'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] font-semibold text-slate-700">
                      {rec.enrollmentNumber || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800">{rec.degreeType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {rec.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {rec.graduationYear}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            rec.cohortType === 'Alumni'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {rec.cohortType}
                        </span>
                        {rec.hasDonated && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-extrabold">
                            Donor
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{(drillPage - 1) * 15 + 1}</span> to{' '}
              <span className="font-bold text-slate-800">{Math.min(drillPage * 15, pagination.total)}</span> of{' '}
              <span className="font-bold text-slate-800">{pagination.total.toLocaleString()}</span> members
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setDrillPage((p) => Math.max(1, p - 1))}
                disabled={drillPage <= 1}
                className="btn btn-outline btn-sm px-2 text-xs font-bold disabled:opacity-40"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>
              <span className="px-2.5 py-1 text-slate-600 font-bold text-xs">
                Page {drillPage} of {pagination.pages}
              </span>
              <button
                onClick={() => setDrillPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={drillPage >= pagination.pages}
                className="btn btn-outline btn-sm px-2 text-xs font-bold disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
