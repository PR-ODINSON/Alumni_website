import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import Event from '../models/Event';
import Notification from '../models/Notification';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const event = await Event.create({ ...req.body, organizer: req.user._id });
  res.status(201).json({ success: true, data: event });
});

export const getEvents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    page = 1, limit = 12, eventType, isVirtual, upcoming, featured,
    search, sort = 'startDate',
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const filter: any = { isPublished: true };

  if (eventType) filter.eventType = eventType;
  if (isVirtual === 'true') filter.isVirtual = true;
  if (upcoming === 'true') filter.startDate = { $gte: new Date() };
  if (featured === 'true') filter.isFeatured = true;
  if (search) filter.$or = [
    { title: new RegExp(search as string, 'i') },
    { description: new RegExp(search as string, 'i') },
  ];

  const [events, total] = await Promise.all([
    Event.find(filter)
      .populate('organizer', 'firstName lastName avatar')
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Event.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: events,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const getEvent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const event = await Event.findById(req.params.eventId)
    .populate('organizer', 'firstName lastName avatar bio')
    .populate('coOrganizers', 'firstName lastName avatar');

  if (!event) return next(new AppError('Event not found.', 404));
  await Event.findByIdAndUpdate(req.params.eventId, { $inc: { views: 1 } });
  res.json({ success: true, data: event });
});

export const updateEvent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return next(new AppError('Event not found.', 404));
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized.', 403));
  }
  const updated = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: updated });
});

export const registerForEvent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return next(new AppError('Event not found.', 404));

  if (!event.isRegistrationOpen) return next(new AppError('Registration is closed.', 400));

  if (event.maxAttendees && event.registeredCount >= event.maxAttendees) {
    const ticketId = crypto.randomBytes(6).toString('hex').toUpperCase();
    event.registrations.push({
      user: req.user._id,
      registeredAt: new Date(),
      status: 'waitlisted',
      ticketId,
      rsvpStatus: req.body.rsvpStatus || 'yes',
    });
    await event.save();
    return res.json({ success: true, message: 'Added to waitlist.', status: 'waitlisted' });
  }

  const alreadyRegistered = event.registrations.find(
    (r: any) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyRegistered) return next(new AppError('Already registered.', 400));

  const ticketId = crypto.randomBytes(6).toString('hex').toUpperCase();
  event.registrations.push({
    user: req.user._id,
    registeredAt: new Date(),
    status: 'registered',
    ticketId,
    rsvpStatus: req.body.rsvpStatus || 'yes',
  });
  event.registeredCount += 1;
  await event.save();

  await Notification.create({
    recipient: req.user._id,
    type: 'event_registration',
    title: 'Registration Confirmed',
    message: `You are registered for "${event.title}". Your ticket ID: ${ticketId}`,
    link: `/events/${event._id}`,
  });

  res.json({ success: true, message: 'Successfully registered.', ticketId, status: 'registered' });
});

export const cancelRegistration = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return next(new AppError('Event not found.', 404));

  const regIdx = event.registrations.findIndex(
    (r: any) => r.user.toString() === req.user._id.toString()
  );
  if (regIdx === -1) return next(new AppError('Registration not found.', 404));

  if (event.registrations[regIdx].status === 'registered') {
    event.registeredCount = Math.max(0, event.registeredCount - 1);
  }

  event.registrations[regIdx].status = 'cancelled';
  await event.save();

  res.json({ success: true, message: 'Registration cancelled.' });
});

export const getMyEvents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const registered = await Event.find({ 'registrations.user': req.user._id, isPublished: true })
    .populate('organizer', 'firstName lastName avatar')
    .sort('-startDate');
  res.json({ success: true, data: registered });
});

export const deleteEvent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return next(new AppError('Event not found.', 404));
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized.', 403));
  }
  await Event.findByIdAndDelete(req.params.eventId);
  res.json({ success: true, message: 'Event deleted.' });
});

export const addToGallery = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return next(new AppError('Event not found.', 404));
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized.', 403));
  }
  const { images } = req.body;
  event.gallery.push(...images.map((img: any) => ({ ...img, uploadedAt: new Date() })));
  await event.save();
  res.json({ success: true, data: event.gallery });
});
