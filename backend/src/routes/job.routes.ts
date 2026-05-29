import { Router } from 'express';
import {
  createJob, getJobs, getJob, updateJob, deleteJob,
  applyToJob, saveJob, getSavedJobs, getMyApplications,
  getMyPostedJobs, updateApplicationStatus,
} from '../controllers/job.controller';
import { protect, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getJobs);
router.get('/:jobId', optionalAuth, getJob);

router.use(protect);
router.post('/', authorize('alumni', 'faculty', 'admin'), createJob);
router.put('/:jobId', updateJob);
router.delete('/:jobId', deleteJob);
router.post('/:jobId/apply', applyToJob);
router.post('/:jobId/save', saveJob);
router.get('/me/saved', getSavedJobs);
router.get('/me/applications', getMyApplications);
router.get('/me/posted', getMyPostedJobs);
router.patch('/:jobId/applicants/:applicantId/status', updateApplicationStatus);

export default router;
