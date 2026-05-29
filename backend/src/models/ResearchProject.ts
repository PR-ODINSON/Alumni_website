import mongoose, { Document, Schema } from 'mongoose';

export interface IResearchProject extends Document {
  title: string;
  abstract: string;
  description: string;
  domain: string;
  subDomain: string;
  keywords: string[];
  status: 'open' | 'in-progress' | 'completed' | 'on-hold';
  type: 'thesis' | 'paper' | 'project' | 'startup-research' | 'collaboration';
  
  // Team
  pi: mongoose.Types.ObjectId;
  coInvestigators: mongoose.Types.ObjectId[];
  collaborators: Array<{
    user: mongoose.Types.ObjectId;
    role: string;
    joinedAt: Date;
  }>;
  
  // Applications
  openPositions: Array<{
    role: string;
    description: string;
    requirements: string[];
    count: number;
  }>;
  applications: Array<{
    user: mongoose.Types.ObjectId;
    message: string;
    appliedAt: Date;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
  
  // Publications
  publications: Array<{
    title: string;
    journal: string;
    year: number;
    url?: string;
    doi?: string;
    impactFactor?: number;
  }>;
  
  // Funding
  funding?: {
    source: string;
    amount: number;
    currency: string;
    duration: string;
  };
  
  startDate?: Date;
  endDate?: Date;
  institution: string;
  
  coverImage?: string;
  documents: Array<{ url: string; name: string; type: string }>;
  
  isPublic: boolean;
  views: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const ResearchProjectSchema = new Schema<IResearchProject>(
  {
    title: { type: String, required: true, trim: true },
    abstract: { type: String, required: true },
    description: { type: String, default: '' },
    domain: { type: String, required: true },
    subDomain: { type: String, default: '' },
    keywords: [String],
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'on-hold'],
      default: 'open',
    },
    type: {
      type: String,
      enum: ['thesis', 'paper', 'project', 'startup-research', 'collaboration'],
      required: true,
    },
    pi: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coInvestigators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    collaborators: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        role: String,
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    openPositions: [
      {
        role: String,
        description: String,
        requirements: [String],
        count: { type: Number, default: 1 },
      },
    ],
    applications: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        message: String,
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
      },
    ],
    publications: [
      {
        title: String,
        journal: String,
        year: Number,
        url: String,
        doi: String,
        impactFactor: Number,
      },
    ],
    funding: {
      source: String,
      amount: Number,
      currency: { type: String, default: 'INR' },
      duration: String,
    },
    startDate: Date,
    endDate: Date,
    institution: { type: String, default: 'IITRAM' },
    coverImage: String,
    documents: [{ url: String, name: String, type: String }],
    isPublic: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ResearchProjectSchema.index({ pi: 1 });
ResearchProjectSchema.index({ domain: 1 });
ResearchProjectSchema.index({ status: 1 });
ResearchProjectSchema.index({ title: 'text', abstract: 'text', keywords: 'text' });

export default mongoose.model<IResearchProject>('ResearchProject', ResearchProjectSchema);
