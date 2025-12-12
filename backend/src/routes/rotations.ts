import { Router } from 'express';
import { rotationController } from '../controllers/rotationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', rotationController.create);
router.get('/:id', rotationController.getById);
router.put('/:id', rotationController.update);
router.post('/:id/start', rotationController.start);
router.post('/:id/pause', rotationController.pause);
router.post('/:id/resume', rotationController.resume);
router.post('/:id/end', rotationController.end);
router.post('/:id/pass', rotationController.pass);
router.get('/:id/turns', rotationController.getTurns);
router.get('/:id/history', rotationController.getHistory);

export default router;

