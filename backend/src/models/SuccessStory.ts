import mongoose, { Document, Schema } from 'mongoose';

export interface ISuccessStory extends Document {
  alumni: mongoose.Types.ObjectId;
  title: string;
  subtitle: string;
  content: string;
  category: 'career' | 'entrepreneurship' | 'research' | 'social-impact' | 'arts' | 'sports' | 'leadership' | 'other';
  coverImage: string;
  featuredImage?: string;
  images: Array<{ url: string; caption?: string }>;
  tags: string[];
  highlights: string[];
  quote?: string;
  timeline?: Array<{
    year: number;
    milestone: string;
    description: string;
  }>;
  isPublished: boolean;
  isFeatured: boolean;
  isDistinguished: boolean;
  views: number;
  likes: mongoose.Types.ObjectId[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SuccessStorySchema = new Schema<ISuccessStory>(
  {
    alumni: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: '' },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['career', 'entrepreneurship', 'research', 'social-impact', 'arts', 'sports', 'leadership', 'other'],
      required: true,
    },
    coverImage: { type: String, default: '' },
    featuredImage: String,
    images: [{ url: String, caption: String }],
    tags: [String],
    highlights: [String],
    quote: String,
    timeline: [
      {
        year: Number,
        milestone: String,
        description: String,
      },
    ],
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isDistinguished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    publishedAt: Date,
  },
  { timestamps: true }
);

SuccessStorySchema.index({ alumni: 1 });
SuccessStorySchema.index({ category: 1 });
SuccessStorySchema.index({ isPublished: 1, isFeatured: -1 });
SuccessStorySchema.index({ publishedAt: -1 });

export default mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);
