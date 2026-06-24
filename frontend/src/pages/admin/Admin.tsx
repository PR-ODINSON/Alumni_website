import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, Shield, CheckCircle, XCircle, Eye, Briefcase, Calendar,
  BarChart3, AlertCircle, Loader2, ChevronRight, Ban, UserCheck,
} from 'lucide-react';
import api from '../../lib/api';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'verifications', label: 'Verifications', icon: Shield },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  const { data: dashData } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard'),
    enabled: activeTab === 'overview',
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users', { params: { limit: 30 } }),
    enabled: activeTab === 'users',
  });

  const { data: verificationsData, isLoading: verLoading } = useQuery({
    queryKey: ['admin-verifications'],
    queryFn: () => api.get('/admin/alumni/pending'),
    enabled: activeTab === 'verifications',
  });

  const verifyMutation = useMutation({
    mutationFn: ({ alumniId, status }: any) => api.patch(`/admin/alumni/${alumniId}/verify`, { status }),
    onSuccess: () => {
      toast.success('Verification status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-verifications'] });
    },
    onError: () => toast.error('Action failed'),
  });

  const banMutation = useMutation({
    mutationFn: ({ userId, action }: any) =>
      action === 'ban'
        ? api.patch(`/admin/users/${userId}/ban`, { reason: 'Violation of community guidelines' })
        : api.patch(`/admin/users/${userId}/unban`),
    onSuccess: () => {
      toast.success('User status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const dash = dashData?.data?.data;
  const users = usersData?.data?.data?.data || [];
  const pendingVerifications = verificationsData?.data?.data || [];

  const statCards = dash ? [
    { label: 'Total Users', value: dash.totalUsers, icon: Users, color: 'text-iitram-700', bg: 'bg-iitram-50' },
    { label: 'Alumni', value: dash.totalAlumni, icon: Users, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Students', value: dash.totalStudents, icon: Users, color: 'text-brand-700', bg: 'bg-brand-50' },
    { label: 'Pending Verifications', value: dash.pendingVerifications, icon: AlertCircle, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Total Jobs', value: dash.totalJobs, icon: Briefcase, color: 'text-purple-700', bg: 'bg-purple-50' },
    { label: 'Total Events', value: dash.totalEvents, icon: Calendar, color: 'text-rose-700', bg: 'bg-rose-50' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="relative bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-xs text-slate-900 overflow-hidden font-sans">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#0169FC]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">IITRAM Alumni Platform Administration & Moderation Portal</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200/50">
              <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 bg-white rounded-md border border-slate-200 shadow-2xs">System Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? 'bg-iitram-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-iitram-300'
              }`}
            >
              <Icon size={15} />
              {label}
              {id === 'verifications' && pendingVerifications.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {pendingVerifications.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="card p-5">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                    <Icon size={18} className={color} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{value?.toLocaleString() ?? '—'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent Users */}
            {dash?.recentUsers?.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Recent Registrations</h3>
                <div className="space-y-3">
                  {dash.recentUsers.map((u: any) => (
                    <div key={u._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-iitram-100 flex items-center justify-center text-xs font-semibold text-iitram-700">
                          {u.firstName?.[0]}{u.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge capitalize ${u.role === 'alumni' ? 'badge-primary' : u.role === 'student' ? 'badge-success' : 'badge-warning'}`}>
                          {u.role}
                        </span>
                        <span className="text-xs text-slate-400">{formatDate(u.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">All Users</h3>
            </div>
            {usersLoading ? (
              <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" size={24} /></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {users.map((u: any) => (
                  <div key={u._id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-iitram-100 flex items-center justify-center text-xs font-semibold text-iitram-700">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge capitalize ${u.role === 'alumni' ? 'badge-primary' : u.role === 'student' ? 'badge-success' : u.role === 'admin' ? 'badge-warning' : 'badge-danger'}`}>
                        {u.role}
                      </span>
                      {u.isEmailVerified && <span className="badge badge-success">Verified Email</span>}
                      {u.isBanned && <span className="badge badge-danger">Banned</span>}
                      <button
                        onClick={() => banMutation.mutate({ userId: u._id, action: u.isBanned ? 'unban' : 'ban' })}
                        className={`btn btn-sm ${u.isBanned ? 'btn-secondary' : 'btn-danger'}`}
                      >
                        {u.isBanned ? <><UserCheck size={13} /> Unban</> : <><Ban size={13} /> Ban</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Verifications */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            {verLoading ? (
              <div className="card p-8 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" size={24} /></div>
            ) : pendingVerifications.length === 0 ? (
              <div className="card p-16 text-center">
                <CheckCircle size={40} className="text-emerald-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">All caught up!</p>
                <p className="text-slate-400 text-sm">No pending verifications</p>
              </div>
            ) : (
              pendingVerifications.map((alumni: any) => (
                <div key={alumni._id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-iitram-100 flex items-center justify-center text-lg font-semibold text-iitram-700">
                        {alumni.user?.firstName?.[0]}{alumni.user?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{alumni.user?.firstName} {alumni.user?.lastName}</p>
                        <p className="text-sm text-slate-500">{alumni.user?.email}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {alumni.degreeType} · {alumni.department} · Batch {alumni.batch}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => verifyMutation.mutate({ alumniId: alumni._id, status: 'verified' })}
                        disabled={verifyMutation.isPending}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button
                        onClick={() => verifyMutation.mutate({ alumniId: alumni._id, status: 'rejected' })}
                        disabled={verifyMutation.isPending}
                        className="btn btn-danger btn-sm"
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
