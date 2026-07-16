import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Award, User, Send, CheckCircle2 } from 'lucide-react';
import api from '../../../lib/api';
import { useAuthStore } from '../../../stores/authStore';
import toast from 'react-hot-toast';

interface ResearchProjectDetailModalProps {
  projectId: string;
  onClose: () => void;
}

export default function ResearchProjectDetailModal({ projectId, onClose }: ResearchProjectDetailModalProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Fetch full research details
  const { data: detailData, isLoading } = useQuery({
    queryKey: ['researchDetail', projectId],
    queryFn: () => api.get(`/research/${projectId}`).then((res) => res.data.data),
  });

  const applyMutation = useMutation({
    mutationFn: (payload: { message: string }) => api.post(`/research/${projectId}/apply`, payload),
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['researchDetail', projectId] });
      setIsApplying(false);
      setMessage('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit application.');
    },
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-8 flex flex-col items-center">
          <Loader2 className="animate-spin text-brand-600 mb-3" size={24} />
          <span className="text-xs font-bold text-slate-500">Loading project details...</span>
        </div>
      </div>
    );
  }

  const project = detailData;
  if (!project) return null;

  const isPI = user?._id === project.pi?._id;
  const alreadyApplied = project.applications?.some(
    (app: any) => app.user?.toString() === user?._id || app.user?._id === user?._id
  );

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a cover message.');
      return;
    }
    applyMutation.mutate({ message });
  };

  const statusColors: Record<string, string> = {
    open: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'in-progress': 'bg-slate-50 text-slate-700 border-slate-200',
    completed: 'bg-slate-50 text-slate-600 border-slate-200',
    'on-hold': 'bg-amber-50 text-amber-800 border-amber-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 shadow-xl rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`badge border text-[10px] ${statusColors[project.status] || 'bg-slate-50 text-slate-650 border-slate-200'} capitalize font-bold`}>
                {project.status.replace('-', ' ')}
              </span>
              <span className="badge badge-primary bg-slate-50 border-slate-200 text-slate-700 text-[10px] capitalize font-bold">{project.type}</span>
            </div>
            <h2 className="text-base font-bold font-display text-slate-900 leading-tight">{project.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-800 font-sans">
          
          {/* Abstract */}
          <div>
            <h3 className="font-bold text-slate-700 uppercase tracking-wide mb-2">Abstract</h3>
            <p className="text-slate-500 leading-relaxed font-medium bg-slate-50 p-4 border border-slate-150 rounded-2xl">{project.abstract}</p>
          </div>

          {/* Detailed Description */}
          {project.description && (
            <div>
              <h3 className="font-bold text-slate-700 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-slate-500 leading-relaxed font-medium whitespace-pre-wrap">{project.description}</p>
            </div>
          )}

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-b border-slate-100">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domain</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{project.domain}</span>
            </div>
            {project.subDomain && (
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sub-Domain</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{project.subDomain}</span>
              </div>
            )}
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Institution</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{project.institution || 'IITRAM'}</span>
            </div>
          </div>

          {/* Team / Investigators */}
          <div>
            <h3 className="font-bold text-slate-700 uppercase tracking-wide mb-3">Research Team</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-150">
                <img
                  src={project.pi?.avatar || `https://ui-avatars.com/api/?name=${project.pi?.firstName}&background=001f54&color=fff`}
                  className="w-7 h-7 rounded-full border border-slate-200"
                  alt=""
                />
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">{project.pi?.firstName} {project.pi?.lastName}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PI • {project.pi?.role}</span>
                </div>
              </div>

              {project.coInvestigators?.map((co: any) => (
                <div key={co._id} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-150">
                  <img
                    src={co.avatar || `https://ui-avatars.com/api/?name=${co.firstName}&background=001f54&color=fff`}
                    className="w-7 h-7 rounded-full border border-slate-200"
                    alt=""
                  />
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">{co.firstName} {co.lastName}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Co-Investigator</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          {project.openPositions && project.openPositions.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-700 uppercase tracking-wide mb-3">Open Positions</h3>
              <div className="space-y-3">
                {project.openPositions.map((pos: any, idx: number) => (
                  <div key={idx} className="p-3.5 border border-slate-150 rounded-xl bg-slate-50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-xs">{pos.role}</span>
                      <span className="badge badge-primary bg-brand-50 border-brand-200 text-brand-700 font-bold text-[10px]">{pos.count} Openings</span>
                    </div>
                    {pos.description && <p className="text-slate-500 font-medium">{pos.description}</p>}
                    {pos.requirements && pos.requirements.length > 0 && (
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Requirements:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-500 font-medium">
                          {pos.requirements.map((req: string, rIdx: number) => (
                            <li key={rIdx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collaborator / Application Workflows */}
          {user && (
            <div className="pt-4 border-t border-slate-150">
              {isPI ? (
                /* PI View: Show applicants */
                <div>
                  <h3 className="font-bold text-slate-700 uppercase tracking-wide mb-3">Applications Received</h3>
                  {!project.applications || project.applications.length === 0 ? (
                    <p className="text-slate-400 italic font-semibold">No applications received yet for this project.</p>
                  ) : (
                    <div className="space-y-3">
                      {project.applications.map((app: any, idx: number) => (
                        <div key={idx} className="p-3 border border-slate-150 rounded-xl bg-slate-50 space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <img
                                src={app.user?.avatar || `https://ui-avatars.com/api/?name=${app.user?.firstName}&background=001f54&color=fff`}
                                className="w-6 h-6 rounded-full"
                                alt=""
                              />
                              <span className="font-bold text-slate-900">{app.user?.firstName} {app.user?.lastName} ({app.user?.role})</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                              {app.status}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed pl-8 font-medium italic">"{app.message}"</p>
                          <span className="block text-[9px] text-slate-400 text-right font-semibold">Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Non-PI View: Show apply form or application status */
                <div>
                  {alreadyApplied ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-800 font-bold">
                      <CheckCircle2 size={16} />
                      <span>You have already applied to collaborate on this research project!</span>
                    </div>
                  ) : isApplying ? (
                    <form onSubmit={handleSubmitApplication} className="space-y-3 bg-slate-50 p-4 border border-slate-150 rounded-xl">
                      <h4 className="font-bold text-slate-700">Apply for Collaboration</h4>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">Cover Message</label>
                        <textarea
                          required
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Briefly state your qualifications, research interest, and how you can contribute..."
                          className="input bg-white p-3 h-20"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsApplying(false)}
                          className="btn btn-secondary py-1.5 px-3 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={applyMutation.isPending}
                          className="btn btn-primary py-1.5 px-4 flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          {applyMutation.isPending ? (
                            <><Loader2 size={12} className="animate-spin" /> Submitting...</>
                          ) : (
                            <><Send size={12} /> Submit Application</>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsApplying(true)}
                      className="btn btn-primary w-full py-2.5 font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <User size={14} /> Apply for Collaboration
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
