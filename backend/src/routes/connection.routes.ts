import { Router } from 'express';
import {
  sendConnectionRequest, respondToRequest, getConnections,
  getPendingRequests, getConnectionStatus, removeConnection, getMutualConnections,
} from '../controllers/connection.controller';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);

router.post('/request/:userId', sendConnectionRequest);
router.patch('/:connectionId/respond', respondToRequest);
router.get('/pending', getPendingRequests);
router.get('/:userId', getConnections);
router.get('/status/:userId', getConnectionStatus);
router.delete('/:connectionId', removeConnection);
router.get('/mutual/:userId', getMutualConnections);

export default router;
