// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Trips Redux Slice
// Manages active trip, trips list, location tracking state, and load updates.
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MobileAPI } from '../../services/api/client';
import { Trip, TripStatus } from '../../types';
import { OfflineQueue } from '../../offline/OfflineQueue';
import NetInfo from '@react-native-community/netinfo';

interface TripsState {
  activeTrip:    Trip | null;
  isLoading:     boolean;
  isTracking:    boolean;
  error:         string | null;
  lastSyncAt:    string | null;
}

const initialState: TripsState = {
  activeTrip:  null,
  isLoading:   false,
  isTracking:  false,
  error:       null,
  lastSyncAt:  null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchActiveTripThunk = createAsyncThunk(
  'trips/fetchActive',
  async (_: void, { rejectWithValue }) => {
    try {
      const { data } = await MobileAPI.getActiveTrip();
      return data as Trip;
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) {return null;} // No active trip — valid state
      return rejectWithValue('Failed to fetch active trip');
    }
  },
);

export const updateTripStatusThunk = createAsyncThunk(
  'trips/updateStatus',
  async (
    { tripId, status }: { tripId: string; status: TripStatus },
    { rejectWithValue },
  ) => {
    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      await OfflineQueue.enqueue({
        action:    'UPDATE_TRIP_STATUS',
        payload:   { tripId, status },
        timestamp: new Date().toISOString(),
      });
      return { tripId, status, offline: true };
    }

    try {
      const { data } = await MobileAPI.updateTripStatus(tripId, status);
      return { ...(data as Trip), offline: false };
    } catch {
      return rejectWithValue('Failed to update trip status');
    }
  },
);

export const updateLoadStatusThunk = createAsyncThunk(
  'trips/updateLoadStatus',
  async (
    { loadId, status, tripId }: { loadId: string; status: string; tripId: string },
    { rejectWithValue },
  ) => {
    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      await OfflineQueue.enqueue({
        action:    'UPDATE_LOAD_STATUS',
        payload:   { loadId, status, tripId },
        timestamp: new Date().toISOString(),
      });
      return { loadId, status, offline: true };
    }

    try {
      const { data } = await MobileAPI.updateLoadStatus(loadId, status);
      return { ...(data as object), offline: false };
    } catch {
      return rejectWithValue('Failed to update load status');
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.isTracking = action.payload;
    },
    clearTripError: (state) => {
      state.error = null;
    },
    optimisticUpdateTripStatus: (state, action: PayloadAction<TripStatus>) => {
      if (state.activeTrip) {
        state.activeTrip.status = action.payload;
      }
    },
    optimisticUpdateLoadStatus: (
      state,
      action: PayloadAction<{ loadId: string; status: string }>,
    ) => {
      if (state.activeTrip) {
        const load = state.activeTrip.loads.find((l) => l.id === action.payload.loadId);
        if (load) {load.status = action.payload.status;}
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveTripThunk.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchActiveTripThunk.fulfilled, (state, { payload }) => {
        state.isLoading  = false;
        state.activeTrip = payload;
        state.lastSyncAt = new Date().toISOString();
      })
      .addCase(fetchActiveTripThunk.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error     = payload as string;
      });

    builder
      .addCase(updateTripStatusThunk.fulfilled, (state, { payload }) => {
        if (state.activeTrip && 'status' in payload) {
          state.activeTrip.status = (payload as unknown as Trip).status;
        }
      });
  },
});

export const {
  setTracking,
  clearTripError,
  optimisticUpdateTripStatus,
  optimisticUpdateLoadStatus,
} = tripsSlice.actions;

export default tripsSlice.reducer;
