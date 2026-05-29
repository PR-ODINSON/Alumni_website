import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  shortDescription: string;
  eventType: 'reunion' | 'alumni-meet' | 'workshop' | 'webinar' | 'guest-lecture' | 'sports' | 'cultural' | 'conference' | 'other';
  organizer: mongoose.Types.ObjectId;
  coOrganizers: mongoose.Types.ObjectId[];
  
  // Timing
  startDate: Date;
  endDate: Date;
  registrationDeadline?: Date;
  
  // Location
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  virtualLink?: string;
  isVirtual: boolean;
  isHybrid: boolean;
  
  // Capacity
  maxAttendees?: number;
  registeredCount: number;
  
  // Registration
  registrations: Array<{
    user: mongoose.Types.ObjectId;
    registeredAt: Date;
    status: 'registered' | 'waitlisted' | 'cancelled' | 'attended';
    ticketId: string;
    rsvpStatus: 'yes' | 'no' | 'maybe';
    checkedInAt?: Date;
  }>;
  
  // Media
  coverImage: string;
  gallery: Array<{
    url: string;
    publicId: string;
    caption?: string;
    uploadedAt: Date;
  }>;
  
  // Features
  isRegistrationOpen: boolean;
  isFree: boolean;
  fee?: number;
  currency: string;
  hasCertificate: boolean;
  certificateTemplate?: string;
  
  // Speakers
  speakers: Array<{
    name: string;
    bio: string;
    photo: string;
    designation: string;
    organization: string;
    linkedinUrl?: string;
    user?: mongoose.Types.ObjectId;
  }>;
  
  // Schedule
  schedule: Array<{
    time: string;
    title: string;
    description: string;
    speaker?: string;
    duration: number;
  }>;
  
  tags: string[];
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 300, default: '' },
    eventType: {
      type: String,
      enum: ['reunion', 'alumni-meet', 'workshop', 'webinar', 'guest-lecture', 'sports', 'cultural', 'conference', 'other'],
      required: true,
    },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coOrganizers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: Date,
    venue: String,
    address: String,
    city: String,
    state: String,
    country: { type: String, default: 'India' },
    virtualLink: String,
    isVirtual: { type: Boolean, default: false },
    isHybrid: { type: Boolean, default: false },
    maxAttendees: Number,
    registeredCount: { type: Number, default: 0 },
    registrations: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        registeredAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['registered', 'waitlisted', 'cancelled', 'attended'],
          default: 'registered',
        },
        ticketId: String,
        rsvpStatus: {
          type: String,
          enum: ['yes', 'no', 'maybe'],
          default: 'yes',
        },
        checkedInAt: Date,
      },
    ],
    coverImage: { type: String, default: '' },
    gallery: [
      {
        url: String,
        publicId: String,
        caption: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    isRegistrationOpen: { type: Boolean, default: true },
    isFree: { type: Boolean, default: true },
    fee: Number,
    currency: { type: String, default: 'INR' },
    hasCertificate: { type: Boolean, default: false },
    certificateTemplate: String,
    speakers: [
      {
        name: String,
        bio: String,
        photo: String,
        designation: String,
        organization: String,
        linkedinUrl: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    schedule: [
      {
        time: String,
        title: String,
        description: String,
        speaker: String,
        duration: Number,
      },
    ],
    tags: [String],
    category: String,
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

EventSchema.index({ startDate: 1 });
EventSchema.index({ eventType: 1 });
EventSchema.index({ organizer: 1 });
EventSchema.index({ isPublished: 1 });
EventSchema.index({ isFeatured: -1, startDate: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);
