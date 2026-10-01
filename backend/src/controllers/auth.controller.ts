import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import Alumni from '../models/Alumni';
import Student from '../models/Student';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendEmail, emailTemplates } from '../utils/email';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const sendTokenResponse = async (user: any, statusCode: number, res: Response): Promise<void> => {
  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  await User.findByIdAndUpdate(user._id, {
    refreshToken,
    lastLogin: new Date(),
    $inc: { loginCount: 1 },
  });

  const alumniProfile = await Alumni.findOne({ user: user._id }).lean();
  const studentProfile = await Student.findOne({ user: user._id }).lean();
  const roleProfile: any = alumniProfile || studentProfile;

  const userData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName || `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    coverImage: user.coverImage,
    signatureUrl: user.signatureUrl,
    bio: user.bio,
    phone: user.phone,
    location: user.location,
    socialLinks: user.socialLinks,
    isEmailVerified: user.isEmailVerified,
    isProfileComplete: user.isProfileComplete,
    isVerified: user.isVerified,
    verificationStatus: user.verificationStatus,
    mentorStatus: user.mentorStatus,
    notificationPreferences: user.notificationPreferences,
    enrollmentNumber: user.enrollmentNumber || roleProfile?.enrollmentNumber,
    mustChangePassword: !!user.mustChangePassword,
    permanentAddress: user.permanentAddress || '',
    hasDonated: !!(user.hasDonated || alumniProfile?.hasDonated),
    donationAmount: user.donationAmount || alumniProfile?.donationAmount || 0,
    donationDate: user.donationDate,
    donationPurpose: user.donationPurpose,
    degreeType: roleProfile?.degreeType || 'B.Tech',
    department: roleProfile?.department || 'Mechanical Engineering',
    batch: roleProfile?.batch,
    currentYear: studentProfile?.currentYear,
    currentSemester: studentProfile?.currentSemester,
    graduationYear: alumniProfile?.graduationYear ?? studentProfile?.graduationYear,
  };

  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
    user: userData,
  });
};

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password, role, batch, graduationYear, department, program, degreeType } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return next(new AppError('An account with this email already exists.', 409));

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'alumni',
    emailVerificationToken: hashedToken,
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // Create role-specific profile
  if (user.role === 'alumni' && batch && graduationYear && department) {
    await Alumni.create({
      user: user._id,
      batch: parseInt(batch),
      graduationYear: parseInt(graduationYear),
      department,
      program: program || department,
      degreeType: degreeType || 'B.Tech',
    });
  } else if (user.role === 'student' && batch && department) {
    await Student.create({
      user: user._id,
      batch: parseInt(batch),
      department,
      program: program || department,
      degreeType: degreeType || 'B.Tech',
    });
  }

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify Your IITRAM Alumni Account',
      html: emailTemplates.verifyEmail(user.firstName, verifyUrl),
    });
  } catch {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email to continue.',
    userId: user._id,
  });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) return next(new AppError('Invalid or expired verification link.', 400));

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  await sendTokenResponse(user, 200, res);
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, identifier } = req.body;
  const loginKey = (identifier || email || '').trim();

  if (!loginKey || !password) return next(new AppError('Please provide email or enrollment number and password.', 400));

  let user = await User.findOne({
    $or: [
      { email: loginKey.toLowerCase() },
      { enrollmentNumber: loginKey },
      { enrollmentNumber: loginKey.toUpperCase() },
      { enrollmentNumber: loginKey.toLowerCase() }
    ]
  }).select('+password');

  if (!user) {
    const alumni = await Alumni.findOne({
      $or: [
        { enrollmentNumber: loginKey },
        { enrollmentNumber: loginKey.toUpperCase() }
      ]
    });
    if (alumni && alumni.user) {
      user = await User.findById(alumni.user).select('+password');
    }
  }

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email/enrollment number or password.', 401));
  }

  if (!user.isEmailVerified) {
    return next(new AppError('Please verify your email before logging in.', 403));
  }

  if (user.isBanned) {
    return next(new AppError(`Account suspended: ${user.banReason || 'Contact support.'}`, 403));
  }

  await sendTokenResponse(user, 200, res);
});

export const googleCallback = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
  }

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}&refresh=${refreshToken}`);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken: token } = req.body;
  if (!token) return next(new AppError('Refresh token required.', 401));

  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    return next(new AppError('Invalid refresh token.', 401));
  }

  const newAccessToken = generateAccessToken(user._id.toString(), user.role);
  const newRefreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  res.json({ success: true, accessToken: newAccessToken, refreshToken: newRefreshToken });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError('No account with this email address.', 404));

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset - IITRAM Alumni',
      html: emailTemplates.resetPassword(user.firstName, resetUrl),
    });
    res.json({ success: true, message: 'Password reset link sent to your email.' });
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Email could not be sent. Please try again.', 500));
  }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) return next(new AppError('Invalid or expired reset token.', 400));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();

  await sendTokenResponse(user, 200, res);
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  let profile = null;
  if (req.user.role === 'alumni') {
    profile = await Alumni.findOne({ user: req.user._id });
  } else if (req.user.role === 'student') {
    profile = await Student.findOne({ user: req.user._id });
  }

  const userObj: any = user.toObject();
  userObj.enrollmentNumber = user.enrollmentNumber || (profile as any)?.enrollmentNumber;
  userObj.mustChangePassword = !!user.mustChangePassword;
  userObj.degreeType = (profile as any)?.degreeType || userObj.degreeType;
  userObj.department = (profile as any)?.department || userObj.department;
  userObj.batch = (profile as any)?.batch;
  userObj.currentYear = (profile as any)?.currentYear;
  userObj.currentSemester = (profile as any)?.currentSemester;
  userObj.graduationYear = (profile as any)?.graduationYear;
  userObj.permanentAddress = user.permanentAddress || '';

  res.json({ success: true, user: userObj, profile });
});

export const completeOnboarding = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { role, department, batch, graduationYear, degreeType, currentYear, currentSemester, linkedin, github, bio, avatar } = req.body;

  if (!['student', 'alumni', 'faculty'].includes(role)) {
    return next(new AppError('Invalid role. Must be student, alumni, or faculty.', 400));
  }
  if (role === 'alumni' && (!department || !Number.isInteger(Number(batch)) || !Number.isInteger(Number(graduationYear)))) {
    return next(new AppError('Alumni onboarding requires department, start year, and passing year.', 400));
  }

  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError('User not found.', 404));

  user.role = role;
  user.isProfileComplete = true;
  if (bio) user.bio = bio;
  if (avatar) user.avatar = avatar;

  const social: Record<string, string> = (user.socialLinks as any)?.toObject ? (user.socialLinks as any).toObject() : { ...(user.socialLinks || {}) };
  if (linkedin) social.linkedin = linkedin;
  if (github) social.github = github;
  user.socialLinks = social;

  await user.save({ validateBeforeSave: false });

  // Create role-specific profile
  if (role === 'alumni' && department && batch && graduationYear) {
    const existing = await Alumni.findOne({ user: user._id });
    if (!existing) {
      await Alumni.create({
        user: user._id,
        batch: Number(batch),
        graduationYear: Number(graduationYear),
        department,
        program: department,
        degreeType: degreeType || 'B.Tech',
      });
    }
  } else if (role === 'student' && department && batch) {
    const existing = await Student.findOne({ user: user._id });
    if (!existing) {
      await Student.create({
        user: user._id,
        batch: parseInt(batch),
        department,
        program: department,
        degreeType: degreeType || 'B.Tech',
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
        currentYear: currentYear || 1,
        currentSemester: currentSemester || 1,
      });
    }
  }

  // Issue new tokens with updated role
  const newAccessToken = generateAccessToken(user._id.toString(), user.role);
  const newRefreshToken = generateRefreshToken(user._id.toString());
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id);

  res.json({ success: true, user: updatedUser, accessToken: newAccessToken, refreshToken: newRefreshToken });
});

export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user) return next(new AppError('User not found.', 404));

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  user.mustChangePassword = false;
  await user.save();
  sendTokenResponse(user, 200, res);
});

/** After bulk-created login: verify enrollment number, then set a new password. */
export const setPasswordWithEnrollment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { enrollmentNumber, newPassword } = req.body as { enrollmentNumber?: string; newPassword?: string };
  const enr = (enrollmentNumber || '').trim();
  const nextPassword = (newPassword || '').trim();

  if (!enr) return next(new AppError('Enrollment number is required.', 400));
  if (nextPassword.length < 8) return next(new AppError('New password must be at least 8 characters.', 400));

  const user = await User.findById(req.user._id).select('+password');
  if (!user) return next(new AppError('User not found.', 404));

  const storedEnr = (user.enrollmentNumber || '').trim();
  if (!storedEnr) return next(new AppError('No enrollment number is linked to this account. Contact the alumni office.', 400));
  if (storedEnr.toLowerCase() !== enr.toLowerCase()) {
    return next(new AppError('Enrollment number does not match this account.', 400));
  }

  user.password = nextPassword;
  user.mustChangePassword = false;
  user.refreshToken = undefined;
  await user.save();

  await sendTokenResponse(user, 200, res);
});
