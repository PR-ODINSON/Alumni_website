import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Building, MapPin, Briefcase, DollarSign, Calendar, Zap, Loader2 } from 'lucide-react';
import { jobApi } from '../../lib/api';
import { INDUSTRIES } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function PostJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    company: '',
    companyLogo: '',
    location: '',
    locationType: 'onsite' as 'onsite' | 'remote' | 'hybrid',
    jobType: 'full-time',
    category: '',
    industry: 'Technology',
    description: '',
    requirementsInput: '',
    responsibilitiesInput: '',
    skillsInput: '',
    experienceMin: 0,
    experienceMax: 5,
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'INR',
    salaryPeriod: 'annual',
    isSalaryHidden: false,
    applicationDeadline: '',
    isReferralAvailable: false,
  });

  const postMutation = useMutation({
    mutationFn: (data: any) => jobApi.createJob(data),
    onSuccess: () => {
      toast.success('Job posted successfully!');
      navigate('/jobs');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to post job. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.description) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      title: form.title,
      company: form.company,
      companyLogo: form.companyLogo || undefined,
      location: form.location,
      locationType: form.locationType,
      jobType: form.jobType,
      category: form.category || undefined,
      industry: form.industry,
      description: form.description,
      requirements: form.requirementsInput
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0),
      responsibilities: form.responsibilitiesInput
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0),
      skills: form.skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      experience: {
        min: Number(form.experienceMin),
        max: Number(form.experienceMax),
        unit: 'years',
      },
      salary: {
        min: form.salaryMin ? Number(form.salaryMin) : undefined,
        max: form.salaryMax ? Number(form.salaryMax) : undefined,
        currency: form.salaryCurrency,
        period: form.salaryPeriod,
        isHidden: form.isSalaryHidden,
      },
      applicationDeadline: form.applicationDeadline || undefined,
      isReferralAvailable: form.isReferralAvailable,
    };

    postMutation.mutate(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Jobs
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0169FC]/15 rounded-full blur-3xl pointer-events-none" />
            <h1 className="text-2xl font-bold font-display">Post a New Job</h1>
            <p className="text-slate-400 text-xs mt-1 font-semibold">Share an opportunity with the IITRAM alumni and student network</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 font-sans text-slate-800">
            
            {/* Section: Basic details */}
            <div>
              <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">1. Basic Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Job Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer, Project Intern"
                    className="input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Company Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="e.g. Google, L&T, Startup Co"
                    className="input text-xs"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Company Logo URL (Optional)</label>
                  <input
                    type="url"
                    name="companyLogo"
                    value={form.companyLogo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="input text-xs"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Section: Location & Type */}
            <div>
              <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">2. Location & Job Type</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Job Type</label>
                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className="input text-xs h-10 px-2"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Location Type</label>
                  <select
                    name="locationType"
                    value={form.locationType}
                    onChange={handleChange}
                    className="input text-xs h-10 px-2"
                  >
                    <option value="onsite">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Industry</label>
                  <select
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className="input text-xs h-10 px-2"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Location <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Ahmedabad, Gujarat, India or Remote"
                    className="input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Category (Optional)</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Software, Design, Core Engineering"
                    className="input text-xs"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Section: Job Description & Details */}
            <div>
              <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">3. Description & Requirements</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Job Description <span className="text-red-500">*</span></label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Provide a detailed overview of the role, responsibilities, and team..."
                    className="input text-xs p-3 h-32"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Requirements (One per line)</label>
                  <textarea
                    name="requirementsInput"
                    value={form.requirementsInput}
                    onChange={handleChange}
                    rows={4}
                    placeholder="e.g. 2+ years of React experience&#10;B.Tech in CSE or related field&#10;Strong communication skills"
                    className="input text-xs p-3 h-24"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Responsibilities (One per line)</label>
                  <textarea
                    name="responsibilitiesInput"
                    value={form.responsibilitiesInput}
                    onChange={handleChange}
                    rows={4}
                    placeholder="e.g. Build and maintain scalable UI components&#10;Collaborate with backend engineers&#10;Optimize app performance"
                    className="input text-xs p-3 h-24"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Skills Required (Comma separated)</label>
                  <input
                    type="text"
                    name="skillsInput"
                    value={form.skillsInput}
                    onChange={handleChange}
                    placeholder="e.g. React, Node.js, TypeScript, Docker"
                    className="input text-xs"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Section: Experience & Compensation */}
            <div>
              <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">4. Experience & Compensation</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Min Experience (Yrs)</label>
                  <input
                    type="number"
                    name="experienceMin"
                    value={form.experienceMin}
                    onChange={handleChange}
                    min={0}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Max Experience (Yrs)</label>
                  <input
                    type="number"
                    name="experienceMax"
                    value={form.experienceMax}
                    onChange={handleChange}
                    min={0}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Min Salary</label>
                  <input
                    type="number"
                    name="salaryMin"
                    value={form.salaryMin}
                    onChange={handleChange}
                    placeholder="e.g. 500000"
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Max Salary</label>
                  <input
                    type="number"
                    name="salaryMax"
                    value={form.salaryMax}
                    onChange={handleChange}
                    placeholder="e.g. 800000"
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Currency</label>
                  <select
                    name="salaryCurrency"
                    value={form.salaryCurrency}
                    onChange={handleChange}
                    className="input text-xs h-10 px-2"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Period</label>
                  <select
                    name="salaryPeriod"
                    value={form.salaryPeriod}
                    onChange={handleChange}
                    className="input text-xs h-10 px-2"
                  >
                    <option value="annual">Annual (p.a.)</option>
                    <option value="monthly">Monthly</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex items-center h-full pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                    <input
                      type="checkbox"
                      name="isSalaryHidden"
                      checked={form.isSalaryHidden}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    Hide compensation info from candidates
                  </label>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Section: Deadlines & Referrals */}
            <div>
              <h3 className="text-xs font-bold text-[#0169FC] uppercase tracking-wider mb-4">5. Referrals & Deadlines</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Application Deadline (Optional)</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={form.applicationDeadline}
                    onChange={handleChange}
                    className="input text-xs"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 mb-2">
                    <input
                      type="checkbox"
                      name="isReferralAvailable"
                      checked={form.isReferralAvailable}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <Zap size={14} className="text-amber-500 inline fill-amber-500" /> I can provide a referral for this role
                  </label>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed ml-6">
                    Checking this lets candidates know you can submit their profile inside your company.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
              <Link to="/jobs" className="btn btn-secondary py-2.5 px-5 text-xs font-bold rounded-lg cursor-pointer">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={postMutation.isPending}
                className="btn btn-primary py-2.5 px-6 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-all"
              >
                {postMutation.isPending ? (
                  <><Loader2 size={14} className="animate-spin" /> Posting...</>
                ) : (
                  <>Post Job</>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
