import { io, Socket } from 'socket.io-client';
import env from '../config/env';
import { getAuthTokens } from '../utils/storage';
import { store } from '../store/store';
import { updateSessionLocal, addParticipantLocal, removeParticipantLocal } from '../store/slices/sessionSlice';
import { setCurrentRotation, updateRotationLocal, updateTimer } from '../store/slices/rotationSlice';

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private timerInterval: NodeJS.Timeout | null = null;

  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    try {
      const tokens = await getAuthTokens();
      if (!tokens?.accessToken) {
        console.warn('No auth token available for WebSocket connection');
        return;
      }

      this.socket = io(env.wsUrl, {
        auth: {
          token: tokens.accessToken,
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.stopTimer();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
    });

    // Session events
    this.socket.on('session_updated', (data: any) => {
      store.dispatch(updateSessionLocal(data));
    });

    this.socket.on('participant_joined', (data: { userId: string; sessionId: string }) => {
      // Fetch updated participant list
      // For now, just dispatch a local update
      store.dispatch(addParticipantLocal(data as any));
    });

    this.socket.on('participant_left', (data: { userId: string; sessionId: string }) => {
      store.dispatch(removeParticipantLocal(data.userId));
    });

    // Rotation events
    this.socket.on('rotation_started', (data: any) => {
      store.dispatch(setCurrentRotation(data));
      this.startTimer(data.timerDuration);
    });

    this.socket.on('turn_changed', (data: { rotationId: string; userId: string; sessionId: string }) => {
      // Fetch updated rotation
      // For now, update local state
      store.dispatch(updateRotationLocal({ currentTurnUserId: data.userId }));
      const rotation = store.getState().rotation.currentRotation;
      if (rotation) {
        this.startTimer(rotation.timerDuration);
      }
    });

    this.socket.on('timer_alert', (data: { rotationId: string; alertType: string }) => {
      // Handle timer alerts (80%, 100%)
      console.log('Timer alert:', data.alertType);
      // You can trigger sound/vibration here
    });

    this.socket.on('rotation_ended', (data: any) => {
      store.dispatch(setCurrentRotation(null));
      this.stopTimer();
    });

    this.socket.on('session_ended', (data: any) => {
      // Handle session end
      console.log('Session ended:', data);
    });
  }

  joinSession(sessionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_session', sessionId);
    }
  }

  leaveSession(sessionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_session', sessionId);
    }
  }

  private startTimer(durationSeconds: number): void {
    this.stopTimer();
    const durationMs = durationSeconds * 1000;
    let remaining = durationMs;

    this.timerInterval = setInterval(() => {
      remaining -= 1000;
      store.dispatch(updateTimer(remaining));

      if (remaining <= 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  disconnect(): void {
    this.stopTimer();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const websocketClient = new WebSocketClient();

