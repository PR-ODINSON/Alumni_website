import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth';
import { requirePermission, requirePolicy } from '../middleware/authorization';
import {
  getSuccessStories,
  getSuccessStory,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  likeSuccessStory,
} from '../controllers/successStory.controller';

const router = Router();

router.get('/', optionalAuth, getSuccessStories);
router.get('/:storyId', optionalAuth, getSuccessStory);

router.use(protect);

router.post('/', requirePermission('story:create'), createSuccessStory);
router.put('/:storyId', requirePolicy('story:update', 'SuccessStory', 'storyId'), updateSuccessStory);
router.delete('/:storyId', requirePolicy('story:delete', 'SuccessStory', 'storyId'), deleteSuccessStory);
router.post('/:storyId/like', likeSuccessStory);

export default router;
