import { Router } from 'express';
import {
  getAlumniDirectory, getAlumniProfile, updateAlumniProfile,
  addCareerEntry, updateCareerEntry, deleteCareerEntry,
  getMentors, getAlumniStats, getDistinguishedAlumni, getStartupEcosystem,
} from '../controllers/alumni.controller';
import { protect, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getAlumniDirectory);
router.get('/stats', getAlumniStats);
router.get('/distinguished', getDistinguishedAlumni);
router.get('/startups', getStartupEcosystem);
router.get('/mentors', optionalAuth, getMentors);
router.get('/:userId', optionalAuth, getAlumniProfile);

router.use(protect);
router.put('/profile/me', authorize('alumni'), updateAlumniProfile);
router.post('/profile/career', authorize('alumni'), addCareerEntry);
router.put('/profile/career/:entryId', authorize('alumni'), updateCareerEntry);
router.delete('/profile/career/:entryId', authorize('alumni'), deleteCareerEntry);

export default router;
