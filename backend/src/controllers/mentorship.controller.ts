import { Response, NextFunction } from 'express';
import Mentorship from '../models/Mentorship';
import Alumni from '../models/Alumni';
import Notification from '../models/Notification';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const requestMentorship = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { mentorId, areas, goals, message } = req.body;

  const mentorAlumni = await Alumni.findOne({ user: mentorId });
  if (!mentorAlumni?.isMentor) return next(new AppError('This user is not accepting mentorship requests.', 400));
  if (mentorAlumni.mentorAvailability === 'unavailable') {
    return next(new AppError('Mentor is currently unavailable.', 400));
  }

  const activeCount = await Mentorship.countDocuments({ mentor: mentorId, status: 'active' });
  if (activeCount >= mentorAlumni.maxMentees) {
    return next(new AppError('Mentor has reached their maximum mentee capacity.', 400));
  }

  const existing = await Mentorship.findOne({
    mentor: mentorId,
    mentee: req.user._id,
    status: { $in: ['pending', 'active'] },
  });
  if (existing) return next(new AppError('You already have a pending or active mentorship with this mentor.', 400));

  const mentorship = await Mentorship.create({
    mentor: mentorId,
    mentee: req.user._id,
    areas,
    goals,
    message,
  });

  await Notification.create({
    recipient: mentorId,
    sender: req.user._id,
    type: 'mentorship_request',
    title: 'New Mentorship Request',
    message: `${req.user.firstName} ${req.user.lastName} wants you to be their mentor`,
    link: `/mentorship/${mentorship._id}`,
  });

  req.app.get('io')?.to(mentorId).emit('notification', { type: 'mentorship_request' });

  res.status(201).json({ success: true, data: mentorship, message: 'Mentorship request sent.' });
});

export const respondToRequest = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { mentorshipId } = req.params;
  const { action, rejectionReason } = req.body;

  const mentorship = await Mentorship.findById(mentorshipId);
  if (!mentorship) return next(new AppError('Mentorship not found.', 404));
  if (mentorship.mentor.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized.', 403));
  }
  if (mentorship.status !== 'pending') {
    return next(new AppError('This request has already been processed.', 400));
  }

  mentorship.status = action === 'accept' ? 'active' : 'rejected';
  mentorship.respondedAt = new Date();
  if (action === 'accept') mentorship.startedAt = new Date();
  if (rejectionReason) mentorship.rejectionReason = rejectionReason;
  await mentorship.save();

  await Notification.create({
    recipient: mentorship.mentee,
    sender: req.user._id,
    type: 'mentorship_accepted',
    title: action === 'accept' ? 'Mentorship Request Accepted!' : 'Mentorship Request Update',
    message: action === 'accept'
      ? `${req.user.firstName} ${req.user.lastName} accepted your mentorship request`
      : `${req.user.firstName} ${req.user.lastName} was unable to accept your mentorship request`,
    link: `/mentorship/${mentorship._id}`,
  });

  res.json({ success: true, data: mentorship });
});

export const scheduleSession = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { mentorshipId } = req.params;

  const mentorship = await Mentorship.findById(mentorshipId);
  if (!mentorship) return next(new AppError('Mentorship not found.', 404));

  const isMentor = mentorship.mentor.toString() === req.user._id.toString();
  const isMentee = mentorship.mentee.toString() === req.user._id.toString();
  if (!isMentor && !isMentee) return next(new AppError('Not authorized.', 403));
  if (mentorship.status !== 'active') return next(new AppError('Mentorship is not active.', 400));

  mentorship.sessions.push({
    scheduledAt: new Date(req.body.scheduledAt),
    duration: req.body.duration || 60,
    platform: req.body.platform || 'google-meet',
    meetingLink: req.body.meetingLink,
    status: 'scheduled',
  });

  await mentorship.save();

  const notifyUser = isMentor ? mentorship.mentee : mentorship.mentor;
  await Notification.create({
    recipient: notifyUser,
    sender: req.user._id,
    type: 'mentorship_session',
    title: 'Session Scheduled',
    message: `A mentorship session has been scheduled`,
    link: `/mentorship/${mentorship._id}`,
  });

  res.json({ success: true, data: mentorship.sessions });
});

export const updateSession = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { mentorshipId, sessionId } = req.params;

  const mentorship = await Mentorship.findById(mentorshipId);
  if (!mentorship) return next(new AppError('Mentorship not found.', 404));

  if (mentorship.mentor.toString() !== req.user._id.toString() &&
    mentorship.mentee.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized.', 403));
  }

  const session = (mentorship.sessions as any).id(sessionId);
  if (!session) return next(new AppError('Session not found.', 404));

  Object.assign(session, req.body);
  if (req.body.status === 'completed') session.completedAt = new Date();
  await mentorship.save();

  res.json({ success: true, data: session });
});

export const getMentorships = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { role, status } = req.query;

  const filter: any = {};
  if (role === 'mentor') filter.mentor = req.user._id;
  else if (role === 'mentee') filter.mentee = req.user._id;
  else filter.$or = [{ mentor: req.user._id }, { mentee: req.user._id }];

  if (status) filter.status = status;

  const mentorships = await Mentorship.find(filter)
    .populate('mentor', 'firstName lastName avatar')
    .populate('mentee', 'firstName lastName avatar')
    .sort('-updatedAt');

  res.json({ success: true, data: mentorships });
});

export const getMentorship = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const mentorship = await Mentorship.findById(req.params.mentorshipId)
    .populate('mentor', 'firstName lastName avatar bio')
    .populate('mentee', 'firstName lastName avatar bio');

  if (!mentorship) return next(new AppError('Mentorship not found.', 404));

  if (mentorship.mentor._id.toString() !== req.user._id.toString() &&
    mentorship.mentee._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin') {
    return next(new AppError('Not authorized.', 403));
  }

  res.json({ success: true, data: mentorship });
});

export const submitFeedback = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { mentorshipId } = req.params;
  const { rating, comment, wouldRecommend } = req.body;

  const mentorship = await Mentorship.findById(mentorshipId);
  if (!mentorship) return next(new AppError('Mentorship not found.', 404));
  if (mentorship.status !== 'completed' && mentorship.status !== 'active') {
    return next(new AppError('Can only submit feedback for active or completed mentorships.', 400));
  }

  const isMentor = mentorship.mentor.toString() === req.user._id.toString();
  const isMentee = mentorship.mentee.toString() === req.user._id.toString();

  if (!isMentor && !isMentee) return next(new AppError('Not authorized.', 403));

  if (!mentorship.finalFeedback) mentorship.finalFeedback = {};

  if (isMentee) {
    mentorship.finalFeedback.fromMentee = { rating, comment, wouldRecommend, submittedAt: new Date() };
  } else {
    mentorship.finalFeedback.fromMentor = { rating, comment, submittedAt: new Date() };
  }

  await mentorship.save();
  res.json({ success: true, message: 'Feedback submitted.' });
});

export const completeMentorship = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const mentorship = await Mentorship.findById(req.params.mentorshipId);
  if (!mentorship) return next(new AppError('Mentorship not found.', 404));
  if (mentorship.mentor.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the mentor can complete a mentorship.', 403));
  }

  mentorship.status = 'completed';
  mentorship.completedAt = new Date();
  await mentorship.save();

  res.json({ success: true, data: mentorship });
});
