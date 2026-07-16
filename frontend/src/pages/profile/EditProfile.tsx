import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Camera, Save, Plus, Trash2, Globe, Lock, GraduationCap, Briefcase, X } from 'lucide-react';
import { userApi, alumniApi, uploadApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  'location.city': z.string().optional(),
  'location.country': z.string().optional(),
  'socialLinks.linkedin': z.string().url().optional().or(z.literal('')),
  'socialLinks.github': z.string().url().optional().or(z.literal('')),
  'socialLinks.twitter': z.string().url().optional().or(z.literal('')),
  'socialLinks.website': z.string().url().optional().or(z.literal('')),
  'privacySettings.email': z.enum(['public', 'college', 'connections', 'private']).optional(),
  'privacySettings.phone': z.enum(['public', 'college', 'connections', 'private']).optional(),
  'privacySettings.company': z.enum(['public', 'college', 'connections', 'private']).optional(),
  'privacySettings.linkedin': z.enum(['public', 'college', 'connections', 'private']).optional(),
  'privacySettings.resume': z.enum(['public', 'college', 'connections', 'private']).optional(),
  'privacySettings.socialLinks': z.enum(['public', 'college', 'connections', 'private']).optional(),
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

export default function EditProfile() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('Basic Info');
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      'location.city': user?.location?.city || '',
      'location.country': user?.location?.country || '',
      'socialLinks.linkedin': user?.socialLinks?.linkedin || '',
      'socialLinks.github': user?.socialLinks?.github || '',
      'socialLinks.twitter': user?.socialLinks?.twitter || '',
      'socialLinks.website': user?.socialLinks?.website || '',
      'privacySettings.email': user?.privacySettings?.email || 'college',
      'privacySettings.phone': user?.privacySettings?.phone || 'connections',
      'privacySettings.company': user?.privacySettings?.company || 'public',
      'privacySettings.linkedin': user?.privacySettings?.linkedin || 'public',
      'privacySettings.resume': user?.privacySettings?.resume || 'connections',
      'privacySettings.socialLinks': user?.privacySettings?.socialLinks || 'college',
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
      setUser(res.data.data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
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
    updateMutation.mutate(nested);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadApi.image(formData);
      const url = (res as any).data?.data?.url;
      await userApi.updateProfile({ avatar: url });
      if (user) setUser({ ...user, avatar: url });
      toast.success('Avatar updated');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="page-container py-10 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
          <p className="text-slate-500 mt-1">Update your IITRAM profile information</p>
        </div>

        {/* Avatar section */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar
                src={user?.avatar}
                initials={`${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`}
                size="2xl"
              />
              <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-iitram-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-iitram-800 transition-colors shadow">
                <Camera size={14} className="text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{user?.firstName} {user?.lastName}</h3>
              <p className="text-sm text-slate-500 capitalize">{user?.role} · IITRAM</p>
              {uploading && <p className="text-xs text-iitram-600 mt-1">Uploading...</p>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Info Tab */}
          {activeTab === 'Basic Info' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input {...register('location.city')} className="input" placeholder="Ahmedabad" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                  <input {...register('location.country')} className="input" placeholder="India" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Social Links</h3>
                <div className="space-y-3">
                  {(['linkedin', 'github', 'twitter', 'website'] as const).map(platform => (
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
            </motion.div>
          )}

          {/* Career Tab */}
          {activeTab === 'Career' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {user?.role === 'alumni' ? (
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase size={18} className="text-iitram-600" />
                    <h3 className="font-semibold text-slate-900">Career Journey</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Manage your career entries from your profile page.</p>
                  <Link to="/profile" className="btn-primary btn-sm">Go to Profile</Link>
                </div>
              ) : (
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase size={18} className="text-iitram-600" />
                    <h3 className="font-semibold text-slate-900">Current Role</h3>
                  </div>
                  <input className="input" placeholder="Current role / internship" />
                </div>
              )}
            </motion.div>
          )}

          {/* Education Tab */}
          {activeTab === 'Education' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap size={18} className="text-iitram-600" />
                  <h3 className="font-semibold text-slate-900">Education</h3>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-sm font-medium text-slate-700">IITRAM — Primary Institution</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {user?.role === 'alumni' ? 'B.Tech / M.Tech Graduate' : 'Currently Enrolled'}
                  </p>
                </div>
                <p className="text-xs text-slate-400 mt-3">Additional education entries can be managed from your profile page.</p>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'Settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Privacy Settings */}
              <div className="card p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock size={16} className="text-slate-500" /> Privacy Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Email Visibility', key: 'privacySettings.email' },
                    { label: 'Phone Visibility', key: 'privacySettings.phone' },
                    { label: 'Company Visibility', key: 'privacySettings.company' },
                    { label: 'LinkedIn Visibility', key: 'privacySettings.linkedin' },
                    { label: 'Resume Visibility', key: 'privacySettings.resume' },
                    { label: 'Social Links Visibility', key: 'privacySettings.socialLinks' },
                  ].map(setting => (
                    <div key={setting.key}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">{setting.label}</label>
                      <select {...register(setting.key as any)} className="input h-10 py-1 text-xs">
                        <option value="public">Public (Everyone)</option>
                        <option value="college">College Members</option>
                        <option value="connections">Connections Only</option>
                        <option value="private">Private (Only Me)</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="card p-6">
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
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={16} />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
