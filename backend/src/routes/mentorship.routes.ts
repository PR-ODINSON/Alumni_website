import { Router } from 'express';
import {
  requestMentorship, respondToRequest, scheduleSession, updateSession,
  getMentorships, getMentorship, submitFeedback, completeMentorship,
} from '../controllers/mentorship.controller';
import { protect } from '../middleware/auth';
import { requirePolicy } from '../middleware/authorization';

const router = Router();
router.use(protect);

router.post('/request', requestMentorship);
router.get('/', getMentorships);
router.get('/:mentorshipId', getMentorship);
router.patch('/:mentorshipId/respond', requirePolicy('mentor:accept', 'Mentorship', 'mentorshipId'), respondToRequest);
router.post('/:mentorshipId/sessions', requirePolicy('mentor:manage', 'Mentorship', 'mentorshipId'), scheduleSession);
router.patch('/:mentorshipId/sessions/:sessionId', requirePolicy('mentor:manage', 'Mentorship', 'mentorshipId'), updateSession);
router.post('/:mentorshipId/feedback', requirePolicy('mentor:manage', 'Mentorship', 'mentorshipId'), submitFeedback);
router.patch('/:mentorshipId/complete', requirePolicy('mentor:manage', 'Mentorship', 'mentorshipId'), completeMentorship);

export default router;
