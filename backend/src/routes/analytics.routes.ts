import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { protect, authorize } from '../middleware/auth';
import Alumni from '../models/Alumni';
import User from '../models/User';
import Job from '../models/Job';
import Event from '../models/Event';
import Post from '../models/Post';
import Mentorship from '../models/Mentorship';
import { AuthRequest } from '../middleware/auth';

const router = Router();
router.use(protect);

router.get('/overview', asyncHandler(async (_req: AuthRequest, res) => {
  const [
    totalAlumni, totalStudents, totalJobs, totalEvents,
    totalPosts, activeMentorships, verifiedAlumni,
  ] = await Promise.all([
    User.countDocuments({ role: 'alumni', isActive: true }),
    User.countDocuments({ role: 'student', isActive: true }),
    Job.countDocuments({ isActive: true }),
    Event.countDocuments({ isPublished: true, startDate: { $gte: new Date() } }),
    Post.countDocuments({ isPublished: true }),
    Mentorship.countDocuments({ status: 'active' }),
    Alumni.countDocuments({ verificationStatus: 'verified' }),
  ]);

  res.json({
    success: true,
    data: { totalAlumni, totalStudents, totalJobs, totalEvents, totalPosts, activeMentorships, verifiedAlumni },
  });
}));

router.get('/alumni-distribution', asyncHandler(async (_req: AuthRequest, res) => {
  const [byDepartment, byBatch, byIndustry, byEmploymentStatus, byDegree] = await Promise.all([
    Alumni.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Alumni.aggregate([
      { $group: { _id: '$batch', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Alumni.aggregate([
      { $match: { currentIndustry: { $ne: '' } } },
      { $group: { _id: '$currentIndustry', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]),
    Alumni.aggregate([
      { $group: { _id: '$employmentStatus', count: { $sum: 1 } } },
    ]),
    Alumni.aggregate([
      { $group: { _id: '$degreeType', count: { $sum: 1 } } },
    ]),
  ]);

  res.json({ success: true, data: { byDepartment, byBatch, byIndustry, byEmploymentStatus, byDegree } });
}));

router.get('/global-presence', asyncHandler(async (_req: AuthRequest, res) => {
  const globalData = await Alumni.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
    { $unwind: '$userInfo' },
    {
      $group: {
        _id: {
          country: '$userInfo.location.country',
          city: '$userInfo.location.city',
        },
        count: { $sum: 1 },
        industries: { $addToSet: '$currentIndustry' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.json({ success: true, data: globalData });
}));

router.get('/placement-stats', asyncHandler(async (_req: AuthRequest, res) => {
  const currentYear = new Date().getFullYear();
  const stats = await Alumni.aggregate([
    {
      $group: {
        _id: '$batch',
        total: { $sum: 1 },
        employed: {
          $sum: { $cond: [{ $in: ['$employmentStatus', ['employed', 'self-employed', 'entrepreneur']] }, 1, 0] },
        },
        higherStudies: {
          $sum: { $cond: [{ $eq: ['$employmentStatus', 'higher-studies'] }, 1, 0] },
        },
        entrepreneurs: {
          $sum: { $cond: [{ $eq: ['$employmentStatus', 'entrepreneur'] }, 1, 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, data: stats, currentYear });
}));

router.get('/startup-stats', asyncHandler(async (_req: AuthRequest, res) => {
  const startups = await Alumni.aggregate([
    { $match: { 'startup.name': { $exists: true, $ne: '' } } },
    {
      $group: {
        _id: '$startup.stage',
        count: { $sum: 1 },
        sectors: { $addToSet: '$startup.sector' },
      },
    },
  ]);

  const topSectors = await Alumni.aggregate([
    { $match: { 'startup.sector': { $exists: true, $ne: '' } } },
    { $group: { _id: '$startup.sector', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const totalStartups = await Alumni.countDocuments({ 'startup.name': { $exists: true, $ne: '' } });

  res.json({ success: true, data: { startups, topSectors, totalStartups } });
}));

export default router;
