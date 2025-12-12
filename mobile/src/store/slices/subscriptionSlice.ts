import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { subscriptionApi } from '../../services/subscriptionApi';
import { Subscription } from '../../types';

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'free' | 'premium' | 'lifetime';
  price: number;
  interval?: 'month' | 'year' | 'lifetime';
  features: string[];
}

interface SubscriptionState {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscription: null,
  plans: [
    {
      id: 'free',
      name: 'Free',
      tier: 'free',
      price: 0,
      features: [
        'Basic beep alert sound',
        'Standard timer durations (30, 45, 60s)',
        'Up to 10 participants',
        'Basic statistics',
        'Ads included',
      ],
    },
    {
      id: 'premium-monthly',
      name: 'Premium Monthly',
      tier: 'premium',
      price: 2.99,
      interval: 'month',
      features: [
        '50+ custom alert sounds',
        'Upload personal audio files',
        'Custom timer durations (5-300s)',
        'Unlimited participants',
        'Advanced statistics',
        'Ad-free experience',
        'Priority support',
      ],
    },
    {
      id: 'premium-yearly',
      name: 'Premium Yearly',
      tier: 'premium',
      price: 19.99,
      interval: 'year',
      features: [
        '50+ custom alert sounds',
        'Upload personal audio files',
        'Custom timer durations (5-300s)',
        'Unlimited participants',
        'Advanced statistics',
        'Ad-free experience',
        'Priority support',
        'Save 44%',
      ],
    },
    {
      id: 'lifetime',
      name: 'Lifetime Premium',
      tier: 'lifetime',
      price: 49.99,
      interval: 'lifetime',
      features: [
        '50+ custom alert sounds',
        'Upload personal audio files',
        'Custom timer durations (5-300s)',
        'Unlimited participants',
        'Advanced statistics',
        'Ad-free experience',
        'Priority support',
        'One-time payment',
      ],
    },
  ],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchSubscription = createAsyncThunk(
  'subscription/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionApi.getSubscription();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch subscription');
    }
  }
);

export const subscribeToPlan = createAsyncThunk(
  'subscription/subscribe',
  async (planId: string, { rejectWithValue }) => {
    try {
      return await subscriptionApi.subscribe(planId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to subscribe');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancel',
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionApi.cancel();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel subscription');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch subscription
    builder.addCase(fetchSubscription.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSubscription.fulfilled, (state, action) => {
      state.isLoading = false;
      state.subscription = action.payload;
    });
    builder.addCase(fetchSubscription.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Subscribe
    builder.addCase(subscribeToPlan.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(subscribeToPlan.fulfilled, (state, action) => {
      state.isLoading = false;
      state.subscription = action.payload;
    });
    builder.addCase(subscribeToPlan.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Cancel subscription
    builder.addCase(cancelSubscription.fulfilled, (state, action) => {
      state.subscription = action.payload;
    });
  },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

