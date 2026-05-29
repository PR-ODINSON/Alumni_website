import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType =
  | 'connection_request'
  | 'connection_accepted'
  | 'post_like'
  | 'post_comment'
  | 'comment_reply'
  | 'mention'
  | 'job_application'
  | 'job_status_update'
  | 'event_registration'
  | 'event_reminder'
  | 'mentorship_request'
  | 'mentorship_accepted'
  | 'mentorship_session'
  | 'message'
  | 'announcement'
  | 'profile_view'
  | 'system';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: [
        'connection_request', 'connection_accepted', 'post_like', 'post_comment',
        'comment_reply', 'mention', 'job_application', 'job_status_update',
        'event_registration', 'event_reminder', 'mentorship_request',
        'mentorship_accepted', 'mentorship_session', 'message', 'announcement',
        'profile_view', 'system',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: String,
    data: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  { timestamps: true }
);

NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

export default mongoose.model<INotification>('Notification', NotificationSchema);
