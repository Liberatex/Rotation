import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { testDatabaseConnection } from './config/database';
import { apiRateLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { initializeWebSocket } from './websocket';

const app = express();
const httpServer = createServer(app);

// Security middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(apiRateLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'ROTATION API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
import authRoutes from './routes/auth';
import sessionRoutes from './routes/sessions';
import rotationRoutes from './routes/rotations';

app.use(`/api/${config.apiVersion}/auth`, authRoutes);
app.use(`/api/${config.apiVersion}/sessions`, sessionRoutes);
app.use(`/api/${config.apiVersion}/rotations`, rotationRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize WebSocket
const io = initializeWebSocket(httpServer);

// Start server
const startServer = async () => {
  try {
    await testDatabaseConnection();
    
    const port = process.env.PORT || config.port;
    httpServer.listen(port, () => {
      logger.info(`🚀 Server running on port ${port}`);
      logger.info(`📝 Environment: ${config.nodeEnv}`);
      logger.info(`🔗 API: http://localhost:${port}/api/${config.apiVersion}`);
      logger.info(`🔌 WebSocket: ws://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { io };

