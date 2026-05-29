import { Router } from 'express';
import {
  requestMentorship, respondToRequest, scheduleSession, updateSession,
  getMentorships, getMentorship, submitFeedback, completeMentorship,
} from '../controllers/mentorship.controller';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);

router.post('/request', requestMentorship);
router.get('/', getMentorships);
router.get('/:mentorshipId', getMentorship);
router.patch('/:mentorshipId/respond', respondToRequest);
router.post('/:mentorshipId/sessions', scheduleSession);
router.patch('/:mentorshipId/sessions/:sessionId', updateSession);
router.post('/:mentorshipId/feedback', submitFeedback);
router.patch('/:mentorshipId/complete', completeMentorship);

export default router;
