export interface User {
  id: string;
  email: string;
  firebaseUid: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  preferences: Record<string, any>;
  stats: {
    totalSessions: number;
    totalRotations: number;
    totalTurns: number;
    averageTurnDuration: number;
  };
}

export interface Session {
  id: string;
  code: string;
  masterBluntAgentId: string;
  status: 'waiting' | 'active' | 'paused' | 'completed';
  settings: {
    defaultTimerDuration: number;
    allowMultipleRotations: boolean;
    maxParticipants?: number;
  };
  createdAt: string;
  updatedAt: string;
  participants?: SessionParticipant[];
}

export interface SessionParticipant {
  id: string;
  sessionId: string;
  userId: string;
  joinOrder: number;
  joinedAt: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface Rotation {
  id: string;
  sessionId: string;
  name?: string;
  timerDuration: number;
  currentTurnUserId?: string;
  currentTurnStartedAt?: string;
  status: 'waiting' | 'active' | 'paused' | 'completed';
  turnOrder: string[];
  customSettings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface RotationTurn {
  id: string;
  rotationId: string;
  userId: string;
  turnNumber: number;
  startedAt: string;
  endedAt?: string;
  durationMs?: number;
  timedOut: boolean;
  displayName?: string;
  avatarUrl?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: 'free' | 'premium' | 'lifetime';
  status: 'active' | 'canceled' | 'expired';
  startedAt: string;
  expiresAt?: string;
}

export interface CustomSound {
  id: string;
  name: string;
  category: string;
  fileUrl: string;
  isPremium: boolean;
  usageCount: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

