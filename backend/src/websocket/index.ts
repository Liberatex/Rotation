import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload } from '../types';
import { pool } from '../config/database';

export function initializeWebSocket(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: config.cors,
    path: '/socket.io',
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      (socket as any).user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user as JWTPayload;
    console.log(`User connected: ${user.userId}`);

    // Join session room
    socket.on('join_session', async (sessionId: string) => {
      // Verify user is participant
      const participantCheck = await pool.query(
        'SELECT id FROM session_participants WHERE session_id = $1 AND user_id = $2',
        [sessionId, user.userId]
      );

      if (participantCheck.rows.length > 0) {
        socket.join(`session:${sessionId}`);
        socket.emit('joined_session', { sessionId });
        
        // Notify others
        socket.to(`session:${sessionId}`).emit('participant_joined', {
          userId: user.userId,
          sessionId,
        });
      } else {
        socket.emit('error', { message: 'Not a participant in this session' });
      }
    });

    // Leave session room
    socket.on('leave_session', (sessionId: string) => {
      socket.leave(`session:${sessionId}`);
      socket.to(`session:${sessionId}`).emit('participant_left', {
        userId: user.userId,
        sessionId,
      });
    });

    // Rotation events
    socket.on('rotation_started', (data: { rotationId: string; sessionId: string }) => {
      socket.to(`session:${data.sessionId}`).emit('rotation_started', data);
    });

    socket.on('turn_changed', (data: { rotationId: string; sessionId: string; userId: string }) => {
      socket.to(`session:${data.sessionId}`).emit('turn_changed', data);
    });

    socket.on('timer_alert', (data: { rotationId: string; sessionId: string; alertType: string }) => {
      socket.to(`session:${data.sessionId}`).emit('timer_alert', data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.userId}`);
    });
  });

  return io;
}

