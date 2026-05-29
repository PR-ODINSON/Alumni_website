import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { protect, authorize, optionalAuth } from '../middleware/auth';
import SuccessStory from '../models/SuccessStory';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 12, category, featured, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = { isPublished: true };
  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (search) filter.$or = [
    { title: new RegExp(search as string, 'i') },
    { content: new RegExp(search as string, 'i') },
  ];

  const [stories, total] = await Promise.all([
    SuccessStory.find(filter)
      .populate('alumni', 'firstName lastName avatar bio')
      .sort({ isFeatured: -1, publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    SuccessStory.countDocuments(filter),
  ]);

  res.json({ success: true, data: stories, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
}));

router.get('/:storyId', optionalAuth, asyncHandler(async (req: AuthRequest, res, next) => {
  const story = await SuccessStory.findById(req.params.storyId)
    .populate('alumni', 'firstName lastName avatar bio location');
  if (!story || !story.isPublished) return next(new AppError('Story not found.', 404));
  await SuccessStory.findByIdAndUpdate(req.params.storyId, { $inc: { views: 1 } });
  res.json({ success: true, data: story });
}));

router.use(protect);

router.post('/', asyncHandler(async (req: AuthRequest, res) => {
  const story = await SuccessStory.create({ ...req.body, alumni: req.user._id });
  res.status(201).json({ success: true, data: story });
}));

router.put('/:storyId', asyncHandler(async (req: AuthRequest, res, next) => {
  const story = await SuccessStory.findById(req.params.storyId);
  if (!story) return next(new AppError('Story not found.', 404));
  if (story.alumni.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized.', 403));
  }
  const updated = await SuccessStory.findByIdAndUpdate(req.params.storyId, req.body, { new: true });
  res.json({ success: true, data: updated });
}));

router.post('/:storyId/like', asyncHandler(async (req: AuthRequest, res, next) => {
  const story = await SuccessStory.findById(req.params.storyId);
  if (!story) return next(new AppError('Story not found.', 404));
  const isLiked = story.likes.includes(req.user._id);
  if (isLiked) {
    story.likes = story.likes.filter((id: any) => id.toString() !== req.user._id.toString());
  } else {
    story.likes.push(req.user._id);
  }
  await story.save();
  res.json({ success: true, likes: story.likes.length, isLiked: !isLiked });
}));

export default router;
