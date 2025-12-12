import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload } from '../types';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ success: false, error: 'Authentication token required' });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ success: false, error: 'Invalid or expired token' });
      return;
    }
    res.status(500).json({ success: false, error: 'Authentication error' });
  }
};

export const requireMBA = async (
  _req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  // This middleware will check if user is MBA of the session
  // Implementation depends on session context
  // For now, we'll add a helper function to check MBA status
  next();
};

