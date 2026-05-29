import mongoose, { Document, Schema } from 'mongoose';

export interface IMentorship extends Document {
  mentor: mongoose.Types.ObjectId;
  mentee: mongoose.Types.ObjectId;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'rejected';
  areas: string[];
  goals: string;
  message: string;
  respondedAt?: Date;
  rejectionReason?: string;
  
  // Sessions
  sessions: Array<{
    scheduledAt: Date;
    duration: number;
    platform: 'google-meet' | 'zoom' | 'teams' | 'phone' | 'in-person' | 'other';
    meetingLink?: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    notes?: string;
    mentorFeedback?: string;
    menteeFeedback?: string;
    rating?: number;
    completedAt?: Date;
  }>;
  
  // Progress
  milestones: Array<{
    title: string;
    description: string;
    dueDate: Date;
    completedAt?: Date;
    status: 'pending' | 'in-progress' | 'completed';
  }>;
  
  // Feedback
  finalFeedback?: {
    fromMentee?: {
      rating: number;
      comment: string;
      wouldRecommend: boolean;
      submittedAt: Date;
    };
    fromMentor?: {
      rating: number;
      comment: string;
      submittedAt: Date;
    };
  };
  
  startedAt?: Date;
  completedAt?: Date;
  expectedEndDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipSchema = new Schema<IMentorship>(
  {
    mentor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mentee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    areas: [String],
    goals: { type: String, required: true },
    message: { type: String, required: true },
    respondedAt: Date,
    rejectionReason: String,
    sessions: [
      {
        scheduledAt: Date,
        duration: Number,
        platform: {
          type: String,
          enum: ['google-meet', 'zoom', 'teams', 'phone', 'in-person', 'other'],
        },
        meetingLink: String,
        status: {
          type: String,
          enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
          default: 'scheduled',
        },
        notes: String,
        mentorFeedback: String,
        menteeFeedback: String,
        rating: Number,
        completedAt: Date,
      },
    ],
    milestones: [
      {
        title: String,
        description: String,
        dueDate: Date,
        completedAt: Date,
        status: {
          type: String,
          enum: ['pending', 'in-progress', 'completed'],
          default: 'pending',
        },
      },
    ],
    finalFeedback: {
      fromMentee: {
        rating: Number,
        comment: String,
        wouldRecommend: Boolean,
        submittedAt: Date,
      },
      fromMentor: {
        rating: Number,
        comment: String,
        submittedAt: Date,
      },
    },
    startedAt: Date,
    completedAt: Date,
    expectedEndDate: Date,
  },
  { timestamps: true }
);

MentorshipSchema.index({ mentor: 1 });
MentorshipSchema.index({ mentee: 1 });
MentorshipSchema.index({ status: 1 });

export default mongoose.model<IMentorship>('Mentorship', MentorshipSchema);
