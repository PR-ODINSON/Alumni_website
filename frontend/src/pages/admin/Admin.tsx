import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  CheckCircle,
  XCircle,
  BarChart3,
  AlertCircle,
  Loader2,
  Ban,
  FileText,
  Activity,
  ToggleLeft,
  ToggleRight,
  Trash2,
  ShieldAlert,
  GraduationCap,
  Building2,
  ExternalLink,
  UserCircle,
  Search,
  UserPlus,
} from 'lucide-react';
import api from '../../lib/api';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';
import AcademicAnalyticsTab from './AcademicAnalyticsTab';
import AccountGeneratorTab from './AccountGeneratorTab';

const tabs = [
  { id: 'academic',          label: 'Academic Analytics', icon: GraduationCap },
  { id: 'account-generator', label: 'Account Generator',  icon: UserPlus },
  { id: 'overview',          label: 'Overview',           icon: BarChart3 },
  { id: 'users',             label: 'All Users',          icon: Users },
  { id: 'verifications',     label: 'Verifications',      icon: Shield },
  { id: 'reports',           label: 'Moderation',         icon: ShieldAlert },
  { id: 'audit-logs',        label: 'Audit Logs',         icon: Activity },
  { id: 'feature-flags',     label: 'System Flags',       icon: ToggleRight },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('academic');
  const [verificationNotes, setVerificationNotes] = useState<Record<string, string>>({});
  const [moderationNotes, setModerationNotes] = useState<Record<string, string>>({});
  const [auditSearch, setAuditSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  const queryClient = useQueryClient();

  // 1. Dashboard Overview
  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard'),
    enabled: activeTab === 'overview',
  });

  // 2. Verification Queue
  const { data: verificationsData, isLoading: verLoading } = useQuery({
    queryKey: ['admin-verifications'],
    queryFn: () => api.get('/verification/queue', { params: { status: 'under_review' } }),
  });

  // 3. Moderation Reports
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => api.get('/reports', { params: { status: 'pending' } }),
  });

  // 4. Audit Logs
  const { data: auditData, isLoading: auditLoading } = useQuery({
    queryKey: ['admin-audit-logs', auditSearch],
    queryFn: () => api.get('/audit-logs', { params: { search: auditSearch, limit: 30 } }),
    enabled: activeTab === 'audit-logs',
  });

  // 5. Feature Flags
  const { data: flagsData, isLoading: flagsLoading } = useQuery({
    queryKey: ['admin-feature-flags'],
    queryFn: () => api.get('/feature-flags'),
    enabled: activeTab === 'feature-flags',
  });

  // 6. All Users (admin view)
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-all-users', userSearch, userRoleFilter],
    queryFn: () => api.get('/admin/users', {
      params: { search: userSearch || undefined, role: userRoleFilter || undefined, limit: 50 },
    }),
    enabled: activeTab === 'users',
  });

  // Mutations
  const verifyMutation = useMutation({
    mutationFn: ({ userId, status, notes }: any) =>
      api.post(`/verification/review/${userId}`, { status, notes }),
    onSuccess: (_, variables) => {
      toast.success(`User status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ['admin-verifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-academic-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-academic-records'] });
    },
    onError: () => toast.error('Action failed'),
  });

  const moderateMutation = useMutation({
    mutationFn: ({ reportId, status, actionTaken, notes }: any) =>
      api.post(`/reports/${reportId}/action`, { status, actionTaken, notes }),
    onSuccess: () => {
      toast.success('Moderation action submitted');
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
    onError: () => toast.error('Action failed'),
  });

  const toggleFlagMutation = useMutation({
    mutationFn: ({ key, isEnabled }: any) =>
      api.post('/feature-flags/toggle', { key, isEnabled }),
    onSuccess: () => {
      toast.success('Feature flag toggled successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-feature-flags'] });
    },
    onError: () => toast.error('Action failed'),
  });

  const dash = dashData?.data?.data;
  const pendingVerifications = verificationsData?.data?.data || [];
  const pendingReports = reportsData?.data?.data || [];
  const auditLogs = auditData?.data?.data || [];
  const featureFlags = flagsData?.data?.data || [];

  const statCards = dash
    ? [
        { label: 'Total Enrolled', value: dash.totalUsers, icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
        { label: 'Alumni Members', value: dash.totalAlumni, icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
        { label: 'Active Students', value: dash.totalStudents, icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
        { label: 'Pending Verifications', value: pendingVerifications.length, icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-100' },
        { label: 'Active Job Postings', value: dash.totalJobs || 0, icon: Building2, color: 'text-purple-600 bg-purple-50 border-purple-100' },
        { label: 'Abuse Reports', value: pendingReports.length, icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-100' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16 text-slate-800 font-sans">
      {/* ── Institutional Header ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#001f54] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="font-extrabold text-sm tracking-wider">IITRAM</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">
                  Institutional Administration Portal
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#0169FC] text-[10px] font-bold">
                  Admin Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 leading-relaxed">
                Academic cohort analytics, student field distributions, alumni verifications, and institutional governance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Institute Session Verified</span>
          </div>
        </div>
      </div>

      {/* ── Main Tab Navigation Bar ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs min-w-max">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-[#001f54] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon size={14} className={activeTab === id ? 'text-blue-300' : 'text-slate-400'} />
                <span>{label}</span>
                {id === 'verifications' && pendingVerifications.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
                    {pendingVerifications.length}
                  </span>
                )}
                {id === 'reports' && pendingReports.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                    {pendingReports.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content Areas ────────────────────────────────────────────── */}
        <div className="mt-5">
          {/* TAB 1: Field & Passing Year Academic Analytics */}
          {activeTab === 'academic' && <AcademicAnalyticsTab />}

          {/* TAB: Student & Alumni Account Generator */}
          {activeTab === 'account-generator' && <AccountGeneratorTab />}

          {/* TAB 2: Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {dashLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="animate-spin text-[#0169FC]" size={36} />
                </div>
              ) : (
                <>
                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {statCards.map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">
                            {label}
                          </span>
                          <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${color}`}>
                            <Icon size={14} />
                          </div>
                        </div>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-display">
                          {value?.toLocaleString() ?? '0'}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                    {/* Quick Administrative Actions */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Shield size={16} className="text-amber-500" />
                        Verification & Governance Actions
                      </h3>
                      <p className="text-slate-500 text-xs mb-5 font-medium leading-relaxed">
                        There are <span className="font-bold text-slate-800">{pendingVerifications.length} alumni verification requests</span> and{' '}
                        <span className="font-bold text-slate-800">{pendingReports.length} content reports</span> awaiting your action.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setActiveTab('verifications')}
                          className="flex-1 btn btn-primary btn-sm text-xs font-bold shadow-xs py-2.5 h-auto justify-center"
                        >
                          Review Alumni Queue ({pendingVerifications.length})
                        </button>
                        <button
                          onClick={() => setActiveTab('reports')}
                          className="flex-1 btn btn-outline btn-sm text-xs font-bold py-2.5 h-auto justify-center"
                        >
                          Inspect Reports ({pendingReports.length})
                        </button>
                      </div>
                    </div>

                    {/* Academic Quick Link */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <GraduationCap size={16} className="text-[#0169FC]" />
                        Academic Cohort Demographics
                      </h3>
                      <p className="text-slate-500 text-xs mb-5 font-medium leading-relaxed">
                        Access detailed cross-tabulation matrices showing student enrollment and graduation numbers by engineering branch and passing year.
                      </p>
                      <button
                        onClick={() => setActiveTab('academic')}
                        className="btn btn-outline btn-sm w-full text-xs font-bold py-2.5 h-auto justify-center gap-2 text-[#001f54]"
                      >
                        <span>Open Field & Passing Year Analytics</span>
                        <ExternalLink size={13} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: Users — admin views all profiles */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Search + Filter bar */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="input pl-8 text-sm w-full"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={e => setUserRoleFilter(e.target.value)}
                  className="input h-10 py-0 text-sm w-full sm:w-40"
                >
                  <option value="">All Roles</option>
                  <option value="alumni">Alumni</option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {usersLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin text-[#0169FC]" size={28} />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {usersData?.data?.pagination?.total ?? 0} users
                    </p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {(usersData?.data?.data || []).map((u: any) => (
                      <div key={u._id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                        {/* Avatar */}
                        {u.avatar ? (
                          <img src={u.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" alt="" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#073F7C] to-[#1597A2] flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">{u.firstName?.[0]}{u.lastName?.[0]}</span>
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-slate-900 truncate">{u.firstName} {u.lastName}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize border ${
                              u.role === 'admin'   ? 'bg-red-50 text-red-700 border-red-200' :
                              u.role === 'alumni'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              u.role === 'faculty' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {u.role}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize border ${
                              u.verificationStatus === 'verified'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              u.verificationStatus === 'pending'   ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              u.verificationStatus === 'suspended' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              {u.verificationStatus}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{u.email}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            to={u.role === 'alumni' ? `/alumni/${u._id}` : `/profile/${u._id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#073F7C] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                          >
                            <UserCircle size={13} /> View Profile
                          </Link>
                        </div>
                      </div>
                    ))}
                    {(usersData?.data?.data || []).length === 0 && (
                      <div className="text-center py-16 text-slate-400 text-sm">
                        No users found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Verifications Tab */}
          {activeTab === 'verifications' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-slate-900">Alumni Credential Verification Queue</h3>
                <span className="text-xs text-slate-500 font-medium">
                  {pendingVerifications.length} submission{pendingVerifications.length === 1 ? '' : 's'} pending review
                </span>
              </div>

              {verLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin text-slate-400" size={28} />
                </div>
              ) : pendingVerifications.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-16 text-center shadow-xs">
                  <CheckCircle size={40} className="text-emerald-500 mx-auto mb-3" />
                  <p className="text-slate-800 font-bold text-base">Verification Queue Clear</p>
                  <p className="text-slate-400 text-xs mt-1">All submitted alumni credentials have been reviewed and approved.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingVerifications.map((u: any) => (
                    <div key={u._id} className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-base font-extrabold text-[#0169FC] shrink-0">
                            {u.firstName?.[0]}
                            {u.lastName?.[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-slate-900 text-base">
                                {u.firstName} {u.lastName}
                              </p>
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold capitalize">
                                {u.role}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                            <p className="text-[11px] text-slate-400 mt-1.5">Submitted on: {formatDate(u.createdAt)}</p>

                            {/* Display documentation */}
                            {u.verificationDocuments?.length > 0 && (
                              <div className="mt-3.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                  Verification Proof:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {u.verificationDocuments.map((doc: string, idx: number) => (
                                    <a
                                      key={idx}
                                      href={doc}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-lg text-xs text-[#0169FC] font-semibold transition-colors"
                                    >
                                      <FileText size={12} />
                                      View Document {idx + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2.5 w-full lg:w-80">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Review Decision Notes
                          </label>
                          <textarea
                            placeholder="Optional notes or remarks for verification..."
                            value={verificationNotes[u._id] || ''}
                            onChange={(e) => setVerificationNotes({ ...verificationNotes, [u._id]: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                verifyMutation.mutate({ userId: u._id, status: 'verified', notes: verificationNotes[u._id] })
                              }
                              disabled={verifyMutation.isPending}
                              className="flex-1 btn btn-primary btn-sm text-xs font-bold gap-1 shadow-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                            >
                              <CheckCircle size={13} /> Approve
                            </button>
                            <button
                              onClick={() =>
                                verifyMutation.mutate({ userId: u._id, status: 'rejected', notes: verificationNotes[u._id] })
                              }
                              disabled={verifyMutation.isPending}
                              className="flex-1 btn btn-outline btn-sm text-xs font-bold gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Moderation Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-slate-900">Community Moderation Reports</h3>
                <span className="text-xs text-slate-500 font-medium">{pendingReports.length} pending report(s)</span>
              </div>

              {reportsLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin text-slate-400" size={28} />
                </div>
              ) : pendingReports.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-16 text-center shadow-xs">
                  <CheckCircle size={40} className="text-emerald-500 mx-auto mb-3" />
                  <p className="text-slate-800 font-bold text-base">All Clean</p>
                  <p className="text-slate-400 text-xs mt-1">No community posts or profiles are flagged for review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingReports.map((r: any) => (
                    <div key={r._id} className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold">
                              {r.reason?.toUpperCase() || 'ABUSE REPORT'}
                            </span>
                            <span className="text-xs text-slate-400">Reported on {formatDate(r.createdAt)}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800">
                            Target Module: <span className="text-[#0169FC] font-bold">{r.targetType}</span> · ID:{' '}
                            <span className="font-mono text-slate-500 text-xs">{r.targetId}</span>
                          </p>
                          <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <span className="text-slate-400 block mb-1 uppercase font-bold text-[9px]">Report details:</span>
                            "{r.details}"
                          </p>
                          <p className="text-[11px] text-slate-400 mt-2">
                            Reporter: {r.reporter?.firstName} {r.reporter?.lastName} ({r.reporter?.email})
                          </p>
                        </div>

                        <div className="flex flex-col gap-2.5 w-full lg:w-80">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Action Resolution Notes
                          </label>
                          <textarea
                            placeholder="Provide audit reason for moderation action..."
                            value={moderationNotes[r._id] || ''}
                            onChange={(e) => setModerationNotes({ ...moderationNotes, [r._id]: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            rows={2}
                          />
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                moderateMutation.mutate({
                                  reportId: r._id,
                                  status: 'resolved',
                                  actionTaken: 'deleted',
                                  notes: moderationNotes[r._id],
                                })
                              }
                              disabled={moderateMutation.isPending}
                              className="flex-1 btn btn-danger btn-sm text-xs font-bold gap-1"
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                            <button
                              onClick={() =>
                                moderateMutation.mutate({
                                  reportId: r._id,
                                  status: 'resolved',
                                  actionTaken: 'banned',
                                  notes: moderationNotes[r._id],
                                })
                              }
                              disabled={moderateMutation.isPending}
                              className="flex-1 btn btn-outline btn-sm text-xs font-bold gap-1 text-red-600 hover:bg-red-50"
                            >
                              <Ban size={13} /> Ban
                            </button>
                            <button
                              onClick={() =>
                                moderateMutation.mutate({
                                  reportId: r._id,
                                  status: 'dismissed',
                                  actionTaken: 'none',
                                  notes: moderationNotes[r._id],
                                })
                              }
                              disabled={moderateMutation.isPending}
                              className="flex-1 btn btn-secondary btn-sm text-xs font-bold"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Audit Logs Tab */}
          {activeTab === 'audit-logs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Activity size={17} className="text-[#0169FC]" />
                    Administrative Security Audit Logs
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Record of administrative events and credential modifications.</p>
                </div>
                <input
                  type="text"
                  placeholder="Filter logs by actor, action, or resource..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full sm:w-80 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                />
              </div>

              {auditLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin text-slate-400" size={28} />
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-16 text-center shadow-xs">
                  <CheckCircle size={40} className="text-emerald-500 mx-auto mb-3" />
                  <p className="text-slate-800 font-bold text-base">No Audit Logs Found</p>
                  <p className="text-slate-400 text-xs mt-1">Try modifying your filter query.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="px-5 py-3">Timestamp</th>
                          <th className="px-5 py-3">Action</th>
                          <th className="px-5 py-3">Resource</th>
                          <th className="px-5 py-3">Administrator</th>
                          <th className="px-5 py-3">Reason / Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {auditLogs.map((log: any) => (
                          <tr key={log._id} className="hover:bg-slate-50/70">
                            <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">{formatDate(log.timestamp)}</td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0169FC] font-mono text-[10px] font-bold">
                                {log.action}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-800">
                              {log.resource} <span className="text-slate-400 text-[10px]">({log.resourceId})</span>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap text-slate-700 font-semibold">
                              {log.actor?.firstName} {log.actor?.lastName}
                              <span className="block text-[10px] text-slate-400 font-normal">{log.actor?.email}</span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{log.reason || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Feature Flags Tab */}
          {activeTab === 'feature-flags' && (
            <div className="space-y-4">
              <div className="mb-2">
                <h3 className="text-base font-bold text-slate-900">Platform System Configuration & Feature Flags</h3>
                <p className="text-xs text-slate-500 font-medium">Control dynamic modules across the IITRAM portal in real time.</p>
              </div>

              {flagsLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin text-slate-400" size={28} />
                </div>
              ) : featureFlags.length === 0 ? (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-16 text-center shadow-xs">
                  <p className="text-slate-800 font-bold text-base">No Feature Flags Active</p>
                  <p className="text-slate-400 text-xs mt-1">All modules are operating in default production mode.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featureFlags.map((flag: any) => (
                    <div
                      key={flag._id}
                      className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{flag.name}</p>
                        <p className="text-xs text-[#0169FC] font-mono mt-0.5">key: {flag.key}</p>
                        <p className="text-xs text-slate-500 mt-1.5">{flag.description || 'No description provided.'}</p>
                      </div>
                      <button
                        onClick={() => toggleFlagMutation.mutate({ key: flag.key, isEnabled: !flag.isEnabled })}
                        disabled={toggleFlagMutation.isPending}
                        className="transition-colors cursor-pointer"
                        title={flag.isEnabled ? 'Disable feature' : 'Enable feature'}
                      >
                        {flag.isEnabled ? (
                          <ToggleRight size={40} className="text-emerald-600" />
                        ) : (
                          <ToggleLeft size={40} className="text-slate-300 hover:text-slate-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
