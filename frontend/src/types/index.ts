export type UserRole = 'student' | 'alumni' | 'faculty' | 'admin';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar: string;
  coverImage?: string;
  bio: string;
  phone?: string;
  location: { city: string; state: string; country: string };
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
    instagram?: string;
  };
  isEmailVerified: boolean;
  isVerified: boolean;
  isProfileComplete: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
}

export interface CareerEntry {
  _id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
}

export interface EducationEntry {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  isCurrent: boolean;
  grade?: string;
}

export interface AlumniProfile {
  _id: string;
  user: User;
  enrollmentNumber?: string;
  batch: number;
  graduationYear: number;
  department: string;
  program: string;
  degreeType: string;
  currentCompany: string;
  currentDesignation: string;
  currentIndustry: string;
  employmentStatus: string;
  skills: string[];
  expertise: string[];
  languages: string[];
  careerTimeline: CareerEntry[];
  educationHistory: EducationEntry[];
  achievements: any[];
  publications: any[];
  startup?: StartupInfo;
  higherStudies?: any;
  isMentor: boolean;
  mentorAreas: string[];
  mentorAvailability: 'available' | 'limited' | 'unavailable';
  maxMentees: number;
  profileViews: number;
  isDistinguished: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  awards: any[];
  createdAt: string;
  updatedAt: string;
}

export interface StartupInfo {
  name: string;
  description: string;
  website: string;
  founded: number;
  stage: 'idea' | 'seed' | 'early' | 'growth' | 'mature';
  sector: string;
  teamSize: number;
  funding?: string;
  logo?: string;
}

export interface Post {
  _id: string;
  author: User;
  content: string;
  postType: string;
  media: Array<{ url: string; type: string; caption?: string }>;
  tags: string[];
  likes: string[];
  comments: any[];
  shares: number;
  views: number;
  isPinned: boolean;
  isAnnouncement: boolean;
  visibility: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  _id: string;
  postedBy: User;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  locationType: 'onsite' | 'remote' | 'hybrid';
  jobType: string;
  category: string;
  industry: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: { min: number; max: number; unit: string };
  salary: { min?: number; max?: number; currency: string; period: string; isHidden: boolean };
  applicationDeadline?: string;
  isReferralAvailable: boolean;
  views: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  eventType: string;
  organizer: User;
  startDate: string;
  endDate: string;
  venue?: string;
  city?: string;
  country?: string;
  virtualLink?: string;
  isVirtual: boolean;
  maxAttendees?: number;
  registeredCount: number;
  coverImage: string;
  isRegistrationOpen: boolean;
  isFree: boolean;
  fee?: number;
  hasCertificate: boolean;
  speakers: any[];
  schedule: any[];
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
}

export interface Mentorship {
  _id: string;
  mentor: User;
  mentee: User;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'rejected';
  areas: string[];
  goals: string;
  message: string;
  sessions: any[];
  milestones: any[];
  finalFeedback?: any;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface SuccessStory {
  _id: string;
  alumni: User;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  coverImage: string;
  tags: string[];
  highlights: string[];
  quote?: string;
  isPublished: boolean;
  isFeatured: boolean;
  isDistinguished: boolean;
  views: number;
  likes: string[];
  publishedAt?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender?: User;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationMeta;
}
