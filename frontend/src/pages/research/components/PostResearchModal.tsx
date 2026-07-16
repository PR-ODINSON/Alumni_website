import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

interface PostResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostResearchModal({ isOpen, onClose }: PostResearchModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    abstract: '',
    description: '',
    domain: '',
    subDomain: '',
    type: 'project',
    status: 'open',
    keywordsInput: '',
  });

  const [openPositions, setOpenPositions] = useState<Array<{ role: string; description: string; requirements: string; count: number }>>([]);

  const addPosition = () => {
    setOpenPositions([...openPositions, { role: '', description: '', requirements: '', count: 1 }]);
  };

  const removePosition = (index: number) => {
    setOpenPositions(openPositions.filter((_, i) => i !== index));
  };

  const handlePositionChange = (index: number, field: string, value: any) => {
    const updated = [...openPositions];
    updated[index] = { ...updated[index], [field]: value };
    setOpenPositions(updated);
  };

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/research', payload),
    onSuccess: () => {
      toast.success('Research project posted successfully!');
      queryClient.invalidateQueries({ queryKey: ['research'] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to post research project.');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.abstract || !form.domain) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      ...form,
      keywords: form.keywordsInput
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
      openPositions: openPositions.map((pos) => ({
        role: pos.role,
        description: pos.description,
        count: Number(pos.count),
        requirements: pos.requirements
          .split('\n')
          .map((r) => r.trim())
          .filter((r) => r.length > 0),
      })),
      isPublic: true,
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 shadow-xl rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-900">Post a Research Collaboration</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Invite others to collaborate on academic or startup research projects</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-800">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-600 mb-1">Project Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Multimodal DWI MRI Denoising using Deep Learning"
                className="input"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Domain / Field <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                placeholder="e.g. Artificial Intelligence, Mechanical Design"
                className="input"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Sub-Domain (Optional)</label>
              <input
                type="text"
                value={form.subDomain}
                onChange={(e) => setForm({ ...form, subDomain: e.target.value })}
                placeholder="e.g. Medical Imaging"
                className="input"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Research Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input h-10 px-2"
              >
                <option value="thesis">Thesis</option>
                <option value="paper">Research Paper</option>
                <option value="project">Project Collaboration</option>
                <option value="startup-research">Startup Research</option>
                <option value="collaboration">General Collaboration</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input h-10 px-2"
              >
                <option value="open">Open (Seeking Collaborators)</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Abstract <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={3}
              value={form.abstract}
              onChange={(e) => setForm({ ...form, abstract: e.target.value })}
              placeholder="Provide a concise summary of the research goal, methodology, and expected outcomes..."
              className="input p-3 h-20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Detailed Description (Optional)</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="More details on the stack, references, resources, lab facilities, timeline..."
              className="input p-3 h-24"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Keywords (Comma separated)</label>
            <input
              type="text"
              value={form.keywordsInput}
              onChange={(e) => setForm({ ...form, keywordsInput: e.target.value })}
              placeholder="e.g. Deep Learning, MRI, Denoising, Python"
              className="input"
            />
          </div>

          {/* Open Positions */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-700 uppercase tracking-wide">Open Positions</h3>
              <button
                type="button"
                onClick={addPosition}
                className="btn btn-secondary py-1.5 px-3 text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} /> Add Position
              </button>
            </div>

            {openPositions.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic font-semibold">No open positions defined. Collaborators can apply generally.</p>
            ) : (
              <div className="space-y-4">
                {openPositions.map((pos, idx) => (
                  <div key={idx} className="p-4 border border-slate-150 rounded-xl bg-slate-50 relative space-y-3">
                    <button
                      type="button"
                      onClick={() => removePosition(idx)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <label className="block font-bold text-slate-500 mb-1">Position Role</label>
                        <input
                          type="text"
                          required
                          value={pos.role}
                          onChange={(e) => handlePositionChange(idx, 'role', e.target.value)}
                          placeholder="e.g. ML Researcher, Hardware Engineer"
                          className="input bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">Count</label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={pos.count}
                          onChange={(e) => handlePositionChange(idx, 'count', e.target.value)}
                          className="input bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Role Description</label>
                      <input
                        type="text"
                        value={pos.description}
                        onChange={(e) => handlePositionChange(idx, 'description', e.target.value)}
                        placeholder="e.g. Tasked with developing preprocessing pipelines..."
                        className="input bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Requirements (One per line)</label>
                      <textarea
                        rows={2}
                        value={pos.requirements}
                        onChange={(e) => handlePositionChange(idx, 'requirements', e.target.value)}
                        placeholder="e.g. Experience with PyTorch&#10;Completed course in Digital Image Processing"
                        className="input p-2.5 h-16 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary py-2 px-4 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn btn-primary py-2 px-5 flex items-center gap-2 cursor-pointer shadow"
            >
              {createMutation.isPending ? (
                <><Loader2 size={12} className="animate-spin" /> Posting...</>
              ) : (
                'Post Collaboration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
