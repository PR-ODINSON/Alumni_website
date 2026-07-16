import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth';
import { requirePermission, requirePolicy } from '../middleware/authorization';
import {
  getResearchProjects,
  getResearchProject,
  createResearchProject,
  updateResearchProject,
  deleteResearchProject,
  applyToResearchProject,
} from '../controllers/research.controller';

const router = Router();

router.get('/', optionalAuth, getResearchProjects);
router.get('/:projectId', optionalAuth, getResearchProject);

router.use(protect);

router.post('/', requirePermission('research:create'), createResearchProject);
router.put('/:projectId', requirePolicy('research:update', 'ResearchProject', 'projectId'), updateResearchProject);
router.delete('/:projectId', requirePolicy('research:delete', 'ResearchProject', 'projectId'), deleteResearchProject);
router.post('/:projectId/apply', requirePolicy('research:apply', 'ResearchProject', 'projectId'), applyToResearchProject);

export default router;
