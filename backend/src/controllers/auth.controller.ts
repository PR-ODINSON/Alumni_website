import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import Alumni from '../models/Alumni';
import Student from '../models/Student';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendEmail, emailTemplates } from '../utils/email';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const sendTokenResponse = (user: any, statusCode: number, res: Response): void => {
  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  user.loginCount = (user.loginCount || 0) + 1;
  user.save({ validateBeforeSave: false });

  const userData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    isProfileComplete: user.isProfileComplete,
    isVerified: user.isVerified,
  };

  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
    user: userData,
  });
};

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password, role, batch, department, program, degreeType } = req.body;

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
  if (user.role === 'alumni' && batch && department) {
    await Alumni.create({
      user: user._id,
      batch: parseInt(batch),
      graduationYear: parseInt(batch) + (degreeType === 'B.Tech' ? 4 : degreeType === 'M.Tech' ? 2 : 5),
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

  sendTokenResponse(user, 200, res);
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new AppError('Please provide email and password.', 400));

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
  }

  if (!user.isEmailVerified) {
    return next(new AppError('Please verify your email before logging in.', 403));
  }

  if (user.isBanned) {
    return next(new AppError(`Account suspended: ${user.banReason || 'Contact support.'}`, 403));
  }

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);
  
  let profile = null;
  if (req.user.role === 'alumni') {
    profile = await Alumni.findOne({ user: req.user._id });
  } else if (req.user.role === 'student') {
    profile = await Student.findOne({ user: req.user._id });
  }

  res.json({ success: true, user, profile });
});

export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user) return next(new AppError('User not found.', 404));

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});
