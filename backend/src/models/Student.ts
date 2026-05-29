import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  user: mongoose.Types.ObjectId;
  enrollmentNumber: string;
  batch: number;
  department: string;
  program: string;
  degreeType: 'B.Tech' | 'M.Tech' | 'MBA' | 'PhD' | 'Diploma';
  currentYear: number;
  currentSemester: number;
  cgpa?: number;
  
  // Profile
  interests: string[];
  skills: string[];
  researchAreas: string[];
  
  // Projects
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
  }>;
  
  // Resume & Portfolio
  resume?: {
    url: string;
    publicId: string;
    uploadedAt: Date;
  };
  portfolioLinks: string[];
  
  // Experience
  internships: Array<{
    company: string;
    role: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    description: string;
  }>;
  
  // Academic
  publications: Array<{
    title: string;
    journal: string;
    year: number;
    url?: string;
  }>;
  
  achievements: Array<{
    title: string;
    description: string;
    year: number;
  }>;
  
  // Career Goals
  careerGoals: string;
  preferredRoles: string[];
  preferredIndustries: string[];
  openToWork: boolean;
  
  // Mentorship
  seekingMentor: boolean;
  mentorshipAreas: string[];
  
  profileViews: number;
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    enrollmentNumber: { type: String, unique: true, sparse: true },
    batch: { type: Number, required: true },
    department: { type: String, required: true },
    program: { type: String, required: true },
    degreeType: {
      type: String,
      enum: ['B.Tech', 'M.Tech', 'MBA', 'PhD', 'Diploma'],
      required: true,
    },
    currentYear: { type: Number, min: 1, max: 6 },
    currentSemester: { type: Number, min: 1, max: 12 },
    cgpa: { type: Number, min: 0, max: 10 },
    interests: [String],
    skills: [String],
    researchAreas: [String],
    projects: [
      {
        title: { type: String, required: true },
        description: String,
        technologies: [String],
        url: String,
        github: String,
        startDate: Date,
        endDate: Date,
        isCurrent: { type: Boolean, default: false },
      },
    ],
    resume: {
      url: String,
      publicId: String,
      uploadedAt: Date,
    },
    portfolioLinks: [String],
    internships: [
      {
        company: String,
        role: String,
        location: String,
        startDate: Date,
        endDate: Date,
        isCurrent: { type: Boolean, default: false },
        description: String,
      },
    ],
    publications: [
      {
        title: String,
        journal: String,
        year: Number,
        url: String,
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
        year: Number,
      },
    ],
    careerGoals: { type: String, default: '' },
    preferredRoles: [String],
    preferredIndustries: [String],
    openToWork: { type: Boolean, default: false },
    seekingMentor: { type: Boolean, default: false },
    mentorshipAreas: [String],
    profileViews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StudentSchema.index({ user: 1 });
StudentSchema.index({ batch: 1 });
StudentSchema.index({ department: 1 });
StudentSchema.index({ openToWork: 1 });
StudentSchema.index({ seekingMentor: 1 });

export default mongoose.model<IStudent>('Student', StudentSchema);
