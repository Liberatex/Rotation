import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { sessionApi } from '../../services/sessionApi';
import { Session, SessionParticipant } from '../../types';

interface SessionState {
  currentSession: Session | null;
  sessions: Session[];
  participants: SessionParticipant[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  currentSession: null,
  sessions: [],
  participants: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const createSession = createAsyncThunk(
  'session/create',
  async (settings?: any, { rejectWithValue }) => {
    try {
      return await sessionApi.create(settings);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create session');
    }
  }
);

export const joinSession = createAsyncThunk(
  'session/join',
  async (data: { sessionId: string; code?: string }, { rejectWithValue }) => {
    try {
      await sessionApi.join(data.sessionId, data.code);
      return await sessionApi.getById(data.sessionId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to join session');
    }
  }
);

export const leaveSession = createAsyncThunk(
  'session/leave',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      await sessionApi.leave(sessionId);
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to leave session');
    }
  }
);

export const fetchSession = createAsyncThunk(
  'session/fetch',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      return await sessionApi.getById(sessionId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch session');
    }
  }
);

export const fetchParticipants = createAsyncThunk(
  'session/fetchParticipants',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      return await sessionApi.getParticipants(sessionId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch participants');
    }
  }
);

export const updateSession = createAsyncThunk(
  'session/update',
  async (data: { sessionId: string; updates: any }, { rejectWithValue }) => {
    try {
      return await sessionApi.update(data.sessionId, data.updates);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update session');
    }
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<Session | null>) => {
      state.currentSession = action.payload;
    },
    updateSessionLocal: (state, action: PayloadAction<Partial<Session>>) => {
      if (state.currentSession) {
        state.currentSession = { ...state.currentSession, ...action.payload };
      }
    },
    addParticipantLocal: (state, action: PayloadAction<SessionParticipant>) => {
      if (!state.participants.find((p) => p.id === action.payload.id)) {
        state.participants.push(action.payload);
      }
    },
    removeParticipantLocal: (state, action: PayloadAction<string>) => {
      state.participants = state.participants.filter((p) => p.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSession: (state) => {
      state.currentSession = null;
      state.participants = [];
    },
  },
  extraReducers: (builder) => {
    // Create session
    builder.addCase(createSession.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createSession.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentSession = action.payload;
      state.error = null;
    });
    builder.addCase(createSession.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Join session
    builder.addCase(joinSession.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(joinSession.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentSession = action.payload;
      state.error = null;
    });
    builder.addCase(joinSession.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Leave session
    builder.addCase(leaveSession.fulfilled, (state) => {
      state.currentSession = null;
      state.participants = [];
    });

    // Fetch session
    builder.addCase(fetchSession.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchSession.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentSession = action.payload;
    });
    builder.addCase(fetchSession.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch participants
    builder.addCase(fetchParticipants.fulfilled, (state, action) => {
      state.participants = action.payload;
    });

    // Update session
    builder.addCase(updateSession.fulfilled, (state, action) => {
      state.currentSession = action.payload;
    });
  },
});

export const {
  setCurrentSession,
  updateSessionLocal,
  addParticipantLocal,
  removeParticipantLocal,
  clearError,
  clearSession,
} = sessionSlice.actions;
export default sessionSlice.reducer;

