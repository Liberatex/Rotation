import { Router } from 'express';
import { sessionController } from '../controllers/sessionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', sessionController.create);
router.get('/:id', sessionController.getById);
router.put('/:id', sessionController.update);
router.delete('/:id', sessionController.delete);
router.post('/:id/join', sessionController.join);
router.post('/:id/leave', sessionController.leave);
router.get('/:id/participants', sessionController.getParticipants);
router.post('/:id/participants', sessionController.addParticipant);
router.delete('/:id/participants/:userId', sessionController.removeParticipant);

export default router;

