import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { protect, authorize } from '../middleware/auth';
import User from '../models/User';
import Alumni from '../models/Alumni';
import Post from '../models/Post';
import Job from '../models/Job';
import Event from '../models/Event';
import SuccessStory from '../models/SuccessStory';
import { AuthRequest } from '../middleware/auth';

const router = Router();
router.use(protect, authorize('admin'));

// Dashboard Overview
router.get('/dashboard', asyncHandler(async (_req: AuthRequest, res) => {
  const [
    totalUsers, totalAlumni, totalStudents, totalFaculty,
    pendingVerifications, totalJobs, totalEvents, recentUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'alumni' }),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'faculty' }),
    Alumni.countDocuments({ verificationStatus: 'pending' }),
    Job.countDocuments(),
    Event.countDocuments(),
    User.find().sort('-createdAt').limit(10).select('firstName lastName email role createdAt isEmailVerified'),
  ]);

  res.json({
    success: true,
    data: { totalUsers, totalAlumni, totalStudents, totalFaculty, pendingVerifications, totalJobs, totalEvents, recentUsers },
  });
}));

// User Management
router.get('/users', asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 20, role, status, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {};
  if (role) filter.role = role;
  if (status === 'active') filter.isActive = true;
  if (status === 'banned') filter.isBanned = true;
  if (search) filter.$or = [
    { firstName: new RegExp(search as string, 'i') },
    { lastName: new RegExp(search as string, 'i') },
    { email: new RegExp(search as string, 'i') },
  ];

  const [users, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.json({ success: true, data: users, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
}));

router.patch('/users/:userId/ban', asyncHandler(async (req: AuthRequest, res, next) => {
  const { reason } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { isBanned: true, banReason: reason, isActive: false },
    { new: true }
  );
  if (!user) return next(new AppError('User not found.', 404));
  res.json({ success: true, message: 'User banned.', data: user });
}));

router.patch('/users/:userId/unban', asyncHandler(async (req: AuthRequest, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { isBanned: false, banReason: undefined, isActive: true },
    { new: true }
  );
  if (!user) return next(new AppError('User not found.', 404));
  res.json({ success: true, message: 'User unbanned.', data: user });
}));

router.patch('/users/:userId/verify', asyncHandler(async (req: AuthRequest, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.userId, { isVerified: true }, { new: true });
  if (!user) return next(new AppError('User not found.', 404));
  res.json({ success: true, data: user });
}));

// Alumni Verification
router.get('/alumni/pending', asyncHandler(async (_req: AuthRequest, res) => {
  const alumni = await Alumni.find({ verificationStatus: 'pending' })
    .populate('user', 'firstName lastName email avatar createdAt')
    .sort('-createdAt');
  res.json({ success: true, data: alumni });
}));

router.patch('/alumni/:alumniId/verify', asyncHandler(async (req: AuthRequest, res, next) => {
  const { status, note } = req.body;
  const alumni = await Alumni.findByIdAndUpdate(
    req.params.alumniId,
    { verificationStatus: status, verificationNote: note },
    { new: true }
  );
  if (!alumni) return next(new AppError('Alumni not found.', 404));

  if (status === 'verified') {
    await User.findByIdAndUpdate(alumni.user, { isVerified: true });
  }

  res.json({ success: true, data: alumni });
}));

// Content Moderation
router.get('/posts/reported', asyncHandler(async (_req: AuthRequest, res) => {
  const posts = await Post.find({ isPublished: true })
    .populate('author', 'firstName lastName avatar email')
    .sort('-createdAt')
    .limit(50);
  res.json({ success: true, data: posts });
}));

router.patch('/posts/:postId/remove', asyncHandler(async (req: AuthRequest, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.postId, { isPublished: false }, { new: true });
  if (!post) return next(new AppError('Post not found.', 404));
  res.json({ success: true, message: 'Post removed from feed.' });
}));

// Event Management
router.patch('/events/:eventId/publish', asyncHandler(async (req: AuthRequest, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.eventId, { isPublished: true }, { new: true });
  if (!event) return next(new AppError('Event not found.', 404));
  res.json({ success: true, data: event });
}));

// Success Stories
router.patch('/stories/:storyId/publish', asyncHandler(async (req: AuthRequest, res, next) => {
  const story = await SuccessStory.findByIdAndUpdate(
    req.params.storyId,
    { isPublished: true, isFeatured: req.body.isFeatured || false, publishedAt: new Date() },
    { new: true }
  );
  if (!story) return next(new AppError('Story not found.', 404));
  res.json({ success: true, data: story });
}));

export default router;
