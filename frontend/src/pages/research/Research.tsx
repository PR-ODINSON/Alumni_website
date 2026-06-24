import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FlaskConical, Search, Plus } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate } from '../../lib/utils';

export default function ResearchPage() {
  const { isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['research', search, status],
    queryFn: () => api.get('/research', { params: { search: search || undefined, status: status || undefined, limit: 20 } }),
  });

  const projects = data?.data?.data || [];

  const statusColors: Record<string, string> = {
    open: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'in-progress': 'bg-slate-50 text-slate-700 border-slate-200',
    completed: 'bg-slate-50 text-slate-600 border-slate-200',
    'on-hold': 'bg-amber-50 text-amber-800 border-amber-200',
  };

  return (
    <div className="py-6 bg-transparent">
      {/* Solid White Header */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 lg:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-605 text-xs font-bold mb-3">
              <FlaskConical size={14} className="text-slate-500" />
              <span>Research Collaboration</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 mb-2 tracking-tight">Research Hub</h1>
            <p className="text-slate-500 text-sm max-w-2xl leading-relaxed font-medium">
              Collaborate on cutting-edge research and publications with the IITRAM academic community.
            </p>
          </div>
          {isAuthenticated && (
            <button className="btn btn-primary shadow-sm hover:-translate-y-0.5 shrink-0 self-start md:self-center">
              <Plus size={16} /> Post Research
            </button>
          )}
        </div>

        {/* Filters and search in solid style */}
        <div className="flex gap-3 flex-wrap mt-6 pt-5 border-t border-slate-100">
          <div className="flex-1 min-w-60 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search research projects..."
              className="input pl-10 h-10 bg-white"
            />
          </div>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            className="input h-10 w-40 bg-white"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 animate-pulse">
              <div className="h-5 skeleton rounded w-3/4 mb-3" />
              <div className="h-4 skeleton rounded w-1/2 mb-2" />
              <div className="h-3 skeleton rounded mb-2" />
              <div className="h-3 skeleton rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-16 text-center">
          <FlaskConical size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-bold font-display text-slate-700">No research projects found</h3>
          <p className="text-xs text-slate-400 mt-1">Check back later or post your research topic to start.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((project: any, i: number) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`badge border text-[10px] ${statusColors[project.status] || 'bg-slate-50 text-slate-650 border-slate-200'} capitalize font-bold`}>
                    {project.status.replace('-', ' ')}
                  </span>
                  <span className="badge badge-primary bg-slate-50 border-slate-200 text-slate-700 text-[10px] capitalize font-bold">{project.type}</span>
                </div>
                <h3 className="font-bold font-display text-slate-900 text-base leading-tight mb-2">{project.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4 font-medium">{project.abstract}</p>
                
                {project.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.keywords.slice(0, 4).map((kw: string) => (
                      <span key={kw} className="text-[9px] px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full border border-slate-150 font-semibold">{kw}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                  <img
                    src={project.pi?.avatar || `https://ui-avatars.com/api/?name=${project.pi?.firstName}&background=001f54&color=fff`}
                    className="w-5 h-5 rounded-full border border-slate-200"
                    alt=""
                  />
                  <span>{project.pi?.firstName} {project.pi?.lastName}</span>
                </div>
                {project.pi?.role && (
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100 uppercase tracking-wider">{project.pi.role}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
