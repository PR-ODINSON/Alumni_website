import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MapPin, Building, GraduationCap, Briefcase, Award, Star,
  Link2, Globe, MessageCircle,
  UserPlus, UserCheck, Calendar, ChevronRight, BookOpen,
  Rocket, Users, Eye, Edit, ExternalLink,
} from 'lucide-react';
import { alumniApi, studentApi, connectionApi, userApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AlumniProfilePage({ userId: propUserId }: { userId?: string } = {}) {
  const { userId: routeUserId } = useParams<{ userId: string }>();
  const userId = propUserId || routeUserId;
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const isOwn = currentUser?._id === userId;

  const { data, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId || userId === 'undefined') throw new Error('User ID is required');
      const res = await userApi.getUser(userId);
      const user = res.data.data.user;
      const profile = res.data.data.profile;
      return {
        isAlumni: user.role === 'alumni',
        user,
        profile,
      };
    },
    enabled: !!userId && userId !== 'undefined',
  });

  const { data: connData } = useQuery({
    queryKey: ['connection-status', userId],
    queryFn: () => connectionApi.getStatus(userId!),
    enabled: isAuthenticated && !isOwn && !!userId && userId !== 'undefined',
  });

  const connectMutation = useMutation({
    mutationFn: () => connectionApi.sendRequest(userId!),
    onSuccess: () => toast.success('Connection request sent!'),
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to send request'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 animate-pulse">
        <div className="h-64 bg-slate-200" />
        <div className="max-w-5xl mx-auto px-6 -mt-20">
          <div className="card p-8">
            <div className="flex gap-6">
              <div className="w-32 h-32 rounded-2xl bg-slate-200" />
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="py-24 text-center text-slate-400">Profile not found</div>;

  const isAlumni = data.isAlumni;
  const user = data.user || {};
  
  // Synthesize or fallback profile if not created yet (e.g. pending onboarding)
  const profile = data.profile || {
    user,
    batch: 2026,
    graduationYear: 2026,
    department: 'Engineering',
    program: 'B.Tech',
    degreeType: 'B.Tech',
    currentCompany: '',
    currentDesignation: '',
    currentIndustry: '',
    employmentStatus: '',
    skills: [],
    expertise: [],
    languages: [],
    careerTimeline: [],
    educationHistory: [],
    achievements: [],
    publications: [],
    awards: [],
    projects: [],
    interests: [],
    isMentor: false,
    mentorAreas: [],
    mentorAvailability: 'unavailable',
    maxMentees: 0,
    profileViews: 0,
    isDistinguished: false,
    verificationStatus: 'pending',
  };

  const connStatus = connData?.data?.data?.status;

  // Map student internships and academic information to match alumni properties
  const careerTimeline = isAlumni
    ? (profile.careerTimeline || [])
    : (profile.internships || []).map((entry: any) => ({
        ...entry,
        title: entry.role,
        employmentType: 'internship',
      }));

  const educationHistory = isAlumni
    ? (profile.educationHistory || [])
    : [
        {
          degree: profile.degreeType || 'Student',
          field: profile.program || profile.department || '',
          institution: 'Indian Institute of Technology RAM (IITRAM)',
          startYear: profile.batch ? profile.batch - 4 : new Date().getFullYear() - 4,
          endYear: profile.batch || new Date().getFullYear(),
          isCurrent: true,
          grade: profile.cgpa ? `CGPA: ${profile.cgpa}` : undefined,
        },
      ];

  const achievements = profile.achievements || [];
  const publications = profile.publications || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cover */}
      <div className="relative h-64 bg-gradient-to-br from-iitram-800 to-iitram-600 overflow-hidden">
        {user.coverImage && (
          <img src={user.coverImage} className="w-full h-full object-cover" alt="Cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-iitram-900/60 to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          {isOwn && (
            <Link to="/profile/edit" className="btn btn-sm bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/25 shadow-sm transition-all duration-300">
              <Edit size={14} /> Edit Profile
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card -mt-20 p-6 sm:p-8 mb-6 relative border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(1,105,252,0.06)] hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white shadow-soft"
                  alt={user.firstName}
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-iitram-700 to-iitram-500 ring-4 ring-white shadow-soft flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{user.firstName?.[0] || ''}{user.lastName?.[0] || ''}</span>
                </div>
              )}
              {profile.verificationStatus === 'verified' && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-iitram-600 rounded-full border-2 border-white flex items-center justify-center">
                  <svg viewBox="0 0 12 12" className="w-4 h-4"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-900">{user.firstName} {user.lastName}</h1>
                    {isAlumni && profile.isDistinguished && (
                      <span className="badge badge-gold">
                        <Award size={11} /> Distinguished Alumni
                      </span>
                    )}
                    {isAlumni && profile.isMentor && (
                      <span className="badge badge-success">
                        <Star size={11} /> Mentor
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mt-1">
                    {isAlumni 
                      ? (profile.currentDesignation || 'IITRAM Alumni') + (profile.currentCompany ? ` at ${profile.currentCompany}` : '')
                      : `Student · ${profile.degreeType} in ${profile.department}`}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                    {user.location?.city && (
                      <span className="flex items-center gap-1"><MapPin size={13} /> {user.location.city}, {user.location.country}</span>
                    )}
                    {isAlumni && profile.currentIndustry && (
                      <span className="flex items-center gap-1"><Briefcase size={13} /> {profile.currentIndustry}</span>
                    )}
                    <span className="flex items-center gap-1"><GraduationCap size={13} /> {profile.degreeType} · {profile.department} · Batch {profile.batch}</span>
                    <span className="flex items-center gap-1"><Eye size={13} /> {profile.profileViews || 0} views</span>
                  </div>
                </div>

                {/* Actions */}
                {!isOwn && isAuthenticated && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Link to={`/messages?user=${userId}`} className="btn btn-outline btn-sm">
                      <MessageCircle size={15} /> Message
                    </Link>
                    {connStatus === 'accepted' ? (
                      <button className="btn btn-secondary btn-sm" disabled>
                        <UserCheck size={15} /> Connected
                      </button>
                    ) : connStatus === 'pending' ? (
                      <button className="btn btn-secondary btn-sm" disabled>Pending</button>
                    ) : (
                      <button
                        onClick={() => connectMutation.mutate()}
                        disabled={connectMutation.isPending}
                        className="btn btn-primary btn-sm"
                      >
                        <UserPlus size={15} /> Connect
                      </button>
                    )}
                    {isAlumni && profile.isMentor && profile.mentorAvailability !== 'unavailable' && (
                      <Link to={`/mentorship?mentor=${userId}`} className="btn btn-gold btn-sm">
                        <Star size={15} /> Request Mentorship
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-slate-600 text-sm mt-4 leading-relaxed max-w-2xl">{user.bio}</p>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-4">
                {user.socialLinks?.linkedin && (
                  <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-500 transition-colors" title="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                )}
                {user.socialLinks?.github && (
                  <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors" title="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  </a>
                )}
                {user.socialLinks?.twitter && (
                  <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-500 transition-colors" title="Twitter/X">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {user.socialLinks?.website && (
                  <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-iitram-600 transition-colors" title="Website">
                    <Globe size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 pb-12">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
             {/* Career Timeline */}
             {careerTimeline?.length > 0 && (
               <div className="card p-6 border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(1,105,252,0.05)] hover:-translate-y-1 transition-all duration-300">
                 <h2 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                   <Briefcase size={18} className="text-[#0169FC]" /> {isAlumni ? 'Career Journey' : 'Internships & Experience'}
                 </h2>
                 <div className="relative">
                   <div className="absolute left-4 top-2 bottom-2 w-[1.5px] bg-gradient-to-b from-[#0169FC]/25 via-slate-100 to-slate-100/50" />
                   <div className="space-y-6">
                     {careerTimeline
                       .sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                       .map((entry: any, i: number) => (
                         <motion.div
                           key={entry._id || i}
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.05 }}
                           className="relative pl-10"
                         >
                           {entry.isCurrent ? (
                             <div className="absolute left-4 -translate-x-1/2 top-2 flex h-4 w-4 items-center justify-center">
                               <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-40 animate-ping"></span>
                               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0169FC] shadow-[0_0_8px_rgba(1,105,252,0.4)]"></span>
                             </div>
                           ) : (
                             <div className="absolute left-4 -translate-x-1/2 top-2.5 w-3 h-3 rounded-full border border-slate-300 bg-white shadow-2xs" />
                           )}
                           <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                             <div>
                               <p className="font-semibold text-slate-900">{entry.title}</p>
                               <p className="text-[#0169FC] text-sm font-medium">{entry.company}</p>
                               {entry.location && <p className="text-xs text-slate-400 mt-0.5"><MapPin size={10} className="inline mr-1" />{entry.location}</p>}
                             </div>
                             <div className="text-right flex-shrink-0">
                               <p className="text-xs text-slate-500">
                                 {formatDate(entry.startDate, { month: 'short', year: 'numeric' })} —{' '}
                                 {entry.isCurrent ? <span className="text-emerald-600 font-semibold">Present</span> : entry.endDate ? formatDate(entry.endDate, { month: 'short', year: 'numeric' }) : ''}
                               </p>
                               <span className={`mt-1 inline-block text-2xs px-2 py-0.5 rounded-full capitalize font-medium ${
                                 entry.employmentType === 'full-time' ? 'bg-emerald-50 text-emerald-700' :
                                 entry.employmentType === 'internship' ? 'bg-purple-50 text-purple-700' :
                                 'bg-slate-100 text-slate-600'
                               }`}>
                                 {entry.employmentType}
                               </span>
                             </div>
                           </div>
                           {entry.description && (
                             <p className="text-sm text-slate-500 mt-2 leading-relaxed">{entry.description}</p>
                           )}
                         </motion.div>
                       ))}
                   </div>
                 </div>
               </div>
             )}

            {/* Education */}
            {educationHistory?.length > 0 && (
              <div className="card p-6 border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(1,105,252,0.05)] hover:-translate-y-1.5 transition-all duration-300">
                <h2 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                  <GraduationCap size={18} className="text-[#0169FC]" /> Education
                </h2>
                <div className="space-y-5">
                  {educationHistory.map((edu: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50/50 flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={18} className="text-[#0169FC]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{edu.degree} in {edu.field}</p>
                        <p className="text-sm text-slate-600">{edu.institution}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {edu.startYear} — {edu.isCurrent ? 'Present' : edu.endYear}
                          {edu.grade ? ` · ${edu.grade}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects & Portfolio for Students */}
            {!isAlumni && profile.projects?.length > 0 && (
              <div className="card p-6 border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(1,105,252,0.05)] hover:-translate-y-1.5 transition-all duration-300">
                <h2 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                  <Rocket size={18} className="text-brand-500" /> Projects & Portfolio
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {profile.projects.map((project: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors duration-250 flex flex-col justify-between shadow-xs">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{project.title}</h3>
                        {project.description && <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{project.description}</p>}
                        {project.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {project.technologies.map((tech: string) => (
                              <span key={tech} className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-full">{tech}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {(project.github || project.url) && (
                        <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                              GitHub
                            </a>
                          )}
                          {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#0169FC] transition-colors">
                              <ExternalLink size={12} /> Live Demo
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {achievements?.length > 0 && (
              <div className="card p-6 border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(1,105,252,0.05)] hover:-translate-y-1.5 transition-all duration-300">
                <h2 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                  <Award size={18} className="text-gold-500" /> Achievements
                </h2>
                <div className="space-y-4">
                  {achievements.map((ach: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{ach.title}</p>
                        {ach.description && <p className="text-xs text-slate-500 mt-0.5">{ach.description}</p>}
                        {ach.year && <p className="text-xs text-slate-400 mt-0.5">{ach.year}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {publications?.length > 0 && (
              <div className="card p-6 border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(1,105,252,0.05)] hover:-translate-y-1.5 transition-all duration-300">
                <h2 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                  <BookOpen size={18} className="text-[#0169FC]" /> Research & Publications
                </h2>
                <div className="space-y-4">
                  {publications.map((pub: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-[#0169FC]/20 transition-all duration-200 shadow-2xs">
                      <p className="font-medium text-slate-900 text-sm">{pub.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{pub.journal} · {pub.year}</p>
                      {pub.url && (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#0169FC] hover:underline mt-1.5 font-medium">
                          <ExternalLink size={11} /> View Publication
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Startup */}
            {isAlumni && profile.startup?.name && (
              <div className="card p-6 border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(1,105,252,0.05)] hover:-translate-y-1.5 transition-all duration-300">
                <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Rocket size={18} className="text-orange-500" /> Startup Venture
                </h2>
                <div className="flex items-start gap-4">
                  {profile.startup.logo ? (
                    <img src={profile.startup.logo} className="w-16 h-16 rounded-xl object-cover border border-slate-100" alt="" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                      <Rocket size={24} className="text-orange-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{profile.startup.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.startup.sector && <span className="badge badge-warning">{profile.startup.sector}</span>}
                      <span className="badge badge-primary capitalize">{profile.startup.stage}</span>
                      {profile.startup.founded && <span className="text-xs text-slate-500">Founded {profile.startup.founded}</span>}
                    </div>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{profile.startup.description}</p>
                    {profile.startup.website && (
                      <a href={profile.startup.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#0169FC] hover:underline mt-2 font-medium">
                        <Globe size={12} /> Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Skills */}
            {profile.skills?.length > 0 && (
              <div className="card p-5 border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(1,105,252,0.05)] hover:-translate-y-1.5 transition-all duration-300">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill: string) => (
                    <span key={skill} className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200/60 text-slate-600 hover:text-[#0169FC] hover:border-[#0169FC]/30 hover:bg-blue-50/50 rounded-full transition-all duration-200 font-medium">{skill}</span>
                  ))}
                </div>
                {isAlumni && profile.expertise?.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-slate-500 mt-4 mb-2">Areas of Expertise</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.expertise.map((exp: string) => (
                        <span key={exp} className="text-xs px-2.5 py-1 bg-blue-50/50 border border-blue-100 text-[#0169FC] rounded-full font-medium">{exp}</span>
                      ))}
                    </div>
                  </>
                )}
                {!isAlumni && profile.interests?.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-slate-500 mt-4 mb-2">Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.interests.map((interest: string) => (
                        <span key={interest} className="text-xs px-2.5 py-1 bg-brand-50 border border-brand-100 text-brand-700 rounded-full font-medium">{interest}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mentor Info */}
            {isAlumni && profile.isMentor && (
              <div className="card p-5 border border-slate-100/80 border-l-4 border-l-gold-400 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(1,105,252,0.05)] hover:-translate-y-1.5 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} className="text-gold-500" />
                  <h3 className="font-bold text-slate-900 text-sm">Available to Mentor</h3>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Availability: <span className={`font-semibold ${profile.mentorAvailability === 'available' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {profile.mentorAvailability}
                  </span>
                </p>
                {profile.mentorAreas?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {profile.mentorAreas.map((area: string) => (
                      <span key={area} className="text-2xs px-2 py-0.5 bg-gold-50 text-gold-700 rounded-full border border-gold-100 font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                )}
                {!isOwn && isAuthenticated && profile.mentorAvailability !== 'unavailable' && (
                  <Link to={`/mentorship?mentor=${userId}`} className="btn btn-gold btn-sm w-full justify-center shadow-xs">
                    Request Mentorship
                  </Link>
                )}
              </div>
            )}

            {/* Higher Studies */}
            {isAlumni && profile.higherStudies?.institution && (
              <div className="card p-5 border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(1,105,252,0.05)] hover:-translate-y-1.5 transition-all duration-300">
                <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <GraduationCap size={15} className="text-[#0169FC]" /> Higher Studies
                </h3>
                <p className="font-semibold text-slate-800 text-sm">{profile.higherStudies.degree} in {profile.higherStudies.field}</p>
                <p className="text-sm text-slate-600">{profile.higherStudies.institution}</p>
                <p className="text-xs text-slate-400 mt-1">{profile.higherStudies.country} · {profile.higherStudies.year}</p>
              </div>
            )}

            {/* Awards */}
            {isAlumni && profile.awards?.length > 0 && (
              <div className="card p-5 border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(1,105,252,0.05)] hover:-translate-y-1.5 transition-all duration-300">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Awards & Recognition</h3>
                <div className="space-y-3">
                  {profile.awards.map((award: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      <Award size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{award.name}</p>
                        <p className="text-xs text-slate-500">{award.organization} · {award.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
