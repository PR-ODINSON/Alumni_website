import { Router } from 'express';
import {
  sendConnectionRequest, respondToRequest, getConnections,
  getPendingRequests, getConnectionStatus, removeConnection, getMutualConnections,
} from '../controllers/connection.controller';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);

router.get('/pending', getPendingRequests);
router.get('/status/:userId', getConnectionStatus);
router.get('/mutual/:userId', getMutualConnections);
router.get('/:userId', getConnections);
router.post('/request/:userId', sendConnectionRequest);
router.patch('/:connectionId/respond', respondToRequest);
router.delete('/:connectionId', removeConnection);

export default router;
