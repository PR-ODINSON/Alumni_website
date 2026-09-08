import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'student' | 'alumni' | 'faculty' | 'admin';
export type AuthProvider = 'local' | 'google';
export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';
export type PrivacyOption = 'public' | 'college' | 'connections' | 'private';

export interface IVerificationHistory {
  status: VerificationStatus;
  updatedBy?: mongoose.Types.ObjectId;
  notes?: string;
  updatedAt: Date;
}

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
  
  // Verification
  verificationStatus: VerificationStatus;
  verificationDocuments: string[];
  verificationHistory: IVerificationHistory[];
  isVerified: boolean; // Keep for backward compatibility

  // Mentorship
  mentorStatus: 'inactive' | 'active' | 'suspended';

  // Soft Delete
  deletedAt?: Date;
  deletedBy?: mongoose.Types.ObjectId;
  deletionReason?: string;

  // Enrollment & Donation Status
  enrollmentNumber?: string;
  hasDonated?: boolean;
  donationAmount?: number;
  donationDate?: Date;
  donationPurpose?: string;

  // Privacy Control
  privacySettings: {
    email: PrivacyOption;
    phone: PrivacyOption;
    company: PrivacyOption;
    linkedin: PrivacyOption;
    resume: PrivacyOption;
    socialLinks: PrivacyOption;
  };

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

    // Verification
    verificationStatus: {
      type: String,
      enum: ['pending', 'under_review', 'verified', 'rejected', 'suspended'],
      default: 'pending',
    },
    verificationDocuments: [{ type: String }],
    verificationHistory: [
      {
        status: { type: String, enum: ['pending', 'under_review', 'verified', 'rejected', 'suspended'] },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        notes: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    isVerified: { type: Boolean, default: false }, // Backwards compatibility

    // Mentorship
    mentorStatus: {
      type: String,
      enum: ['inactive', 'active', 'suspended'],
      default: 'inactive',
    },

    // Soft Delete
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    deletionReason: { type: String },

    // Enrollment & Donation Status
    enrollmentNumber: { type: String, trim: true, sparse: true, index: true },
    hasDonated: { type: Boolean, default: false, index: true },
    donationAmount: { type: Number, default: 0 },
    donationDate: { type: Date },
    donationPurpose: { type: String, default: '' },

    // Profile Privacy Settings
    privacySettings: {
      email: { type: String, enum: ['public', 'college', 'connections', 'private'], default: 'college' },
      phone: { type: String, enum: ['public', 'college', 'connections', 'private'], default: 'connections' },
      company: { type: String, enum: ['public', 'college', 'connections', 'private'], default: 'public' },
      linkedin: { type: String, enum: ['public', 'college', 'connections', 'private'], default: 'public' },
      resume: { type: String, enum: ['public', 'college', 'connections', 'private'], default: 'connections' },
      socialLinks: { type: String, enum: ['public', 'college', 'connections', 'private'], default: 'college' },
    },

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
UserSchema.index({ verificationStatus: 1 });
UserSchema.index({ deletedAt: 1 });
UserSchema.index({ firstName: 'text', lastName: 'text', bio: 'text' });

// Virtual
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save: hash password
UserSchema.pre('save', async function (next) {
  if (this.isModified('verificationStatus')) {
    this.isVerified = this.verificationStatus === 'verified';
  }
  if (!this.isModified('password') || !this.password) return next();
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }
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
