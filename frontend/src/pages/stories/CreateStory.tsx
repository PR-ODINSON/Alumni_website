import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Plus, Trash2, BookOpen, Quote, HelpCircle } from 'lucide-react';
import { successStoryApi } from '../../lib/api';
import toast from 'react-hot-toast';

const STORY_CATEGORIES = [
  { value: 'career', label: 'Career Achievement' },
  { value: 'entrepreneurship', label: 'Entrepreneurship & Startups' },
  { value: 'research', label: 'Research & Academia' },
  { value: 'social-impact', label: 'Social Impact & NGO' },
  { value: 'arts', label: 'Arts & Creative Fields' },
  { value: 'sports', label: 'Sports & Athletics' },
  { value: 'leadership', label: 'Leadership Roles' },
  { value: 'other', label: 'Other Achievements' },
];

export default function CreateStoryPage() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    category: 'career',
    coverImage: '',
    quote: '',
    content: '',
    tagsInput: '',
  });

  const [highlights, setHighlights] = useState<string[]>(['']);
  const [timeline, setTimeline] = useState<Array<{ year: string; milestone: string; description: string }>>([]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Highlights
  const addHighlight = () => setHighlights([...highlights, '']);
  const removeHighlight = (idx: number) => setHighlights(highlights.filter((_, i) => i !== idx));
  const handleHighlightChange = (idx: number, val: string) => {
    const updated = [...highlights];
    updated[idx] = val;
    setHighlights(updated);
  };

  // Timeline
  const addTimelineItem = () => setTimeline([...timeline, { year: '', milestone: '', description: '' }]);
  const removeTimelineItem = (idx: number) => setTimeline(timeline.filter((_, i) => i !== idx));
  const handleTimelineChange = (idx: number, field: string, val: string) => {
    const updated = [...timeline];
    updated[idx] = { ...updated[idx], [field]: val };
    setTimeline(updated);
  };

  const createMutation = useMutation({
    mutationFn: (payload: any) => successStoryApi.create(payload),
    onSuccess: () => {
      toast.success('Success story submitted successfully!');
      navigate('/stories');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit success story.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error('Title and Content body are required fields.');
      return;
    }

    const payload = {
      title: form.title,
      subtitle: form.subtitle || undefined,
      category: form.category,
      coverImage: form.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60',
      quote: form.quote || undefined,
      content: form.content,
      tags: form.tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      highlights: highlights.map((h) => h.trim()).filter((h) => h.length > 0),
      timeline: timeline
        .filter((t) => t.year && t.milestone)
        .map((t) => ({
          year: Number(t.year),
          milestone: t.milestone,
          description: t.description,
        })),
      isPublished: true, // Make immediately visible
      isFeatured: false,
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link to="/stories" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors font-sans">
          <ArrowLeft size={16} /> Back to Success Stories
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 bg-slate-900 text-white relative font-sans">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <h1 className="text-2xl font-bold font-display">Share Your Success Story</h1>
            <p className="text-slate-400 text-xs mt-1 font-semibold">Inspire the current batch and community by sharing your career milestones, startup paths, or research successes</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 font-sans text-xs text-slate-800">
            {/* 1. Basic Info */}
            <div>
              <h3 className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-4">1. Story Basics</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-650 mb-1.5">Story Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="e.g. From Campus Hackathons to Senior Lead at Google"
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-650 mb-1.5">Category <span className="text-red-500">*</span></label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="input text-xs h-10 px-2"
                  >
                    {STORY_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block font-bold text-slate-650 mb-1.5">Subtitle / Short Summary</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleFormChange}
                    placeholder="e.g. How persistence, mentorship, and building side projects helped me navigate the tech industry."
                    className="input text-xs"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Visuals & Quote */}
            <div>
              <h3 className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-4">2. Visuals & Core Quotes</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-650 mb-1.5">Cover Image URL (Optional)</label>
                  <input
                    type="url"
                    name="coverImage"
                    value={form.coverImage}
                    onChange={handleFormChange}
                    placeholder="https://images.unsplash.com/photo-xyz... or your photo URL"
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-650 mb-1.5">Featured Quote (Optional)</label>
                  <div className="relative">
                    <Quote size={14} className="absolute left-3 top-3.5 text-slate-300" />
                    <textarea
                      name="quote"
                      value={form.quote}
                      onChange={handleFormChange}
                      rows={2}
                      placeholder="e.g. The only way to do great work is to love what you do, and remember that campus is just the beginning."
                      className="input text-xs pl-9 p-3 h-16"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 3. The Story Content */}
            <div>
              <h3 className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-4">3. The Story Body</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-650 mb-1.5">Your Story <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    name="content"
                    value={form.content}
                    onChange={handleFormChange}
                    rows={8}
                    placeholder="Share your detailed journey. You can write about your background, college life, career decisions, challenges faced, learnings, and advice for the next generation of students..."
                    className="input text-xs p-3 h-48"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-650 mb-1.5">Tags / Focus Areas (Comma separated)</label>
                  <input
                    type="text"
                    name="tagsInput"
                    value={form.tagsInput}
                    onChange={handleFormChange}
                    placeholder="e.g. Google, Placement, CSE, Software, Motivation"
                    className="input text-xs"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 4. Highlights */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-brand-600 uppercase tracking-wider">4. Key Highlights</h3>
                <button
                  type="button"
                  onClick={addHighlight}
                  className="btn btn-secondary py-1.5 px-3 text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Highlight
                </button>
              </div>
              <div className="space-y-2">
                {highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => handleHighlightChange(idx, e.target.value)}
                      placeholder="e.g. Secured Gold Medal in final year project"
                      className="input text-xs flex-1"
                    />
                    {highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight(idx)}
                        className="text-red-500 hover:text-red-700 p-2 border border-slate-200 rounded-lg bg-slate-50 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 5. Timeline */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-brand-600 uppercase tracking-wider">5. Career Timeline / Milestones</h3>
                <button
                  type="button"
                  onClick={addTimelineItem}
                  className="btn btn-secondary py-1.5 px-3 text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Milestone
                </button>
              </div>

              {timeline.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic font-semibold">No timeline milestones added. You can skip this or add significant career steps.</p>
              ) : (
                <div className="space-y-4">
                  {timeline.map((item, idx) => (
                    <div key={idx} className="p-4 border border-slate-150 rounded-xl bg-slate-50 relative space-y-3">
                      <button
                        type="button"
                        onClick={() => removeTimelineItem(idx)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid md:grid-cols-4 gap-3">
                        <div>
                          <label className="block font-bold text-slate-500 mb-1">Year</label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 2024"
                            value={item.year}
                            onChange={(e) => handleTimelineChange(idx, 'year', e.target.value)}
                            className="input bg-white text-xs"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block font-bold text-slate-500 mb-1">Milestone Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Promoted to Senior Staff Architect"
                            value={item.milestone}
                            onChange={(e) => handleTimelineChange(idx, 'milestone', e.target.value)}
                            className="input bg-white text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">Short Description (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Lead a team of 8 developing new analytics dashboard features."
                          value={item.description}
                          onChange={(e) => handleTimelineChange(idx, 'description', e.target.value)}
                          className="input bg-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 font-sans">
              <Link to="/stories" className="btn btn-secondary py-2.5 px-5 text-xs font-bold rounded-lg cursor-pointer">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn btn-primary py-2.5 px-6 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-all"
              >
                {createMutation.isPending ? (
                  <><Loader2 size={14} className="animate-spin" /> Submitting...</>
                ) : (
                  <>Submit Story</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
