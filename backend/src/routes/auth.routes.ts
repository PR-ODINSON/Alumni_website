import { Router } from 'express';
import passport from 'passport';
import { body } from 'express-validator';
import {
  register, login, logout, getMe, verifyEmail,
  forgotPassword, resetPassword, refreshToken,
  googleCallback, updatePassword, completeOnboarding,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post('/register', authLimiter, [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['student', 'alumni', 'faculty']),
], validateRequest, register);

router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], validateRequest, login);

router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPassword);
router.post('/refresh-token', refreshToken);

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
  }),
  googleCallback
);

router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);
router.put('/update-password', updatePassword);
router.post('/complete-onboarding', completeOnboarding);

export default router;
