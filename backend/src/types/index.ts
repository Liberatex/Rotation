export interface User {
  id: string;
  email: string;
  firebase_uid: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  preferences: Record<string, any>;
  stats: {
    total_sessions: number;
    total_rotations: number;
    total_turns: number;
    average_turn_duration: number;
  };
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: string;
  code: string;
  master_blunt_agent_id: string;
  status: 'waiting' | 'active' | 'paused' | 'completed';
  settings: {
    default_timer_duration: number;
    allow_multiple_rotations: boolean;
    max_participants?: number;
  };
  created_at: Date;
  updated_at: Date;
}

export interface SessionParticipant {
  id: string;
  session_id: string;
  user_id: string;
  join_order: number;
  joined_at: Date;
}

export interface Rotation {
  id: string;
  session_id: string;
  name?: string;
  timer_duration: number;
  current_turn_user_id?: string;
  current_turn_started_at?: Date;
  status: 'waiting' | 'active' | 'paused' | 'completed';
  turn_order: string[]; // Array of user IDs in rotation order
  custom_settings?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface RotationTurn {
  id: string;
  rotation_id: string;
  user_id: string;
  turn_number: number;
  started_at: Date;
  ended_at?: Date;
  duration_ms?: number;
  timed_out: boolean;
}

export interface RotationHistory {
  id: string;
  rotation_id: string;
  user_id: string;
  action: 'start' | 'pause' | 'resume' | 'pass' | 'timeout' | 'end';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'premium' | 'lifetime';
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  status: 'active' | 'canceled' | 'expired';
  started_at: Date;
  expires_at?: Date;
  canceled_at?: Date;
}

export interface CustomSound {
  id: string;
  name: string;
  category: string;
  file_url: string;
  is_premium: boolean;
  usage_count: number;
  created_at: Date;
}

export interface UserSound {
  id: string;
  user_id: string;
  sound_id: string;
  is_favorite: boolean;
  is_custom: boolean;
  custom_file_url?: string;
  added_at: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  firebaseUid: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

