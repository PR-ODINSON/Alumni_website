import { Response, NextFunction } from 'express';
import Job from '../models/Job';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const job = await Job.create({ ...req.body, postedBy: req.user._id });
  await job.populate('postedBy', 'firstName lastName avatar role');
  res.status(201).json({ success: true, data: job });
});

export const getJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    page = 1, limit = 20, search, jobType, industry, location, locationType,
    category, isReferralAvailable, sort = '-createdAt', experience,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const filter: any = { isActive: true };

  if (jobType) filter.jobType = jobType;
  if (industry) filter.industry = new RegExp(industry as string, 'i');
  if (location) filter.location = new RegExp(location as string, 'i');
  if (locationType) filter.locationType = locationType;
  if (category) filter.category = new RegExp(category as string, 'i');
  if (isReferralAvailable === 'true') filter.isReferralAvailable = true;
  if (experience) filter['experience.max'] = { $gte: Number(experience) };
  if (search) {
    filter.$text = { $search: search as string };
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate('postedBy', 'firstName lastName avatar currentCompany currentDesignation')
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Job.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: jobs,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const getJob = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const job = await Job.findById(req.params.jobId).populate('postedBy', 'firstName lastName avatar role bio');
  if (!job) return next(new AppError('Job not found.', 404));
  await Job.findByIdAndUpdate(req.params.jobId, { $inc: { views: 1 } });
  res.json({ success: true, data: job });
});

export const updateJob = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return next(new AppError('Job not found.', 404));
  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized.', 403));
  }
  const updated = await Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: updated });
});

export const deleteJob = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return next(new AppError('Job not found.', 404));
  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized.', 403));
  }
  await Job.findByIdAndDelete(req.params.jobId);
  res.json({ success: true, message: 'Job removed.' });
});

export const applyToJob = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return next(new AppError('Job not found.', 404));
  if (!job.isActive) return next(new AppError('This position is no longer active.', 400));

  const alreadyApplied = job.applicants.some((a: any) => a.user.toString() === req.user._id.toString());
  if (alreadyApplied) return next(new AppError('You have already applied to this job.', 400));

  job.applicants.push({
    user: req.user._id,
    appliedAt: new Date(),
    status: 'applied',
    resumeUrl: req.body.resumeUrl,
    coverLetter: req.body.coverLetter,
  });

  await job.save();
  res.json({ success: true, message: 'Application submitted successfully.' });
});

export const saveJob = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return next(new AppError('Job not found.', 404));

  const userId = req.user._id;
  const isSaved = job.savedBy.includes(userId);

  if (isSaved) {
    job.savedBy = job.savedBy.filter((id: any) => id.toString() !== userId.toString());
  } else {
    job.savedBy.push(userId);
  }

  await job.save();
  res.json({ success: true, isSaved: !isSaved });
});

export const getSavedJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const jobs = await Job.find({ savedBy: req.user._id, isActive: true })
    .populate('postedBy', 'firstName lastName avatar')
    .sort('-createdAt');
  res.json({ success: true, data: jobs });
});

export const getMyApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const jobs = await Job.find({ 'applicants.user': req.user._id })
    .populate('postedBy', 'firstName lastName avatar')
    .select('title company location jobType applicants.$')
    .sort('-createdAt');
  res.json({ success: true, data: jobs });
});

export const getMyPostedJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: jobs });
});

export const updateApplicationStatus = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { jobId, applicantId } = req.params;
  const { status, notes } = req.body;

  const job = await Job.findById(jobId);
  if (!job) return next(new AppError('Job not found.', 404));
  if (job.postedBy.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized.', 403));
  }

  const applicant = job.applicants.find((a: any) => a.user.toString() === applicantId);
  if (!applicant) return next(new AppError('Applicant not found.', 404));

  applicant.status = status;
  if (notes) applicant.notes = notes;
  await job.save();

  res.json({ success: true, message: 'Application status updated.' });
});
