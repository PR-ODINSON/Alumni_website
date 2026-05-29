import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FlaskConical, Search, Users, BookOpen, Plus, ChevronRight, Globe } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate } from '../../lib/utils';

export default function ResearchPage() {
  const { isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['research', search, domain, status],
    queryFn: () => api.get('/research', { params: { search: search || undefined, domain: domain || undefined, status: status || undefined, limit: 20 } }),
  });

  const projects = data?.data?.data || [];

  const statusColors: Record<string, string> = {
    open: 'bg-emerald-50 text-emerald-700',
    'in-progress': 'bg-blue-50 text-blue-700',
    completed: 'bg-slate-100 text-slate-600',
    'on-hold': 'bg-amber-50 text-amber-700',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative bg-slate-900 border-b border-slate-800 text-white">
        <div className="absolute inset-0">
          <img src="/images/research-collab.png" alt="Research Hub" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>
        <div className="relative z-10 page-container py-12 md:py-16">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Research Hub</h1>
              <p className="text-slate-300 text-lg">Collaborate on cutting-edge research with the IITRAM community</p>
            </div>
            {isAuthenticated && (
              <button className="btn bg-white text-iitram-800 hover:bg-slate-100 font-semibold shrink-0">
                <Plus size={16} /> Post Research
              </button>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-60 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search research projects..."
                className="input pl-10 h-11"
              />
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input h-11 w-40">
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-5 skeleton rounded w-3/4 mb-3" />
                <div className="h-4 skeleton rounded w-1/2 mb-2" />
                <div className="h-3 skeleton rounded mb-2" />
                <div className="h-3 skeleton rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="card p-16 text-center">
            <FlaskConical size={40} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No research projects found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((project: any, i: number) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-hover p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${statusColors[project.status] || 'bg-slate-100 text-slate-600'} capitalize`}>
                        {project.status.replace('-', ' ')}
                      </span>
                      <span className="badge badge-primary capitalize">{project.type}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-base leading-tight">{project.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{project.abstract}</p>
                
                {project.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.keywords.slice(0, 4).map((kw: string) => (
                      <span key={kw} className="text-2xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{kw}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <img
                      src={project.pi?.avatar || `https://ui-avatars.com/api/?name=${project.pi?.firstName}&background=1d2f88&color=fff`}
                      className="w-5 h-5 rounded-full"
                      alt=""
                    />
                    {project.pi?.firstName} {project.pi?.lastName}
                  </div>
                  {project.openPositions?.length > 0 && (
                    <span className="badge badge-success text-xs">{project.openPositions.length} open positions</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
