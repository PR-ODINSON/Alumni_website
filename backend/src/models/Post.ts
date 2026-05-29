import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  likes: mongoose.Types.ObjectId[];
  parentComment?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  postType: 'update' | 'achievement' | 'job' | 'event' | 'announcement' | 'article' | 'question';
  media: Array<{
    url: string;
    publicId: string;
    type: 'image' | 'video' | 'document';
    caption?: string;
  }>;
  tags: string[];
  mentions: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  shares: number;
  views: number;
  isPinned: boolean;
  isAnnouncement: boolean;
  isPublished: boolean;
  visibility: 'public' | 'connections' | 'alumni-only' | 'faculty-only';
  poll?: {
    question: string;
    options: Array<{
      text: string;
      votes: mongoose.Types.ObjectId[];
    }>;
    expiresAt: Date;
  };
  linkedEvent?: mongoose.Types.ObjectId;
  linkedJob?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 2000 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 5000 },
    postType: {
      type: String,
      enum: ['update', 'achievement', 'job', 'event', 'announcement', 'article', 'question'],
      default: 'update',
    },
    media: [
      {
        url: String,
        publicId: String,
        type: { type: String, enum: ['image', 'video', 'document'] },
        caption: String,
      },
    ],
    tags: [String],
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isAnnouncement: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    visibility: {
      type: String,
      enum: ['public', 'connections', 'alumni-only', 'faculty-only'],
      default: 'public',
    },
    poll: {
      question: String,
      options: [
        {
          text: String,
          votes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        },
      ],
      expiresAt: Date,
    },
    linkedEvent: { type: Schema.Types.ObjectId, ref: 'Event' },
    linkedJob: { type: Schema.Types.ObjectId, ref: 'Job' },
  },
  { timestamps: true }
);

PostSchema.index({ author: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ postType: 1 });
PostSchema.index({ isPinned: -1, createdAt: -1 });
PostSchema.index({ content: 'text', tags: 'text' });
CommentSchema.index({ post: 1 });
CommentSchema.index({ author: 1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default mongoose.model<IPost>('Post', PostSchema);
