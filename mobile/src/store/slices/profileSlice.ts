import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userApi } from '../../services/userApi';
import { UserProfile } from '../../types';

interface ProfileState {
  profile: UserProfile | null;
  stats: {
    totalSessions: number;
    totalRotations: number;
    totalTurns: number;
    averageTurnDuration: number;
  };
  achievements: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  stats: {
    totalSessions: 0,
    totalRotations: 0,
    totalTurns: 0,
    averageTurnDuration: 0,
  },
  achievements: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.getProfile();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (updates: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      return await userApi.updateProfile(updates);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const fetchStats = createAsyncThunk(
  'profile/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.getStats();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch stats');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileLocal: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = action.payload;
      if (action.payload.stats) {
        state.stats = action.payload.stats;
      }
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update profile
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });

    // Fetch stats
    builder.addCase(fetchStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });
  },
});

export const { updateProfileLocal, clearError } = profileSlice.actions;
export default profileSlice.reducer;

