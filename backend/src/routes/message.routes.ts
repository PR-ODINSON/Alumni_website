import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { protect } from '../middleware/auth';
import { Message, Conversation } from '../models/Message';
import { AuthRequest } from '../middleware/auth';

const router = Router();
router.use(protect);

router.get('/conversations', asyncHandler(async (req: AuthRequest, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('participants', 'firstName lastName avatar role')
    .populate('lastMessage')
    .sort('-lastMessageAt');
  res.json({ success: true, data: conversations });
}));

router.post('/conversations', asyncHandler(async (req: AuthRequest, res) => {
  const { participantId } = req.body;

  const existing = await Conversation.findOne({
    participants: { $all: [req.user._id, participantId], $size: 2 },
    isGroup: false,
  });
  if (existing) return res.json({ success: true, data: existing });

  const conversation = await Conversation.create({
    participants: [req.user._id, participantId],
    isGroup: false,
  });
  await conversation.populate('participants', 'firstName lastName avatar role');
  res.status(201).json({ success: true, data: conversation });
}));

router.get('/conversations/:conversationId', asyncHandler(async (req: AuthRequest, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId)
    .populate('participants', 'firstName lastName avatar role');
  if (!conversation) return next(new AppError('Conversation not found.', 404));
  if (!conversation.participants.some((p: any) => p._id.toString() === req.user._id.toString())) {
    return next(new AppError('Not authorized.', 403));
  }
  res.json({ success: true, data: conversation });
}));

router.get('/conversations/:conversationId/messages', asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const messages = await Message.find({
    conversation: req.params.conversationId,
    isDeleted: false,
  })
    .populate('sender', 'firstName lastName avatar')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  await Message.updateMany(
    { conversation: req.params.conversationId, sender: { $ne: req.user._id }, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  res.json({ success: true, data: messages.reverse() });
}));

router.post('/conversations/:conversationId/messages', asyncHandler(async (req: AuthRequest, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) return next(new AppError('Conversation not found.', 404));
  if (!conversation.participants.some((p: any) => p.toString() === req.user._id.toString())) {
    return next(new AppError('Not authorized.', 403));
  }

  const message = await Message.create({
    conversation: req.params.conversationId,
    sender: req.user._id,
    content: req.body.content,
    messageType: req.body.messageType || 'text',
    attachment: req.body.attachment,
  });

  await message.populate('sender', 'firstName lastName avatar');

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const io = req.app.get('io');
  conversation.participants.forEach((participantId: any) => {
    if (participantId.toString() !== req.user._id.toString()) {
      io?.to(participantId.toString()).emit('new_message', { message, conversationId: req.params.conversationId });
    }
  });

  res.status(201).json({ success: true, data: message });
}));

export default router;
