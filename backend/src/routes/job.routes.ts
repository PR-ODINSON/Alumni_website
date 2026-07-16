import { Router } from 'express';
import {
  createJob, getJobs, getJob, updateJob, deleteJob,
  applyToJob, saveJob, getSavedJobs, getMyApplications,
  getMyPostedJobs, updateApplicationStatus,
} from '../controllers/job.controller';
import { protect, optionalAuth } from '../middleware/auth';
import { requirePermission, requirePolicy } from '../middleware/authorization';

const router = Router();

router.get('/', optionalAuth, getJobs);
router.get('/:jobId', optionalAuth, getJob);

router.use(protect);
router.post('/', requirePermission('job:create'), createJob);
router.put('/:jobId', requirePolicy('job:update', 'Job', 'jobId'), updateJob);
router.delete('/:jobId', requirePolicy('job:delete', 'Job', 'jobId'), deleteJob);
router.post('/:jobId/apply', requirePolicy('job:apply', 'Job', 'jobId'), applyToJob);
router.post('/:jobId/save', saveJob);
router.get('/me/saved', getSavedJobs);
router.get('/me/applications', getMyApplications);
router.get('/me/posted', getMyPostedJobs);
router.patch('/:jobId/applicants/:applicantId/status', requirePolicy('job:update', 'Job', 'jobId'), updateApplicationStatus);

export default router;
