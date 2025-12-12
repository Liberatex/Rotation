import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authRateLimiter } from '../middleware/rateLimiter';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/password-reset-request', authRateLimiter, authController.requestPasswordReset);
router.post('/password-reset', authRateLimiter, authController.resetPassword);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);

export default router;

