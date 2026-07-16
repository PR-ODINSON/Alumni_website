import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, Shield, CheckCircle, XCircle, Eye, Briefcase, Calendar,
  BarChart3, AlertCircle, Loader2, ChevronRight, Ban, UserCheck,
  FileText, Activity, ToggleLeft, ToggleRight, Trash2, ShieldAlert
} from 'lucide-react';
import api from '../../lib/api';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'verifications', label: 'Verifications Queue', icon: Shield },
  { id: 'reports', label: 'Moderation Reports', icon: ShieldAlert },
  { id: 'audit-logs', label: 'Audit Logs', icon: Activity },
  { id: 'feature-flags', label: 'Feature Flags', icon: ToggleRight },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [verificationNotes, setVerificationNotes] = useState<Record<string, string>>({});
  const [moderationNotes, setModerationNotes] = useState<Record<string, string>>({});
  const [auditSearch, setAuditSearch] = useState('');
  
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
    enabled: activeTab === 'verifications',
  });

  // 3. Moderation Reports
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => api.get('/reports', { params: { status: 'pending' } }),
    enabled: activeTab === 'reports',
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

  // Mutations
  const verifyMutation = useMutation({
    mutationFn: ({ userId, status, notes }: any) =>
      api.post(`/verification/review/${userId}`, { status, notes }),
    onSuccess: (_, variables) => {
      toast.success(`User status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ['admin-verifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
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

  const statCards = dash ? [
    { label: 'Total Users', value: dash.totalUsers, icon: Users, color: 'text-indigo-600 border-indigo-500/20 bg-indigo-500/5' },
    { label: 'Alumni', value: dash.totalAlumni, icon: Users, color: 'text-emerald-600 border-emerald-500/20 bg-emerald-500/5' },
    { label: 'Students', value: dash.totalStudents, icon: Users, color: 'text-blue-600 border-blue-500/20 bg-blue-500/5' },
    { label: 'Pending Verifications', value: pendingVerifications.length, icon: AlertCircle, color: 'text-amber-600 border-amber-500/20 bg-amber-500/5' },
    { label: 'Moderation Reports', value: pendingReports.length, icon: ShieldAlert, color: 'text-rose-600 border-rose-500/20 bg-rose-500/5' },
    { label: 'Active Flags', value: featureFlags.filter((f: any) => f.isEnabled).length, icon: ToggleRight, color: 'text-purple-600 border-purple-500/20 bg-purple-500/5' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-950 pb-12 text-slate-100 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6 shadow-2xl overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-50">Enterprise Command Center</h1>
              <p className="text-slate-400 text-xs mt-0.5">IITRAM Alumni Portal administration, moderation, security audit logs, and feature flag controllers</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-900 rounded-md border border-slate-800 shadow-inner">Command Center Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/80 max-w-max">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === id
                  ? 'bg-indigo-600 text-slate-50 shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={14} />
              {label}
              {id === 'verifications' && pendingVerifications.length > 0 && (
                <span className="ml-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">
                  {pendingVerifications.length}
                </span>
              )}
              {id === 'reports' && pendingReports.length > 0 && (
                <span className="ml-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px]">
                  {pendingReports.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {dashLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-indigo-500" size={36} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {statCards.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</span>
                        <Icon size={16} className={color.split(' ')[0]} />
                      </div>
                      <p className="text-3xl font-extrabold text-slate-50">{value?.toLocaleString() ?? '0'}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* System Health */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-base font-bold text-slate-50 mb-4 flex items-center gap-2">
                      <Activity size={16} className="text-indigo-500" />
                      Security Auditing Status
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-slate-300">Policy Authorization Engine</p>
                          <p className="text-[10px] text-slate-500">Evaluating RBAC/PBAC/ABAC rules</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">ONLINE</span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-slate-300">Database Audit Logging</p>
                          <p className="text-[10px] text-slate-500">Recording structural mutations</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">ACTIVE</span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-slate-300">Feature Toggle Registry</p>
                          <p className="text-[10px] text-slate-500">Controlling system modules dynamically</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">ACTIVE</span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Quick Summary */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-base font-bold text-slate-50 mb-4 flex items-center gap-2">
                      <Shield size={16} className="text-amber-500" />
                      Pending Command Actions
                    </h3>
                    <p className="text-slate-400 text-xs mb-6">
                      You have {pendingVerifications.length} verifications and {pendingReports.length} content reports pending moderation.
                    </p>
                    <div className="flex gap-4">
                      <button onClick={() => setActiveTab('verifications')} className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-semibold py-3 rounded-xl text-xs transition-colors">
                        Review Verifications
                      </button>
                      <button onClick={() => setActiveTab('reports')} className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-semibold py-3 rounded-xl text-xs transition-colors">
                        Inspect Abuse Reports
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-50 mb-2">User Verification Processing Queue</h3>
            {verLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" size={24} /></div>
            ) : pendingVerifications.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
                <CheckCircle size={40} className="text-emerald-500 mx-auto mb-4" />
                <p className="text-slate-300 font-bold">Queue Empty</p>
                <p className="text-slate-500 text-xs mt-1">No user accounts are currently pending credential validation.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVerifications.map((u: any) => (
                  <div key={u._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-lg font-bold text-indigo-400">
                          {u.firstName?.[0]}{u.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-50">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-slate-400">{u.email} · Role: <span className="capitalize">{u.role}</span></p>
                          <p className="text-xs text-slate-500 mt-2">Requested: {formatDate(u.createdAt)}</p>
                          
                          {/* Display documents */}
                          {u.verificationDocuments?.length > 0 && (
                            <div className="mt-4">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Submitted Documentation:</p>
                              <div className="flex gap-2">
                                {u.verificationDocuments.map((doc: string, idx: number) => (
                                  <a
                                    key={idx}
                                    href={doc}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-indigo-400 font-semibold transition-colors"
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

                      <div className="flex flex-col gap-3 w-full md:w-80">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Review Comments / Notes</label>
                        <textarea
                          placeholder="Provide reasoning for validation decision..."
                          value={verificationNotes[u._id] || ''}
                          onChange={(e) => setVerificationNotes({ ...verificationNotes, [u._id]: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => verifyMutation.mutate({ userId: u._id, status: 'verified', notes: verificationNotes[u._id] })}
                            disabled={verifyMutation.isPending}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-50 font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button
                            onClick={() => verifyMutation.mutate({ userId: u._id, status: 'rejected', notes: verificationNotes[u._id] })}
                            disabled={verifyMutation.isPending}
                            className="flex-1 bg-rose-600 hover:bg-rose-500 text-slate-50 font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
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

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-50 mb-2">Content Abuse Moderation Queue</h3>
            {reportsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" size={24} /></div>
            ) : pendingReports.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
                <CheckCircle size={40} className="text-emerald-500 mx-auto mb-4" />
                <p className="text-slate-300 font-bold">Queue Clean</p>
                <p className="text-slate-500 text-xs mt-1">No reported items pending review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReports.map((r: any) => (
                  <div key={r._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                            {r.reason.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">Reported on {formatDate(r.createdAt)}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-200">
                          Target Module: <span className="text-indigo-400 font-bold">{r.targetType}</span> · ID: <span className="font-mono text-slate-400 text-xs">{r.targetId}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <span className="text-slate-500 block mb-1 uppercase font-bold text-[9px]">Reporter details/comments:</span>
                          "{r.details}"
                        </p>
                        <p className="text-[10px] text-slate-500 mt-2">Reporter: {r.reporter?.firstName} {r.reporter?.lastName} ({r.reporter?.email})</p>
                      </div>

                      <div className="flex flex-col gap-3 w-full lg:w-80">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Moderation Notes</label>
                        <textarea
                          placeholder="Provide audit reason for moderation action..."
                          value={moderationNotes[r._id] || ''}
                          onChange={(e) => setModerationNotes({ ...moderationNotes, [r._id]: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                          rows={2}
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => moderateMutation.mutate({ reportId: r._id, status: 'resolved', actionTaken: 'deleted', notes: moderationNotes[r._id] })}
                            disabled={moderateMutation.isPending}
                            className="flex-1 min-w-[100px] bg-rose-600 hover:bg-rose-500 text-slate-50 font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <Trash2 size={13} /> Delete Target
                          </button>
                          <button
                            onClick={() => moderateMutation.mutate({ reportId: r._id, status: 'resolved', actionTaken: 'banned', notes: moderationNotes[r._id] })}
                            disabled={moderateMutation.isPending}
                            className="flex-1 min-w-[100px] bg-red-600 hover:bg-red-500 text-slate-50 font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <Ban size={13} /> Ban User
                          </button>
                          <button
                            onClick={() => moderateMutation.mutate({ reportId: r._id, status: 'dismissed', actionTaken: 'none', notes: moderationNotes[r._id] })}
                            disabled={moderateMutation.isPending}
                            className="flex-1 min-w-[100px] bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                          >
                            Dismiss Report
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

        {/* Audit Logs Tab */}
        {activeTab === 'audit-logs' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-base font-bold text-slate-50">Database Action Audit Logs</h3>
              <input
                type="text"
                placeholder="Filter logs by actor, action, or resource..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full sm:w-80 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {auditLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" size={24} /></div>
            ) : auditLogs.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
                <CheckCircle size={40} className="text-emerald-500 mx-auto mb-4" />
                <p className="text-slate-300 font-bold">No Logs Found</p>
                <p className="text-slate-500 text-xs mt-1">Try modifying your search criteria.</p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Timestamp</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4">Resource</th>
                        <th className="px-6 py-4">Actor</th>
                        <th className="px-6 py-4 font-mono">Details / Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {auditLogs.map((log: any) => (
                        <tr key={log._id} className="hover:bg-slate-850/50">
                          <td className="px-6 py-4 whitespace-nowrap text-slate-400">{formatDate(log.timestamp)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[10px]">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-300">{log.resource} ({log.resourceId})</td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                            {log.actor?.firstName} {log.actor?.lastName}
                            <span className="block text-[10px] text-slate-500">{log.actor?.email}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{log.reason || 'No details provided'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature Flags Tab */}
        {activeTab === 'feature-flags' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-50 mb-2">Dynamic Module Feature Flags</h3>
            {flagsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" size={24} /></div>
            ) : featureFlags.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
                <p className="text-slate-350 font-bold">No feature flags registered.</p>
                <p className="text-slate-500 text-xs mt-1">Submit flags in the database or trigger via API.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featureFlags.map((flag: any) => (
                  <div key={flag._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-50">{flag.name}</p>
                      <p className="text-xs text-indigo-400 font-mono mt-0.5">key: {flag.key}</p>
                      <p className="text-xs text-slate-400 mt-2">{flag.description || 'No description provided.'}</p>
                    </div>
                    <button
                      onClick={() => toggleFlagMutation.mutate({ key: flag.key, isEnabled: !flag.isEnabled })}
                      disabled={toggleFlagMutation.isPending}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {flag.isEnabled ? (
                        <ToggleRight size={44} className="text-emerald-500" />
                      ) : (
                        <ToggleLeft size={44} className="text-slate-600" />
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
  );
}
