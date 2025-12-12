import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { rotationApi } from '../../services/rotationApi';
import { Rotation, RotationTurn } from '../../types';

interface RotationState {
  currentRotation: Rotation | null;
  rotations: Rotation[];
  turns: RotationTurn[];
  timerRemaining: number | null; // milliseconds
  isTimerRunning: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: RotationState = {
  currentRotation: null,
  rotations: [],
  turns: [],
  timerRemaining: null,
  isTimerRunning: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const createRotation = createAsyncThunk(
  'rotation/create',
  async (data: { sessionId: string; name?: string; timerDuration?: number }, { rejectWithValue }) => {
    try {
      return await rotationApi.create(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create rotation');
    }
  }
);

export const startRotation = createAsyncThunk(
  'rotation/start',
  async (rotationId: string, { rejectWithValue }) => {
    try {
      await rotationApi.start(rotationId);
      return await rotationApi.getById(rotationId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start rotation');
    }
  }
);

export const pauseRotation = createAsyncThunk(
  'rotation/pause',
  async (rotationId: string, { rejectWithValue }) => {
    try {
      await rotationApi.pause(rotationId);
      return await rotationApi.getById(rotationId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to pause rotation');
    }
  }
);

export const resumeRotation = createAsyncThunk(
  'rotation/resume',
  async (rotationId: string, { rejectWithValue }) => {
    try {
      await rotationApi.resume(rotationId);
      return await rotationApi.getById(rotationId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to resume rotation');
    }
  }
);

export const endRotation = createAsyncThunk(
  'rotation/end',
  async (rotationId: string, { rejectWithValue }) => {
    try {
      await rotationApi.end(rotationId);
      return await rotationApi.getById(rotationId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to end rotation');
    }
  }
);

export const passTurn = createAsyncThunk(
  'rotation/pass',
  async (rotationId: string, { rejectWithValue }) => {
    try {
      await rotationApi.pass(rotationId);
      return await rotationApi.getById(rotationId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to pass turn');
    }
  }
);

export const fetchRotation = createAsyncThunk(
  'rotation/fetch',
  async (rotationId: string, { rejectWithValue }) => {
    try {
      return await rotationApi.getById(rotationId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch rotation');
    }
  }
);

export const fetchTurns = createAsyncThunk(
  'rotation/fetchTurns',
  async (rotationId: string, { rejectWithValue }) => {
    try {
      return await rotationApi.getTurns(rotationId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch turns');
    }
  }
);

const rotationSlice = createSlice({
  name: 'rotation',
  initialState,
  reducers: {
    setCurrentRotation: (state, action: PayloadAction<Rotation | null>) => {
      state.currentRotation = action.payload;
      if (action.payload && action.payload.currentTurnStartedAt) {
        const startedAt = new Date(action.payload.currentTurnStartedAt).getTime();
        const now = Date.now();
        const elapsed = now - startedAt;
        state.timerRemaining = Math.max(0, action.payload.timerDuration * 1000 - elapsed);
        state.isTimerRunning = action.payload.status === 'active';
      }
    },
    updateRotationLocal: (state, action: PayloadAction<Partial<Rotation>>) => {
      if (state.currentRotation) {
        state.currentRotation = { ...state.currentRotation, ...action.payload };
      }
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timerRemaining = Math.max(0, action.payload);
    },
    setTimerRunning: (state, action: PayloadAction<boolean>) => {
      state.isTimerRunning = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRotation: (state) => {
      state.currentRotation = null;
      state.timerRemaining = null;
      state.isTimerRunning = false;
      state.turns = [];
    },
  },
  extraReducers: (builder) => {
    // Create rotation
    builder.addCase(createRotation.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createRotation.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentRotation = action.payload;
      state.error = null;
    });
    builder.addCase(createRotation.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Start rotation
    builder.addCase(startRotation.fulfilled, (state, action) => {
      state.currentRotation = action.payload;
      state.isTimerRunning = true;
      if (action.payload.currentTurnStartedAt) {
        const startedAt = new Date(action.payload.currentTurnStartedAt).getTime();
        state.timerRemaining = action.payload.timerDuration * 1000;
      }
    });

    // Pause rotation
    builder.addCase(pauseRotation.fulfilled, (state) => {
      state.isTimerRunning = false;
      if (state.currentRotation) {
        state.currentRotation.status = 'paused';
      }
    });

    // Resume rotation
    builder.addCase(resumeRotation.fulfilled, (state, action) => {
      state.currentRotation = action.payload;
      state.isTimerRunning = true;
    });

    // End rotation
    builder.addCase(endRotation.fulfilled, (state) => {
      state.currentRotation = null;
      state.timerRemaining = null;
      state.isTimerRunning = false;
    });

    // Pass turn
    builder.addCase(passTurn.fulfilled, (state, action) => {
      state.currentRotation = action.payload;
      if (action.payload.currentTurnStartedAt) {
        state.timerRemaining = action.payload.timerDuration * 1000;
      }
    });

    // Fetch rotation
    builder.addCase(fetchRotation.fulfilled, (state, action) => {
      state.currentRotation = action.payload;
      if (action.payload.currentTurnStartedAt) {
        const startedAt = new Date(action.payload.currentTurnStartedAt).getTime();
        const now = Date.now();
        const elapsed = now - startedAt;
        state.timerRemaining = Math.max(0, action.payload.timerDuration * 1000 - elapsed);
        state.isTimerRunning = action.payload.status === 'active';
      }
    });

    // Fetch turns
    builder.addCase(fetchTurns.fulfilled, (state, action) => {
      state.turns = action.payload;
    });
  },
});

export const {
  setCurrentRotation,
  updateRotationLocal,
  updateTimer,
  setTimerRunning,
  clearError,
  clearRotation,
} = rotationSlice.actions;
export default rotationSlice.reducer;

