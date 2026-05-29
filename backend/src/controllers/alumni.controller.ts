import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Alumni from '../models/Alumni';
import User from '../models/User';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAlumniDirectory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    page = 1,
    limit = 20,
    search,
    batch,
    department,
    company,
    industry,
    location,
    isMentor,
    employmentStatus,
    degreeType,
    sort = '-createdAt',
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const alumniFilter: any = { verificationStatus: 'verified' };
  if (batch) alumniFilter.batch = Number(batch);
  if (department) alumniFilter.department = new RegExp(department as string, 'i');
  if (company) alumniFilter.currentCompany = new RegExp(company as string, 'i');
  if (industry) alumniFilter.currentIndustry = new RegExp(industry as string, 'i');
  if (isMentor === 'true') alumniFilter.isMentor = true;
  if (employmentStatus) alumniFilter.employmentStatus = employmentStatus;
  if (degreeType) alumniFilter.degreeType = degreeType;

  const userFilter: any = { role: 'alumni', isActive: true };
  if (location) {
    userFilter.$or = [
      { 'location.city': new RegExp(location as string, 'i') },
      { 'location.country': new RegExp(location as string, 'i') },
    ];
  }
  if (search) {
    userFilter.$or = [
      ...(userFilter.$or || []),
      { firstName: new RegExp(search as string, 'i') },
      { lastName: new RegExp(search as string, 'i') },
      { bio: new RegExp(search as string, 'i') },
    ];
  }

  const userIds = (await User.find(userFilter).select('_id')).map((u) => u._id);
  if (search || location) {
    alumniFilter.user = { $in: userIds };
  }

  const total = await Alumni.countDocuments(alumniFilter);

  const alumni = await Alumni.find(alumniFilter)
    .populate('user', 'firstName lastName avatar bio location socialLinks role isVerified')
    .sort(sort as string)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  res.json({
    success: true,
    data: alumni,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
});

export const getAlumniProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const alumni = await Alumni.findOne({ user: userId })
    .populate('user', '-password -refreshToken -emailVerificationToken -passwordResetToken');

  if (!alumni) return next(new AppError('Alumni profile not found.', 404));

  // Increment profile views (avoid self-views)
  if (req.user && req.user._id.toString() !== userId) {
    await Alumni.findByIdAndUpdate(alumni._id, { $inc: { profileViews: 1 } });
  }

  res.json({ success: true, data: alumni });
});

export const updateAlumniProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const allowedFields = [
    'currentCompany', 'currentDesignation', 'currentIndustry', 'employmentStatus',
    'skills', 'expertise', 'languages', 'careerTimeline', 'educationHistory',
    'achievements', 'publications', 'startup', 'higherStudies', 'isMentor',
    'mentorAreas', 'mentorAvailability', 'maxMentees', 'awards',
  ];

  const updateData: Record<string, any> = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updateData[field] = req.body[field];
  });

  const alumni = await Alumni.findOneAndUpdate(
    { user: req.user._id },
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('user', '-password -refreshToken');

  if (!alumni) return next(new AppError('Alumni profile not found.', 404));

  res.json({ success: true, data: alumni, message: 'Profile updated successfully.' });
});

export const addCareerEntry = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const alumni = await Alumni.findOne({ user: req.user._id });
  if (!alumni) return next(new AppError('Alumni profile not found.', 404));

  if (req.body.isCurrent) {
    alumni.careerTimeline.forEach((entry) => {
      entry.isCurrent = false;
    });
    alumni.currentCompany = req.body.company;
    alumni.currentDesignation = req.body.title;
  }

  alumni.careerTimeline.push(req.body);
  await alumni.save();

  res.status(201).json({ success: true, data: alumni.careerTimeline, message: 'Career entry added.' });
});

export const updateCareerEntry = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { entryId } = req.params;

  const alumni = await Alumni.findOne({ user: req.user._id });
  if (!alumni) return next(new AppError('Alumni profile not found.', 404));

  const entry = (alumni.careerTimeline as any).id(entryId);
  if (!entry) return next(new AppError('Career entry not found.', 404));

  Object.assign(entry, req.body);
  await alumni.save();

  res.json({ success: true, data: alumni.careerTimeline });
});

export const deleteCareerEntry = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { entryId } = req.params;

  const alumni = await Alumni.findOne({ user: req.user._id });
  if (!alumni) return next(new AppError('Alumni profile not found.', 404));

  alumni.careerTimeline = alumni.careerTimeline.filter(
    (e: any) => e._id.toString() !== entryId
  );
  await alumni.save();

  res.json({ success: true, message: 'Career entry removed.' });
});

export const getMentors = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 12, department, areas, availability } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {
    isMentor: true,
    mentorAvailability: { $ne: 'unavailable' },
    verificationStatus: 'verified',
  };

  if (department) filter.department = new RegExp(department as string, 'i');
  if (areas) filter.mentorAreas = { $in: (areas as string).split(',') };
  if (availability) filter.mentorAvailability = availability;

  const total = await Alumni.countDocuments(filter);
  const mentors = await Alumni.find(filter)
    .populate('user', 'firstName lastName avatar bio location')
    .sort({ profileViews: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  res.json({
    success: true,
    data: mentors,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const getAlumniStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const [total, byDepartment, byBatch, byIndustry, byCountry, mentors, entrepreneurs] = await Promise.all([
    Alumni.countDocuments({ verificationStatus: 'verified' }),
    Alumni.aggregate([
      { $match: { verificationStatus: 'verified' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Alumni.aggregate([
      { $match: { verificationStatus: 'verified' } },
      { $group: { _id: '$batch', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Alumni.aggregate([
      { $match: { verificationStatus: 'verified', currentIndustry: { $ne: '' } } },
      { $group: { _id: '$currentIndustry', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Alumni.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      { $group: { _id: '$userInfo.location.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]),
    Alumni.countDocuments({ isMentor: true }),
    Alumni.countDocuments({ employmentStatus: 'entrepreneur' }),
  ]);

  res.json({
    success: true,
    data: { total, byDepartment, byBatch, byIndustry, byCountry, mentors, entrepreneurs },
  });
});

export const getDistinguishedAlumni = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const alumni = await Alumni.find({ isDistinguished: true, verificationStatus: 'verified' })
    .populate('user', 'firstName lastName avatar bio')
    .sort({ profileViews: -1 })
    .limit(12)
    .lean();

  res.json({ success: true, data: alumni });
});

export const getStartupEcosystem = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const startups = await Alumni.find({
    'startup.name': { $exists: true, $ne: '' },
    verificationStatus: 'verified',
  })
    .populate('user', 'firstName lastName avatar')
    .select('startup batch department user')
    .sort({ 'startup.founded': -1 })
    .lean();

  res.json({ success: true, data: startups });
});
