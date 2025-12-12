import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import your routes (adjust paths as needed)
// Note: You'll need to copy your route files or import from parent directory

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ROTATION API is running on Firebase Functions',
    timestamp: new Date().toISOString(),
  });
});

// API routes would go here
// For now, this is a basic setup
// You'll need to adapt your existing routes for Firebase Functions

// Export Firebase Function
export const api = functions
  .region('us-central1')
  .https.onRequest(app);

// Note: WebSocket (Socket.io) is not supported in Firebase Functions
// Consider using Firebase Realtime Database or deploying WebSocket server separately

