import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { protect, authorize, optionalAuth } from '../middleware/auth';
import Student from '../models/Student';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 20, department, batch, openToWork, seekingMentor, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = { isActive: true };
  if (department) filter.department = new RegExp(department as string, 'i');
  if (batch) filter.batch = Number(batch);
  if (openToWork === 'true') filter.openToWork = true;
  if (seekingMentor === 'true') filter.seekingMentor = true;

  const [students, total] = await Promise.all([
    Student.find(filter)
      .populate('user', 'firstName lastName avatar bio location socialLinks')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Student.countDocuments(filter),
  ]);

  const publicRows = req.user?.role === 'admin' ? students : students.map((student: any) => ({
    _id: student._id,
    user: student.user ? {
      _id: student.user._id,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      role: student.user.role,
      avatar: student.user.avatar,
      coverImage: student.user.coverImage,
    } : null,
    department: student.department,
    graduationYear: student.graduationYear,
  }));

  res.json({ success: true, data: publicRows, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
}));

router.get('/:userId', optionalAuth, asyncHandler(async (req: AuthRequest, res, next) => {
  const student = await Student.findOne({ user: req.params.userId })
    .populate('user', 'firstName lastName role avatar coverImage');
  if (!student) return next(new AppError('Student profile not found.', 404));
  const isOwner = req.user?._id.toString() === req.params.userId;
  const isAdmin = req.user?.role === 'admin';
  if (!isOwner && !isAdmin) {
    await Student.findByIdAndUpdate(student._id, { $inc: { profileViews: 1 } });
    return res.json({
      success: true,
      data: {
        user: student.user,
        department: student.department,
        graduationYear: student.graduationYear,
      },
    });
  }
  res.json({ success: true, data: student });
}));

router.use(protect);

router.put('/profile/me', authorize('student'), asyncHandler(async (req: AuthRequest, res, next) => {
  const student = await Student.findOneAndUpdate(
    { user: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate('user', '-password');
  if (!student) return next(new AppError('Profile not found.', 404));
  res.json({ success: true, data: student });
}));

export default router;
