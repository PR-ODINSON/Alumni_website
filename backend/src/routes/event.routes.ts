import { Router } from 'express';
import {
  createEvent, getEvents, getEvent, updateEvent, deleteEvent,
  registerForEvent, cancelRegistration, getMyEvents, addToGallery,
} from '../controllers/event.controller';
import { protect, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getEvents);
router.get('/:eventId', optionalAuth, getEvent);

router.use(protect);
router.post('/', authorize('alumni', 'faculty', 'admin'), createEvent);
router.put('/:eventId', updateEvent);
router.delete('/:eventId', deleteEvent);
router.post('/:eventId/register', registerForEvent);
router.delete('/:eventId/register', cancelRegistration);
router.get('/me/registered', getMyEvents);
router.post('/:eventId/gallery', addToGallery);

export default router;
