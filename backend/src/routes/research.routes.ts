import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { protect, optionalAuth } from '../middleware/auth';
import ResearchProject from '../models/ResearchProject';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 12, domain, status, type, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = { isPublic: true };
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

  res.json({ success: true, data: projects, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
}));

router.get('/:projectId', optionalAuth, asyncHandler(async (req: AuthRequest, res, next) => {
  const project = await ResearchProject.findById(req.params.projectId)
    .populate('pi', 'firstName lastName avatar bio role')
    .populate('coInvestigators', 'firstName lastName avatar')
    .populate('collaborators.user', 'firstName lastName avatar');
  if (!project) return next(new AppError('Project not found.', 404));
  await ResearchProject.findByIdAndUpdate(req.params.projectId, { $inc: { views: 1 } });
  res.json({ success: true, data: project });
}));

router.use(protect);

router.post('/', asyncHandler(async (req: AuthRequest, res) => {
  const project = await ResearchProject.create({ ...req.body, pi: req.user._id });
  res.status(201).json({ success: true, data: project });
}));

router.post('/:projectId/apply', asyncHandler(async (req: AuthRequest, res, next) => {
  const project = await ResearchProject.findById(req.params.projectId);
  if (!project) return next(new AppError('Project not found.', 404));

  const alreadyApplied = project.applications.some(
    (a: any) => a.user.toString() === req.user._id.toString()
  );
  if (alreadyApplied) return next(new AppError('Already applied.', 400));

  project.applications.push({
    user: req.user._id,
    message: req.body.message,
    appliedAt: new Date(),
    status: 'pending',
  });
  await project.save();

  res.json({ success: true, message: 'Application submitted.' });
}));

export default router;
