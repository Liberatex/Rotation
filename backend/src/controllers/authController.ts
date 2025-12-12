import { Request, Response } from 'express';
import { pool } from '../config/database';
import { generateTokens } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, firebaseUid, displayName } = req.body;

      if (!email || !firebaseUid) {
        throw new AppError('Email and Firebase UID are required', 400);
      }

      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 OR firebase_uid = $2',
        [email, firebaseUid]
      );

      if (existingUser.rows.length > 0) {
        throw new AppError('User already exists', 409);
      }

      // Create user
      const userResult = await pool.query(
        'INSERT INTO users (email, firebase_uid) VALUES ($1, $2) RETURNING id, email, firebase_uid, created_at',
        [email, firebaseUid]
      );

      const user = userResult.rows[0];

      // Create user profile
      await pool.query(
        'INSERT INTO user_profiles (user_id, display_name) VALUES ($1, $2)',
        [user.id, displayName || email.split('@')[0]]
      );

      // Create free subscription
      await pool.query(
        'INSERT INTO subscriptions (user_id, tier, status) VALUES ($1, $2, $3)',
        [user.id, 'free', 'active']
      );

      // Generate tokens
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        firebaseUid: user.firebase_uid,
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
          },
          tokens,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Registration failed', 500);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, firebaseUid } = req.body;

      if (!email || !firebaseUid) {
        throw new AppError('Email and Firebase UID are required', 400);
      }

      // Find user
      const userResult = await pool.query(
        'SELECT id, email, firebase_uid FROM users WHERE email = $1 AND firebase_uid = $2',
        [email, firebaseUid]
      );

      if (userResult.rows.length === 0) {
        throw new AppError('Invalid credentials', 401);
      }

      const user = userResult.rows[0];

      // Generate tokens
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        firebaseUid: user.firebase_uid,
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
          },
          tokens,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Login failed', 500);
    }
  }

  async refreshToken(_req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = _req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
      }

      // Verify refresh token (implementation depends on your JWT utils)
      // For now, we'll use a simplified approach
      // In production, you should verify the token and check if it's in Redis/DB

      res.json({
        success: true,
        message: 'Token refresh endpoint - to be implemented',
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Token refresh failed', 500);
    }
  }

  async requestPasswordReset(_req: Request, res: Response): Promise<void> {
    // Password reset handled by Firebase Auth
    res.json({
      success: true,
      message: 'Password reset request handled by Firebase Auth',
    });
  }

  async resetPassword(_req: Request, res: Response): Promise<void> {
    // Password reset handled by Firebase Auth
    res.json({
      success: true,
      message: 'Password reset handled by Firebase Auth',
    });
  }

  async logout(_req: AuthRequest, res: Response): Promise<void> {
    // In a full implementation, you would invalidate the refresh token in Redis/DB
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}

export const authController = new AuthController();

