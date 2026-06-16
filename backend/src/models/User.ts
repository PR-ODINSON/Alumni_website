import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'student' | 'alumni' | 'faculty' | 'admin';
export type AuthProvider = 'local' | 'google';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar: string;
  coverImage: string;
  role: UserRole;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  isVerified: boolean;
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
  bio: string;
  phone?: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
    instagram?: string;
  };
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshToken?: string;
  lastLogin?: Date;
  loginCount: number;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    connectionRequests: boolean;
    messages: boolean;
    jobAlerts: boolean;
    eventReminders: boolean;
    mentorshipUpdates: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    password: { type: String, minlength: 8, select: false },
    googleId: { type: String, sparse: true },
    avatar: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    role: {
      type: String,
      enum: ['student', 'alumni', 'faculty', 'admin'],
      default: 'alumni',
    },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    isEmailVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String },
    bio: { type: String, maxlength: 500, default: '' },
    phone: { type: String },
    location: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
      website: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshToken: { type: String, select: false },
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      connectionRequests: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      jobAlerts: { type: Boolean, default: true },
      eventReminders: { type: Boolean, default: true },
      mentorshipUpdates: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ firstName: 'text', lastName: 'text', bio: 'text' });

// Virtual
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save: hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
