import { Router } from 'express';
import { protect } from '../middleware/auth';
import { requirePermission } from '../middleware/authorization';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import Report from '../models/Report';
import User from '../models/User';
import Post, { Comment } from '../models/Post';
import Job from '../models/Job';
import Event from '../models/Event';
import ResearchProject from '../models/ResearchProject';
import SuccessStory from '../models/SuccessStory';
import { logAudit } from '../utils/auditLogger';

const router = Router();
router.use(protect);

// 1. Submit a report
router.post(
  '/',
  asyncHandler(async (req: any, res, next) => {
    const { targetType, targetId, reason, details } = req.body;

    if (!targetType || !targetId || !reason || !details) {
      return next(new AppError('All reporting fields are required.', 400));
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      details,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Content is being moderated.',
      data: report,
    });
  })
);

// 2. View reports queue (Admin only)
router.get(
  '/',
  requirePermission('report:review'),
  asyncHandler(async (req: any, res) => {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (status) filter.status = status;

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate('reporter', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Report.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  })
);

// 3. Take action on a report (Admin only)
router.post(
  '/:reportId/action',
  requirePermission('report:review'),
  asyncHandler(async (req: any, res, next) => {
    const { status, actionTaken, notes } = req.body;
    const { reportId } = req.params;

    if (!['resolved', 'dismissed'].includes(status)) {
      return next(new AppError('Invalid resolution status.', 400));
    }

    const report = await Report.findById(reportId);
    if (!report) return next(new AppError('Report not found.', 404));

    const previousStatus = report.status;
    report.status = status;
    report.moderatedBy = req.user._id;
    report.actionTaken = actionTaken || 'none';
    report.resolutionNotes = notes;
    report.history.push({
      status,
      updatedBy: req.user._id,
      notes,
      actionTaken,
      updatedAt: new Date(),
    });

    await report.save();

    // Perform the moderation action on target resource
    if (status === 'resolved' && actionTaken === 'deleted') {
      const ModelMap: Record<string, any> = {
        User, Post, Job, Event, ResearchProject, SuccessStory, Comment
      };
      const Model = ModelMap[report.targetType];
      if (Model) {
        // Soft delete the resource
        await Model.findByIdAndUpdate(report.targetId, {
          deletedAt: new Date(),
          deletedBy: req.user._id,
          deletionReason: `Moderation action taken: ${notes}`,
          isActive: false, // Compatibility toggle
          isPublished: false, // Compatibility toggle
        });
      }
    } else if (status === 'resolved' && actionTaken === 'banned' && report.targetType === 'User') {
      await User.findByIdAndUpdate(report.targetId, {
        isBanned: true,
        banReason: notes,
        isActive: false,
      });
    }

    // Log Audit
    await logAudit({
      actor: req.user._id,
      action: 'REPORT_RESOLVE',
      resource: 'Report',
      resourceId: report._id.toString(),
      previousValues: { status: previousStatus },
      newValues: { status, actionTaken },
      changedFields: ['status', 'actionTaken'],
      reason: notes,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: `Report status updated to: ${status} with action: ${actionTaken}`,
      data: report,
    });
  })
);

export default router;
