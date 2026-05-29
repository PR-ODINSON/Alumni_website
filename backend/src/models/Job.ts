import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  postedBy: mongoose.Types.ObjectId;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  locationType: 'onsite' | 'remote' | 'hybrid';
  jobType: 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance';
  category: string;
  industry: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  qualifications: string[];
  experience: {
    min: number;
    max: number;
    unit: 'months' | 'years';
  };
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: 'monthly' | 'annual' | 'hourly' | 'stipend';
    isNegotiable: boolean;
    isHidden: boolean;
  };
  applicationDeadline?: Date;
  startDate?: Date;
  applicationLink?: string;
  applicationEmail?: string;
  isReferralAvailable: boolean;
  referralBonus?: string;
  applicants: Array<{
    user: mongoose.Types.ObjectId;
    appliedAt: Date;
    status: 'applied' | 'reviewing' | 'shortlisted' | 'interviewed' | 'offered' | 'rejected';
    resumeUrl?: string;
    coverLetter?: string;
    notes?: string;
  }>;
  savedBy: mongoose.Types.ObjectId[];
  views: number;
  isActive: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyLogo: String,
    location: { type: String, required: true },
    locationType: {
      type: String,
      enum: ['onsite', 'remote', 'hybrid'],
      default: 'onsite',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
      required: true,
    },
    category: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    responsibilities: [String],
    skills: [String],
    qualifications: [String],
    experience: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      unit: { type: String, enum: ['months', 'years'], default: 'years' },
    },
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'INR' },
      period: {
        type: String,
        enum: ['monthly', 'annual', 'hourly', 'stipend'],
        default: 'annual',
      },
      isNegotiable: { type: Boolean, default: false },
      isHidden: { type: Boolean, default: false },
    },
    applicationDeadline: Date,
    startDate: Date,
    applicationLink: String,
    applicationEmail: String,
    isReferralAvailable: { type: Boolean, default: false },
    referralBonus: String,
    applicants: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['applied', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'rejected'],
          default: 'applied',
        },
        resumeUrl: String,
        coverLetter: String,
        notes: String,
      },
    ],
    savedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    tags: [String],
  },
  { timestamps: true }
);

JobSchema.index({ postedBy: 1 });
JobSchema.index({ jobType: 1 });
JobSchema.index({ industry: 1 });
JobSchema.index({ location: 1 });
JobSchema.index({ isActive: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ title: 'text', description: 'text', skills: 'text' });

export default mongoose.model<IJob>('Job', JobSchema);
