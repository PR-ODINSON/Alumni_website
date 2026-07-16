import { Router } from 'express';
import { protect } from '../middleware/auth';
import { requirePermission } from '../middleware/authorization';
import { asyncHandler } from '../middleware/errorHandler';
import AuditLog from '../models/AuditLog';

const router = Router();
router.use(protect);
router.use(requirePermission('admin:audit_log_view'));

// Fetch paginated, filterable audit logs
router.get(
  '/',
  asyncHandler(async (req: any, res) => {
    const { page = 1, limit = 20, action, resource, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    
    if (search) {
      filter.$or = [
        { reason: new RegExp(search as string, 'i') },
        { action: new RegExp(search as string, 'i') },
        { resource: new RegExp(search as string, 'i') },
      ];
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('actor', 'firstName lastName email role')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  })
);

export default router;
