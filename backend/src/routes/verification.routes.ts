import { Router } from 'express';
import { protect } from '../middleware/auth';
import { requirePermission } from '../middleware/authorization';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import User from '../models/User';
import { logAudit } from '../utils/auditLogger';

const router = Router();
router.use(protect);

// 1. Submit documents for verification
router.post(
  '/submit',
  asyncHandler(async (req: any, res, next) => {
    const { documents } = req.body;
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return next(new AppError('Verification documents are required.', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('User not found.', 404));

    user.verificationDocuments = documents;
    user.verificationStatus = 'under_review';
    user.verificationHistory.push({
      status: 'under_review',
      notes: 'Submitted verification documents.',
      updatedAt: new Date(),
    });

    await user.save();

    res.json({
      success: true,
      message: 'Verification request submitted successfully.',
      data: { verificationStatus: user.verificationStatus },
    });
  })
);

// 2. Fetch the verification queue (Admin only)
router.get(
  '/queue',
  requirePermission('users:verify'),
  asyncHandler(async (req: any, res) => {
    const { page = 1, limit = 20, status = 'under_review' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find({ verificationStatus: status })
        .select('firstName lastName email role verificationStatus verificationDocuments createdAt')
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      User.countDocuments({ verificationStatus: status }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  })
);

// 3. Review a verification request (Admin only)
router.post(
  '/review/:userId',
  requirePermission('users:verify'),
  asyncHandler(async (req: any, res, next) => {
    const { status, notes } = req.body;
    const { userId } = req.params;

    if (!['verified', 'rejected', 'suspended'].includes(status)) {
      return next(new AppError('Invalid verification status selection.', 400));
    }

    const user = await User.findById(userId);
    if (!user) return next(new AppError('User not found.', 404));

    const previousStatus = user.verificationStatus;
    user.verificationStatus = status;
    user.verificationHistory.push({
      status,
      updatedBy: req.user._id,
      notes: notes || `Verification status updated to ${status}.`,
      updatedAt: new Date(),
    });

    await user.save();

    // Log Audit
    await logAudit({
      actor: req.user._id,
      action: 'USER_VERIFY',
      resource: 'User',
      resourceId: user._id.toString(),
      previousValues: { verificationStatus: previousStatus },
      newValues: { verificationStatus: status },
      changedFields: ['verificationStatus'],
      reason: notes,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: `User verification status updated to: ${status}`,
      data: { verificationStatus: user.verificationStatus },
    });
  })
);

export default router;
