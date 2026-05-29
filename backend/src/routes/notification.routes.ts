import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { protect } from '../middleware/auth';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

const router = Router();
router.use(protect);

router.get('/', asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = { recipient: req.user._id };
  if (unreadOnly === 'true') filter.isRead = false;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .populate('sender', 'firstName lastName avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipient: req.user._id, isRead: false }),
  ]);

  res.json({ success: true, data: notifications, total, unreadCount });
}));

router.patch('/read-all', asyncHandler(async (req: AuthRequest, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true, readAt: new Date() });
  res.json({ success: true, message: 'All notifications marked as read.' });
}));

router.patch('/:id/read', asyncHandler(async (req: AuthRequest, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true, readAt: new Date() }
  );
  res.json({ success: true });
}));

router.delete('/:id', asyncHandler(async (req: AuthRequest, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
  res.json({ success: true });
}));

export default router;
