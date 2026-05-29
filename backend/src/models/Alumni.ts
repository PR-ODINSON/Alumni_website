import mongoose, { Document, Schema } from 'mongoose';

export interface ICareerEntry {
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
}

export interface IEducationEntry {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  isCurrent: boolean;
  grade?: string;
  activities?: string;
}

export interface IAlumni extends Document {
  user: mongoose.Types.ObjectId;
  enrollmentNumber: string;
  batch: number;
  graduationYear: number;
  department: string;
  program: string;
  degreeType: 'B.Tech' | 'M.Tech' | 'MBA' | 'PhD' | 'Diploma' | 'Other';
  
  // Current Status
  currentCompany: string;
  currentDesignation: string;
  currentIndustry: string;
  employmentStatus: 'employed' | 'self-employed' | 'entrepreneur' | 'higher-studies' | 'unemployed' | 'other';
  
  // Profile Details
  skills: string[];
  expertise: string[];
  languages: string[];
  
  // Career Timeline
  careerTimeline: ICareerEntry[];
  educationHistory: IEducationEntry[];
  
  // Achievements
  achievements: Array<{
    title: string;
    description: string;
    year: number;
    category: string;
  }>;
  
  // Research & Publications
  publications: Array<{
    title: string;
    journal: string;
    year: number;
    url?: string;
    doi?: string;
  }>;
  
  // Startup Info
  startup?: {
    name: string;
    description: string;
    website: string;
    founded: number;
    stage: 'idea' | 'seed' | 'early' | 'growth' | 'mature';
    sector: string;
    teamSize: number;
    funding?: string;
    logo?: string;
  };
  
  // Higher Studies
  higherStudies?: {
    institution: string;
    degree: string;
    field: string;
    country: string;
    year: number;
  };
  
  // Mentorship
  isMentor: boolean;
  mentorAreas: string[];
  mentorAvailability: 'available' | 'limited' | 'unavailable';
  maxMentees: number;
  
  // Metrics
  profileViews: number;
  isDistinguished: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationNote?: string;
  
  // Awards
  awards: Array<{
    name: string;
    organization: string;
    year: number;
    description: string;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}

const CareerEntrySchema = new Schema<ICareerEntry>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  description: { type: String, default: '' },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    default: 'full-time',
  },
});

const EducationEntrySchema = new Schema<IEducationEntry>({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number },
  isCurrent: { type: Boolean, default: false },
  grade: { type: String },
  activities: { type: String },
});

const AlumniSchema = new Schema<IAlumni>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    enrollmentNumber: { type: String, unique: true, sparse: true },
    batch: { type: Number, required: true },
    graduationYear: { type: Number, required: true },
    department: { type: String, required: true },
    program: { type: String, required: true },
    degreeType: {
      type: String,
      enum: ['B.Tech', 'M.Tech', 'MBA', 'PhD', 'Diploma', 'Other'],
      required: true,
    },
    currentCompany: { type: String, default: '' },
    currentDesignation: { type: String, default: '' },
    currentIndustry: { type: String, default: '' },
    employmentStatus: {
      type: String,
      enum: ['employed', 'self-employed', 'entrepreneur', 'higher-studies', 'unemployed', 'other'],
      default: 'employed',
    },
    skills: [{ type: String }],
    expertise: [{ type: String }],
    languages: [{ type: String }],
    careerTimeline: [CareerEntrySchema],
    educationHistory: [EducationEntrySchema],
    achievements: [
      {
        title: String,
        description: String,
        year: Number,
        category: String,
      },
    ],
    publications: [
      {
        title: String,
        journal: String,
        year: Number,
        url: String,
        doi: String,
      },
    ],
    startup: {
      name: String,
      description: String,
      website: String,
      founded: Number,
      stage: {
        type: String,
        enum: ['idea', 'seed', 'early', 'growth', 'mature'],
      },
      sector: String,
      teamSize: Number,
      funding: String,
      logo: String,
    },
    higherStudies: {
      institution: String,
      degree: String,
      field: String,
      country: String,
      year: Number,
    },
    isMentor: { type: Boolean, default: false },
    mentorAreas: [{ type: String }],
    mentorAvailability: {
      type: String,
      enum: ['available', 'limited', 'unavailable'],
      default: 'unavailable',
    },
    maxMentees: { type: Number, default: 3 },
    profileViews: { type: Number, default: 0 },
    isDistinguished: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationNote: { type: String },
    awards: [
      {
        name: String,
        organization: String,
        year: Number,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

// Indexes
AlumniSchema.index({ user: 1 });
AlumniSchema.index({ batch: 1 });
AlumniSchema.index({ department: 1 });
AlumniSchema.index({ currentIndustry: 1 });
AlumniSchema.index({ currentCompany: 1 });
AlumniSchema.index({ isMentor: 1 });
AlumniSchema.index({ verificationStatus: 1 });
AlumniSchema.index({ 'startup.name': 1 });

export default mongoose.model<IAlumni>('Alumni', AlumniSchema);
