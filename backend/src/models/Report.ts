import mongoose, { Document, Schema } from 'mongoose';

export type ReportReason = 'spam' | 'harassment' | 'fake_profile' | 'scam' | 'offensive' | 'abuse';
export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';

export interface IReport extends Document {
  reporter: mongoose.Types.ObjectId;
  targetType: 'User' | 'Post' | 'Job' | 'Event' | 'ResearchProject' | 'SuccessStory' | 'Comment';
  targetId: mongoose.Types.ObjectId;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  moderatedBy?: mongoose.Types.ObjectId;
  actionTaken?: 'none' | 'warned' | 'suspended' | 'banned' | 'deleted' | 'restored';
  resolutionNotes?: string;
  history: Array<{
    status: ReportStatus;
    updatedBy: mongoose.Types.ObjectId;
    notes?: string;
    actionTaken?: string;
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: {
      type: String,
      enum: ['User', 'Post', 'Job', 'Event', 'ResearchProject', 'SuccessStory', 'Comment'],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true },
    reason: {
      type: String,
      enum: ['spam', 'harassment', 'fake_profile', 'scam', 'offensive', 'abuse'],
      required: true,
    },
    details: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'resolved', 'dismissed'],
      default: 'pending',
    },
    moderatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    actionTaken: {
      type: String,
      enum: ['none', 'warned', 'suspended', 'banned', 'deleted', 'restored'],
    },
    resolutionNotes: String,
    history: [
      {
        status: { type: String, enum: ['pending', 'under_review', 'resolved', 'dismissed'] },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        notes: String,
        actionTaken: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

ReportSchema.index({ status: 1 });
ReportSchema.index({ targetType: 1, targetId: 1 });
ReportSchema.index({ createdAt: -1 });

export default mongoose.model<IReport>('Report', ReportSchema);
