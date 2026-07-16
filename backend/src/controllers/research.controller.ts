import { Response, NextFunction } from 'express';
import ResearchProject from '../models/ResearchProject';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getResearchProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 12, domain, status, type, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = { isPublic: true, deletedAt: { $exists: false } };
  if (domain) filter.domain = new RegExp(domain as string, 'i');
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (search) filter.$text = { $search: search as string };

  const [projects, total] = await Promise.all([
    ResearchProject.find(filter)
      .populate('pi', 'firstName lastName avatar role')
      .populate('coInvestigators', 'firstName lastName avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    ResearchProject.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: projects,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const getResearchProject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const project = await ResearchProject.findOne({ _id: req.params.projectId, deletedAt: { $exists: false } })
    .populate('pi', 'firstName lastName avatar bio role')
    .populate('coInvestigators', 'firstName lastName avatar')
    .populate('collaborators.user', 'firstName lastName avatar');
  if (!project) return next(new AppError('Project not found.', 404));
  await ResearchProject.findByIdAndUpdate(req.params.projectId, { $inc: { views: 1 } });
  res.json({ success: true, data: project });
});

export const createResearchProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await ResearchProject.create({ ...req.body, pi: req.user._id });
  res.status(201).json({ success: true, data: project });
});

export const updateResearchProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const project = await ResearchProject.findByIdAndUpdate(req.params.projectId, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: project });
});

export const deleteResearchProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  await ResearchProject.findByIdAndUpdate(req.params.projectId, {
    deletedAt: new Date(),
    deletedBy: req.user._id,
    deletionReason: 'Deleted by PI/admin.',
  });
  res.json({ success: true, message: 'Research project removed.' });
});

export const applyToResearchProject = asyncHandler(async (req: any, res: Response) => {
  const project = req.resource; // retrieve directly from middleware cache
  project.applications.push({
    user: req.user._id,
    message: req.body.message,
    appliedAt: new Date(),
    status: 'pending',
  });
  await project.save();

  res.json({ success: true, message: 'Application submitted.' });
});
