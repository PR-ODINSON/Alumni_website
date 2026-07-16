import { Router } from 'express';
import {
  createEvent, getEvents, getEvent, updateEvent, deleteEvent,
  registerForEvent, cancelRegistration, getMyEvents, addToGallery,
} from '../controllers/event.controller';
import { protect, optionalAuth } from '../middleware/auth';
import { requirePermission, requirePolicy } from '../middleware/authorization';

const router = Router();

router.get('/', optionalAuth, getEvents);
router.get('/:eventId', optionalAuth, getEvent);

router.use(protect);
router.post('/', requirePermission('event:create'), createEvent);
router.put('/:eventId', requirePolicy('event:update', 'Event', 'eventId'), updateEvent);
router.delete('/:eventId', requirePolicy('event:delete', 'Event', 'eventId'), deleteEvent);
router.post('/:eventId/register', requirePolicy('event:register', 'Event', 'eventId'), registerForEvent);
router.delete('/:eventId/register', cancelRegistration);
router.get('/me/registered', getMyEvents);
router.post('/:eventId/gallery', requirePolicy('event:update', 'Event', 'eventId'), addToGallery);

export default router;
