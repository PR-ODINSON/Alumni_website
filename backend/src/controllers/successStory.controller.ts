import { Response, NextFunction } from 'express';
import SuccessStory from '../models/SuccessStory';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getSuccessStories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 12, category, featured, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = { isPublished: true, deletedAt: { $exists: false } };
  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (search) {
    filter.$or = [
      { title: new RegExp(search as string, 'i') },
      { content: new RegExp(search as string, 'i') },
    ];
  }

  const [stories, total] = await Promise.all([
    SuccessStory.find(filter)
      .populate('alumni', 'firstName lastName avatar bio')
      .sort({ isFeatured: -1, publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    SuccessStory.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: stories,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const getSuccessStory = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const story = await SuccessStory.findOne({ _id: req.params.storyId, deletedAt: { $exists: false } })
    .populate('alumni', 'firstName lastName avatar bio location');
  if (!story || !story.isPublished) return next(new AppError('Story not found.', 404));
  await SuccessStory.findByIdAndUpdate(req.params.storyId, { $inc: { views: 1 } });
  res.json({ success: true, data: story });
});

export const createSuccessStory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const story = await SuccessStory.create({ ...req.body, alumni: req.user._id });
  res.status(201).json({ success: true, data: story });
});

export const updateSuccessStory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const updated = await SuccessStory.findByIdAndUpdate(req.params.storyId, req.body, { new: true });
  res.json({ success: true, data: updated });
});

export const deleteSuccessStory = asyncHandler(async (req: AuthRequest, res: Response) => {
  await SuccessStory.findByIdAndUpdate(req.params.storyId, {
    deletedAt: new Date(),
    deletedBy: req.user._id,
    deletionReason: 'Deleted by owner/admin.',
  });
  res.json({ success: true, message: 'Story deleted successfully.' });
});

export const likeSuccessStory = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const story = await SuccessStory.findOne({ _id: req.params.storyId, deletedAt: { $exists: false } });
  if (!story) return next(new AppError('Story not found.', 404));
  
  const isLiked = story.likes.includes(req.user._id);
  if (isLiked) {
    story.likes = story.likes.filter((id: any) => id.toString() !== req.user._id.toString());
  } else {
    story.likes.push(req.user._id);
  }
  await story.save();
  
  res.json({ success: true, likes: story.likes.length, isLiked: !isLiked });
});
