import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/authApi';
import { User, AuthTokens } from '../../types';
import { setAuthTokens, clearAuthTokens, setUserData, clearUserData } from '../../utils/storage';

interface AuthState {
  user: User | null;
  profile: any | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: { email: string; password: string; displayName?: string }, { rejectWithValue }) => {
    try {
      const result = await authApi.register(credentials);
      await setAuthTokens(result.tokens);
      await setUserData(result.user);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await authApi.login(credentials);
      await setAuthTokens(result.tokens);
      await setUserData(result.user);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    await clearAuthTokens();
    await clearUserData();
    return null;
  } catch (error: any) {
    // Clear local storage even if API call fails
    await clearAuthTokens();
    await clearUserData();
    return rejectWithValue(error.message || 'Logout failed');
  }
});

export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async (_, { rejectWithValue }) => {
  try {
    const tokens = await authApi.getStoredTokens();
    if (!tokens) {
      return null;
    }
    // Verify token is still valid by fetching user profile
    try {
      const user = await authApi.getCurrentUser();
      return { user, tokens };
    } catch (error: any) {
      // Token invalid, clear storage
      await clearAuthTokens();
      await clearUserData();
      return null;
    }
  } catch (error: any) {
    await clearAuthTokens();
    await clearUserData();
    return null;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.profile = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
    });

    // Check auth status
    builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    });
  },
});

export const { clearError, setTokens } = authSlice.actions;
export default authSlice.reducer;

