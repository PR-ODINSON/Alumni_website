import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Camera, Globe, GraduationCap, ImagePlus, Plus, Save, Settings2, Tag, Trash2, UserRound, X } from 'lucide-react';
import { userApi, uploadApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  permanentAddress: z.string().max(400).optional(),
  department: z.string().optional(),
  degreeType: z.string().optional(),
  batch: z.string().optional(),
  graduationYear: z.string().optional(),
  currentYear: z.string().optional(),
  currentSemester: z.string().optional(),
  'location.city': z.string().optional(),
  'location.state': z.string().optional(),
  'location.country': z.string().optional(),
  'socialLinks.linkedin': z.string().url().optional().or(z.literal('')),
  'socialLinks.github': z.string().url().optional().or(z.literal('')),
  'socialLinks.twitter': z.string().url().optional().or(z.literal('')),
  'socialLinks.website': z.string().url().optional().or(z.literal('')),
  'socialLinks.instagram': z.string().url().optional().or(z.literal('')),
  'notificationPreferences.email': z.boolean().optional(),
  'notificationPreferences.push': z.boolean().optional(),
  'notificationPreferences.connectionRequests': z.boolean().optional(),
  'notificationPreferences.messages': z.boolean().optional(),
  'notificationPreferences.jobAlerts': z.boolean().optional(),
  'notificationPreferences.eventReminders': z.boolean().optional(),
  'notificationPreferences.mentorshipUpdates': z.boolean().optional(),
});

const TABS = ['Basic Info', 'Career', 'Education', 'Settings'] as const;
type Tab = typeof TABS[number];

const TAB_DETAILS = {
  'Basic Info': { icon: UserRound, description: 'Name, contact details, location and social links.' },
  Career: { icon: Briefcase, description: 'Professional headline, skills and work history.' },
  Education: { icon: GraduationCap, description: 'IITRAM academic record and other education.' },
  Settings: { icon: Settings2, description: 'Choose which notifications you receive.' },
} as const;

type CareerEntry = {
  _id?: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
};

type EducationEntry = {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade: string;
};

export default function EditProfile() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('Basic Info');
  const [uploading, setUploading] = useState(false);

  // Career state
  const [headline, setHeadline] = useState(user?.headline || '');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [careerEntries, setCareerEntries] = useState<CareerEntry[]>(
    (user?.career || []).map((c: any) => ({
      _id: c._id,
      company: c.company || '',
      title: c.title || '',
      location: c.location || '',
      startDate: c.startDate ? c.startDate.substring(0, 7) : '',
      endDate: c.endDate ? c.endDate.substring(0, 7) : '',
      isCurrent: c.isCurrent || false,
      description: c.description || '',
    }))
  );

  // Education state
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>(
    (user?.education || []).map((e: any) => ({
      _id: e._id,
      institution: e.institution || '',
      degree: e.degree || '',
      field: e.field || '',
      startYear: String(e.startYear || ''),
      endYear: String(e.endYear || ''),
      grade: e.grade || '',
    }))
  );

  const addCareerEntry = () => setCareerEntries(p => [...p, { company: '', title: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' }]);
  const removeCareerEntry = (i: number) => setCareerEntries(p => p.filter((_, idx) => idx !== i));
  const updateCareerEntry = (i: number, field: keyof CareerEntry, value: any) =>
    setCareerEntries(p => p.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  const addEducationEntry = () => setEducationEntries(p => [...p, { institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' }]);
  const removeEducationEntry = (i: number) => setEducationEntries(p => p.filter((_, idx) => idx !== i));
  const updateEducationEntry = (i: number, field: keyof EducationEntry, value: any) =>
    setEducationEntries(p => p.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills(p => [...p, s]);
      setSkillInput('');
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      permanentAddress: user?.permanentAddress || '',
      department: user?.department || '',
      degreeType: user?.degreeType || 'B.Tech',
      batch: user?.batch ? String(user.batch) : '',
      graduationYear: user?.graduationYear ? String(user.graduationYear) : '',
      currentYear: user?.currentYear ? String(user.currentYear) : '',
      currentSemester: user?.currentSemester ? String(user.currentSemester) : '',
      'location.city': user?.location?.city || '',
      'location.state': user?.location?.state || '',
      'location.country': user?.location?.country || '',
      'socialLinks.linkedin': user?.socialLinks?.linkedin || '',
      'socialLinks.github': user?.socialLinks?.github || '',
      'socialLinks.twitter': user?.socialLinks?.twitter || '',
      'socialLinks.website': user?.socialLinks?.website || '',
      'socialLinks.instagram': user?.socialLinks?.instagram || '',
      'notificationPreferences.email': user?.notificationPreferences?.email ?? true,
      'notificationPreferences.push': user?.notificationPreferences?.push ?? true,
      'notificationPreferences.connectionRequests': user?.notificationPreferences?.connectionRequests ?? true,
      'notificationPreferences.messages': user?.notificationPreferences?.messages ?? true,
      'notificationPreferences.jobAlerts': user?.notificationPreferences?.jobAlerts ?? true,
      'notificationPreferences.eventReminders': user?.notificationPreferences?.eventReminders ?? true,
      'notificationPreferences.mentorshipUpdates': user?.notificationPreferences?.mentorshipUpdates ?? true,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => userApi.updateProfile(data),
    onSuccess: (res: any) => {
      const updatedUser = res.data.data;
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Sync career state with saved data
      if (updatedUser.career) {
        setCareerEntries(updatedUser.career.map((c: any) => ({
          _id: c._id,
          company: c.company || '',
          title: c.title || '',
          location: c.location || '',
          startDate: c.startDate ? c.startDate.substring(0, 7) : '',
          endDate: c.endDate ? c.endDate.substring(0, 7) : '',
          isCurrent: c.isCurrent || false,
          description: c.description || '',
        })));
      }
      if (updatedUser.education) {
        setEducationEntries(updatedUser.education.map((e: any) => ({
          _id: e._id,
          institution: e.institution || '',
          degree: e.degree || '',
          field: e.field || '',
          startYear: String(e.startYear || ''),
          endYear: String(e.endYear || ''),
          grade: e.grade || '',
        })));
      }
      toast.success('Profile updated successfully');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const onSubmit = (data: any) => {
    const nested: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        if (!nested[parent]) nested[parent] = {};
        nested[parent][child] = value;
      } else {
        nested[key] = value;
      }
    });
    ['batch', 'graduationYear', 'currentYear', 'currentSemester'].forEach(field => {
      if (nested[field] === '') delete nested[field];
      else if (nested[field] !== undefined) nested[field] = Number(nested[field]);
    });
    // Include career fields
    nested.headline = headline;
    nested.skills = skills;
    nested.career = careerEntries.map(c => ({
      ...c,
      startDate: c.startDate ? new Date(c.startDate + '-01') : undefined,
      endDate: c.isCurrent ? undefined : (c.endDate ? new Date(c.endDate + '-01') : undefined),
    }));
    nested.education = educationEntries.map(e => ({
      ...e,
      startYear: e.startYear ? Number(e.startYear) : undefined,
      endYear: e.endYear ? Number(e.endYear) : undefined,
    }));
    updateMutation.mutate(nested);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'coverImage' | 'signatureUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadApi.image(formData);
      const url = (res as any).data?.data?.url;
      await userApi.updateProfile({ [field]: url });
      if (user) setUser({ ...user, [field]: url });
      toast.success(field === 'avatar' ? 'Profile photo updated' : field === 'coverImage' ? 'Cover photo updated' : 'Signature uploaded');
    } catch {
      toast.error('Photo upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="page-container max-w-6xl py-7 sm:py-10">
        <header className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/profile" className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-iitram-700">
              <ArrowLeft size={14} /> Back to profile
            </Link>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-iitram-700">Profile settings</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Edit your profile</h1>
            <p className="mt-1.5 text-sm text-slate-500">Keep your IITRAM profile and academic details up to date.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {user?.role || 'Member'} account
          </span>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <aside className="space-y-4 lg:sticky lg:top-6">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <Avatar
                    src={user?.avatar}
                    initials={`${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`}
                    size="xl"
                  />
                  <label title="Change profile photo" className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-iitram-700 text-white shadow-sm transition-colors hover:bg-iitram-800">
                    <Camera size={14} />
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'avatar')} className="sr-only" />
                  </label>
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-slate-900">{user?.firstName} {user?.lastName}</h2>
                  <p className="mt-0.5 text-xs capitalize text-slate-500">{user?.role} · IITRAM</p>
                  {uploading && <p className="mt-1 text-[11px] font-medium text-iitram-700">Uploading image…</p>}
                </div>
              </div>

              <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 transition-colors hover:border-slate-300 hover:bg-slate-50">
                {user?.coverImage
                  ? <img src={user.coverImage} alt="Current cover" className="h-8 w-12 rounded object-cover" />
                  : <ImagePlus size={17} className="text-slate-500" />}
                <span className="text-xs font-semibold text-slate-700">{user?.coverImage ? 'Change cover photo' : 'Add cover photo'}</span>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'coverImage')} className="sr-only" />
              </label>

              {user?.role === 'student' && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Signature</p>
                  <div className="mt-2 flex items-center gap-3">
                    {user.signatureUrl
                      ? <img src={user.signatureUrl} alt="Uploaded signature" className="h-10 w-24 rounded border border-slate-200 bg-white object-contain" />
                      : <span className="flex h-10 w-24 items-center justify-center rounded border border-dashed border-slate-300 text-[10px] text-slate-400">Not uploaded</span>}
                    <label className="cursor-pointer text-xs font-semibold text-iitram-700 hover:text-iitram-900">
                      {user.signatureUrl ? 'Replace' : 'Upload'}
                      <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'signatureUrl')} className="sr-only" />
                    </label>
                  </div>
                </div>
              )}
            </section>

            <nav aria-label="Profile sections" className="grid grid-cols-2 gap-1.5 rounded-xl border border-slate-200 bg-white p-2 shadow-sm lg:block lg:space-y-1">
              {TABS.map(tab => {
                const { icon: TabIcon, description } = TAB_DETAILS[tab];
                const selected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    aria-current={selected ? 'page' : undefined}
                    onClick={() => setActiveTab(tab)}
                    className={`flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors lg:items-start lg:gap-3 lg:px-3 lg:py-3 ${selected ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <TabIcon size={17} className={`shrink-0 ${selected ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{tab}</span>
                      <span className={`mt-0.5 hidden text-[11px] leading-4 lg:block ${selected ? 'text-slate-300' : 'text-slate-400'}`}>{description}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0">
            <form id="profile-edit-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-iitram-700">Profile details</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{activeTab}</h2>
                  <p className="mt-1 text-sm text-slate-500">{TAB_DETAILS[activeTab].description}</p>
                </div>
                <span className="hidden text-xs font-medium text-slate-400 sm:block">Changes save to your profile</span>
              </div>
          {/* Basic Info Tab */}
          {activeTab === 'Basic Info' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <input {...register('firstName')} className="input" />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <input {...register('lastName')} className="input" />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message as string}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                <textarea {...register('bio')} rows={4} className="input resize-none" placeholder="Tell others about yourself..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input {...register('phone')} className="input" placeholder="+91 9876543210" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Permanent Address</label>
                <textarea {...register('permanentAddress')} rows={3} className="input resize-y" placeholder="Street, city, state, postal code" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input {...register('location.city')} className="input" placeholder="Ahmedabad" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                  <input {...register('location.state')} className="input" placeholder="Gujarat" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                  <input {...register('location.country')} className="input" placeholder="India" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-800">Social links</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(['linkedin', 'github', 'twitter', 'website', 'instagram'] as const).map(platform => (
                    <div key={platform} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <Globe size={14} className="text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <input
                          {...register(`socialLinks.${platform}` as any)}
                          className="input text-sm"
                          placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </motion.div>
          )}

          {/* Career Tab */}
          {activeTab === 'Career' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Headline */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase size={16} className="text-iitram-600" /> Professional Headline
                </h3>
                <input
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  maxLength={120}
                  className="input"
                  placeholder="e.g. Senior Software Engineer at Google · IITRAM '22"
                />
                <p className="text-xs text-slate-400 mt-1">{headline.length}/120 characters</p>
              </div>

              {/* Skills */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Tag size={16} className="text-iitram-600" /> Skills
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map(skill => (
                    <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-iitram-50 text-iitram-700 border border-iitram-200 rounded-full text-xs font-medium">
                      {skill}
                      <button type="button" onClick={() => setSkills(p => p.filter(s => s !== skill))} className="text-iitram-400 hover:text-red-500 transition-colors cursor-pointer">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    className="input flex-1 text-sm"
                    placeholder="Type a skill and press Enter"
                  />
                  <button type="button" onClick={addSkill} className="btn btn-outline btn-sm shrink-0">
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Work Experience */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Briefcase size={16} className="text-iitram-600" /> Work Experience
                  </h3>
                  <button type="button" onClick={addCareerEntry} className="btn btn-outline btn-sm flex items-center gap-1.5 cursor-pointer">
                    <Plus size={14} /> Add Position
                  </button>
                </div>

                {careerEntries.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                    No work experience added yet. Click "Add Position" to start.
                  </p>
                )}

                <div className="space-y-5">
                  {careerEntries.map((entry, i) => (
                    <div key={i} className="relative space-y-3 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                      <button
                        type="button"
                        onClick={() => removeCareerEntry(i)}
                        className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Job Title *</label>
                          <input value={entry.title} onChange={e => updateCareerEntry(i, 'title', e.target.value)} className="input text-sm" placeholder="Software Engineer" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Company *</label>
                          <input value={entry.company} onChange={e => updateCareerEntry(i, 'company', e.target.value)} className="input text-sm" placeholder="Google, TCS, etc." />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
                        <input value={entry.location} onChange={e => updateCareerEntry(i, 'location', e.target.value)} className="input text-sm" placeholder="Ahmedabad, India" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                          <input type="month" value={entry.startDate} onChange={e => updateCareerEntry(i, 'startDate', e.target.value)} className="input text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                          <input type="month" value={entry.isCurrent ? '' : entry.endDate} disabled={entry.isCurrent} onChange={e => updateCareerEntry(i, 'endDate', e.target.value)} className="input text-sm disabled:opacity-50" />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                        <input type="checkbox" checked={entry.isCurrent} onChange={e => updateCareerEntry(i, 'isCurrent', e.target.checked)} className="rounded" />
                        I currently work here
                      </label>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                        <textarea value={entry.description} onChange={e => updateCareerEntry(i, 'description', e.target.value)} rows={2} maxLength={500} className="input resize-none text-sm" placeholder="Briefly describe your role and impact..." />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Education Tab */}
          {activeTab === 'Education' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* IITRAM academic details */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap size={16} className="text-iitram-600" />
                  <h3 className="font-semibold text-slate-900">IITRAM — Academic Details</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-iitram-900">Institute of Infrastructure, Technology, Research and Management</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Enrollment Number</label>
                      <input value={user?.enrollmentNumber || ''} className="input bg-slate-100" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Account Email</label>
                      <input value={user?.email || ''} className="input bg-slate-100" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                      <input {...register('department')} className="input" placeholder="Computer Engineering" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Degree</label>
                      <select {...register('degreeType')} className="input">
                        {['B.Tech', 'M.Tech', 'MBA', 'PhD', 'Diploma', 'Other'].map(degree => <option key={degree} value={degree}>{degree}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Batch / Start Year</label>
                      <input {...register('batch')} type="number" min={1980} max={2035} className="input" />
                    </div>
                    {user?.role === 'alumni' && <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Passing Year</label>
                      <input {...register('graduationYear')} type="number" min={1980} max={2035} className="input" />
                    </div>}
                    {user?.role === 'student' && <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Expected Passing Year (optional)</label>
                        <input {...register('graduationYear')} type="number" min={1980} max={2100} className="input" placeholder="Leave blank if not known" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Year</label>
                        <input {...register('currentYear')} type="number" min={1} max={6} className="input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Semester</label>
                        <input {...register('currentSemester')} type="number" min={1} max={12} className="input" />
                      </div>
                    </>}
                  </div>
                </div>
              </div>

              {/* Additional education entries */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <GraduationCap size={16} className="text-iitram-600" /> Additional Education
                  </h3>
                  <button type="button" onClick={addEducationEntry} className="btn btn-outline btn-sm flex items-center gap-1.5 cursor-pointer">
                    <Plus size={14} /> Add Education
                  </button>
                </div>

                {educationEntries.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                    No additional education entries. Add a certification, course, or other degree.
                  </p>
                )}

                <div className="space-y-5">
                  {educationEntries.map((entry, i) => (
                    <div key={i} className="relative space-y-3 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                      <button
                        type="button"
                        onClick={() => removeEducationEntry(i)}
                        className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Institution *</label>
                        <input value={entry.institution} onChange={e => updateEducationEntry(i, 'institution', e.target.value)} className="input text-sm" placeholder="University / College name" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Degree</label>
                          <input value={entry.degree} onChange={e => updateEducationEntry(i, 'degree', e.target.value)} className="input text-sm" placeholder="B.Tech, M.Tech, MBA..." />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Field of Study</label>
                          <input value={entry.field} onChange={e => updateEducationEntry(i, 'field', e.target.value)} className="input text-sm" placeholder="Computer Science..." />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Start Year</label>
                          <input type="number" value={entry.startYear} min={1980} max={2030} onChange={e => updateEducationEntry(i, 'startYear', e.target.value)} className="input text-sm" placeholder="2018" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">End Year</label>
                          <input type="number" value={entry.endYear} min={1980} max={2030} onChange={e => updateEducationEntry(i, 'endYear', e.target.value)} className="input text-sm" placeholder="2022" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Grade / CGPA</label>
                          <input value={entry.grade} onChange={e => updateEducationEntry(i, 'grade', e.target.value)} className="input text-sm" placeholder="8.5 CGPA" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'Settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Notification Preferences */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Globe size={16} className="text-slate-500" /> Notification Preferences
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Email Notifications', desc: 'Receive periodic emails and digests', key: 'notificationPreferences.email' },
                    { label: 'Push Notifications', desc: 'Receive live push alerts in the browser', key: 'notificationPreferences.push' },
                    { label: 'Connection Requests', desc: 'Notify when someone requests to connect', key: 'notificationPreferences.connectionRequests' },
                    { label: 'Messages', desc: 'Notify on new chat messages', key: 'notificationPreferences.messages' },
                    { label: 'Job Alerts', desc: 'Notify when new jobs matching your profile are posted', key: 'notificationPreferences.jobAlerts' },
                    { label: 'Event Reminders', desc: 'Notify about upcoming registered events', key: 'notificationPreferences.eventReminders' },
                    { label: 'Mentorship Updates', desc: 'Notify on mentorship application state changes', key: 'notificationPreferences.mentorshipUpdates' },
                  ].map(pref => (
                    <div key={pref.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{pref.label}</p>
                        <p className="text-xs text-slate-400">{pref.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" {...register(pref.key as any)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-200 peer-checked:bg-iitram-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Save button */}
          <div className="sticky bottom-3 z-20 mt-6 flex justify-end rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn btn-primary flex items-center gap-2 px-5 shadow-lg shadow-slate-900/10"
            >
              <Save size={16} />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
