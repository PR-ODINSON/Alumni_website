import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { protect } from '../middleware/auth';
import User from '../models/User';
import Alumni from '../models/Alumni';
import Student from '../models/Student';
import { AuthRequest } from '../middleware/auth';

const router = Router();
router.use(protect);

router.get('/search', asyncHandler(async (req: AuthRequest, res) => {
  const { q, role } = req.query;
  if (!q) return res.json({ success: true, data: [] });

  const filter: any = {
    isActive: true,
    $or: [
      { firstName: new RegExp(q as string, 'i') },
      { lastName: new RegExp(q as string, 'i') },
      { email: new RegExp(q as string, 'i') },
    ],
  };
  if (role) filter.role = role;

  const users = await User.find(filter)
    .select('firstName lastName avatar role bio location isVerified')
    .limit(20);

  res.json({ success: true, data: users });
}));

router.get('/:userId', asyncHandler(async (req: AuthRequest, res, next) => {
  const user = await User.findById(req.params.userId)
    .select('-password -refreshToken -emailVerificationToken -passwordResetToken');
  if (!user) return next(new AppError('User not found.', 404));

  let profile = null;
  if (user.role === 'alumni') profile = await Alumni.findOne({ user: user._id });
  else if (user.role === 'student') profile = await Student.findOne({ user: user._id });

  res.json({ success: true, data: { user, profile } });
}));

router.patch('/profile', asyncHandler(async (req: AuthRequest, res) => {
  const allowedFields = ['firstName', 'lastName', 'bio', 'phone', 'location', 'socialLinks', 'avatar', 'coverImage'];
  const updates: Record<string, any> = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });
  res.json({ success: true, data: user });
}));

export default router;
