import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Briefcase, BookOpen, Link2,
  GitBranch, ArrowRight, ArrowLeft, Check, Loader2, Upload, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi, uploadApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Electronics & Communication Engineering',
  'Information Technology',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Management Studies',
  'Other',
];

const DEGREE_TYPES = ['B.Tech', 'M.Tech', 'MBA', 'PhD', 'Diploma', 'Other'];

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    description: 'Currently studying at IITRAM',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-400',
    selectedBg: 'bg-blue-600 border-blue-600',
    iconBg: 'bg-blue-100 text-blue-600',
    selectedIconBg: 'bg-white/20 text-white',
  },
  {
    id: 'alumni',
    label: 'Alumni',
    description: 'Graduated from IITRAM',
    icon: GraduationCap,
    color: 'from-iitram-500 to-iitram-700',
    bg: 'bg-iitram-50 hover:bg-iitram-100 border-iitram-200 hover:border-iitram-400',
    selectedBg: 'bg-iitram-600 border-iitram-600',
    iconBg: 'bg-iitram-100 text-iitram-600',
    selectedIconBg: 'bg-white/20 text-white',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    description: 'Teaching at IITRAM',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-400',
    selectedBg: 'bg-emerald-600 border-emerald-600',
    iconBg: 'bg-emerald-100 text-emerald-600',
    selectedIconBg: 'bg-white/20 text-white',
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setAuth, accessToken, refreshToken } = useAuthStore();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || '');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    department: '',
    batch: '',
    degreeType: 'B.Tech',
    currentYear: '1',
    currentSemester: '1',
    linkedin: '',
    github: '',
    bio: '',
  });

  const needsAcademicInfo = selectedRole === 'student' || selectedRole === 'alumni';

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const res = await uploadApi.uploadImage(file, 'avatar');
      setAvatarUrl(res.data.url);
    } catch {
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRole) return;
    if (needsAcademicInfo && (!form.department || !form.batch)) {
      toast.error('Please fill in your department and batch year.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        role: selectedRole,
        bio: form.bio,
        linkedin: form.linkedin,
        github: form.github,
        avatar: avatarUrl,
      };
      if (needsAcademicInfo) {
        payload.department = form.department;
        payload.batch = form.batch;
        payload.degreeType = form.degreeType;
        if (selectedRole === 'student') {
          payload.currentYear = parseInt(form.currentYear);
          payload.currentSemester = parseInt(form.currentSemester);
        }
      }

      const res = await authApi.completeOnboarding(payload);
      const { user: updatedUser, accessToken: newToken, refreshToken: newRefresh } = res.data;
      setAuth(updatedUser, newToken, newRefresh);
      toast.success(`Welcome to IITRAM Alumni, ${updatedUser.firstName}!`);
      navigate('/feed');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRoleData = ROLES.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-iitram-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-iitram-600 to-iitram-800 flex items-center justify-center shadow-lg mb-3">
          <GraduationCap size={24} className="text-white" />
        </div>
        <span className="text-sm font-medium text-slate-500">IITRAM Alumni Platform</span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              s < step ? 'bg-iitram-600 text-white' :
              s === step ? 'bg-iitram-600 text-white ring-4 ring-iitram-100' :
              'bg-slate-200 text-slate-500'
            }`}>
              {s < step ? <Check size={14} /> : s}
            </div>
            {s < 2 && <div className={`w-16 h-1 rounded-full transition-all ${s < step ? 'bg-iitram-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8"
            >
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Who are you at IITRAM?</h1>
              <p className="text-slate-500 text-sm mb-8">Select your role to personalise your experience</p>

              <div className="space-y-3">
                {ROLES.map(role => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        isSelected ? role.selectedBg + ' text-white' : role.bg + ' text-slate-700'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? role.selectedIconBg : role.iconBg
                      }`}>
                        <Icon size={22} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{role.label}</p>
                        <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>{role.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedRole}
                className="btn btn-primary w-full mt-8 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8"
            >
              <div className="flex items-center gap-3 mb-1">
                {selectedRoleData && (
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    selectedRole === 'student' ? 'bg-blue-100 text-blue-700' :
                    selectedRole === 'alumni' ? 'bg-iitram-100 text-iitram-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {selectedRoleData.label}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Complete your profile</h1>
              <p className="text-slate-500 text-sm mb-7">Make your profile stand out to the community</p>

              {/* Avatar upload */}
              <div className="flex items-center gap-5 mb-7 pb-7 border-b border-slate-100">
                <div className="relative flex-shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-100" alt="avatar" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-iitram-600 to-iitram-400 flex items-center justify-center ring-4 ring-slate-100">
                      <span className="text-2xl font-bold text-white">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                  )}
                  {avatarUploading && (
                    <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                      <Loader2 size={20} className="text-white animate-spin" />
                    </div>
                  )}
                  {avatarUrl && !avatarUploading && (
                    <button
                      onClick={() => setAvatarUrl('')}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">Profile photo</p>
                  <p className="text-xs text-slate-500 mb-2">
                    {avatarUrl ? 'Photo uploaded from Google. You can change it.' : 'Upload a photo to make your profile stand out.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={avatarUploading}
                    className="btn btn-outline btn-sm text-xs py-1.5"
                  >
                    <Upload size={13} /> {avatarUrl ? 'Change photo' : 'Upload photo'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
              </div>

              {/* Academic info (student / alumni only) */}
              {needsAcademicInfo && (
                <div className="space-y-4 mb-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Degree Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.degreeType}
                        onChange={e => setForm(f => ({ ...f, degreeType: e.target.value }))}
                        className="input"
                      >
                        {DEGREE_TYPES.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {selectedRole === 'alumni' ? 'Graduation Batch' : 'Admission Batch'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder={new Date().getFullYear().toString()}
                        value={form.batch}
                        onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
                        className="input"
                        min="1990"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.department}
                      onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                      className="input"
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>

                  {selectedRole === 'student' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Year</label>
                        <select
                          value={form.currentYear}
                          onChange={e => setForm(f => ({ ...f, currentYear: e.target.value }))}
                          className="input"
                        >
                          {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Semester</label>
                        <select
                          value={form.currentSemester}
                          onChange={e => setForm(f => ({ ...f, currentSemester: e.target.value }))}
                          className="input"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Social links */}
              <div className="space-y-4 mb-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Link2 size={16} className="text-blue-600" />
                  </div>
                  <input
                    type="url"
                    placeholder="LinkedIn profile URL (optional)"
                    value={form.linkedin}
                    onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
                    className="input pl-9"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <GitBranch size={16} className="text-slate-700" />
                  </div>
                  <input
                    type="url"
                    placeholder="GitHub profile URL (optional)"
                    value={form.github}
                    onChange={e => setForm(f => ({ ...f, github: e.target.value }))}
                    className="input pl-9"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="mb-7">
                <textarea
                  placeholder="Write a short bio about yourself... (optional)"
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  maxLength={500}
                  className="input resize-none"
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{form.bio.length}/500</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="btn btn-outline px-5"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || avatarUploading}
                  className="btn btn-primary flex-1 py-3 text-base"
                >
                  {submitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Setting up your profile...</>
                  ) : (
                    <>Finish setup <Check size={18} /></>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 mt-4">
                You can always update your profile details later
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
