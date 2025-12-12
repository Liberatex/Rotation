import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '../config/env';
import { apiRateLimiter } from '../middleware/rateLimiter';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Import routes
import authRoutes from '../routes/auth';
import sessionRoutes from '../routes/sessions';
import rotationRoutes from '../routes/rotations';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins in Firebase Functions
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(apiRateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ROTATION API is running',
    timestamp: new Date().toISOString(),
    environment: 'firebase-functions',
  });
});

// API routes
app.use(`/api/${config.apiVersion}/auth`, authRoutes);
app.use(`/api/${config.apiVersion}/sessions`, sessionRoutes);
app.use(`/api/${config.apiVersion}/rotations`, rotationRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Export Firebase Function
export const api = functions
  .region('us-central1') // Change to your preferred region
  .https.onRequest(app);

// Note: WebSocket support requires a separate service
// Consider using Firebase Realtime Database or a separate WebSocket server
// on Railway, Render, or similar platform

