import { Router } from 'express';
import { protect } from '../middleware/auth';
import { requirePermission } from '../middleware/authorization';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import FeatureFlag from '../models/FeatureFlag';
import { logAudit } from '../utils/auditLogger';

const router = Router();
router.use(protect);

// 1. Fetch all feature flags (Any authenticated user can fetch list to adjust features client-side)
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const flags = await FeatureFlag.find({}).lean();
    res.json({
      success: true,
      data: flags,
    });
  })
);

// 2. Toggle a feature flag (Admin only)
router.post(
  '/toggle',
  requirePermission('admin:feature_flag_manage'),
  asyncHandler(async (req: any, res, next) => {
    const { key, isEnabled, name, description } = req.body;

    if (!key) return next(new AppError('Feature flag key is required.', 400));

    let flag = await FeatureFlag.findOne({ key });
    let previousValue = false;

    if (flag) {
      previousValue = flag.isEnabled;
      flag.isEnabled = isEnabled !== undefined ? isEnabled : !flag.isEnabled;
      if (name) flag.name = name;
      if (description) flag.description = description;
      flag.updatedBy = req.user._id;
      await flag.save();
    } else {
      flag = await FeatureFlag.create({
        name: name || key,
        key,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        description: description || '',
        updatedBy: req.user._id,
      });
    }

    // Log Audit
    await logAudit({
      actor: req.user._id,
      action: 'FEATURE_FLAG_TOGGLE',
      resource: 'FeatureFlag',
      resourceId: flag._id.toString(),
      previousValues: { isEnabled: previousValue },
      newValues: { isEnabled: flag.isEnabled },
      changedFields: ['isEnabled'],
      reason: `Flag key '${key}' toggled to ${flag.isEnabled}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      message: `Feature flag '${key}' updated successfully.`,
      data: flag,
    });
  })
);

export default router;
