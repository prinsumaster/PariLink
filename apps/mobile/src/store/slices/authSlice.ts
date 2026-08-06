// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Auth Redux Slice
// Handles: login, OTP, biometric, silent token refresh, logout.
// Stores access token + user profile in state (persisted via AsyncStorage).
// Raw tokens are additionally stored in Keychain for security.
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthAPI } from '../../services/api/client';
import { SecureStorage } from '../../services/SecureStorage';
import { AuthState, AuthUser } from '../../types';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState: AuthState = {
  accessToken:        null,
  user:               null,
  isLoading:          false,
  isOffline:          false,
  biometricAvailable: false,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

/** Standard email/password login */
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await AuthAPI.login(payload.email, payload.password);
      await SecureStorage.setTokens(data.access_token, data.refresh_token ?? '');
      await SecureStorage.setUser(data.user);
      return { accessToken: data.access_token as string, user: data.user as AuthUser };
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Login failed';
      return rejectWithValue(message);
    }
  },
);

/** Offline biometric login — validate biometric then re-use cached token */
export const biometricLoginThunk = createAsyncThunk(
  'auth/biometricLogin',
  async (_: void, { rejectWithValue }) => {
    try {
      const token = await SecureStorage.getAccessToken();
      const user  = await SecureStorage.getUser<AuthUser>();
      if (!token || !user) {
        return rejectWithValue('No cached session. Please login with credentials.');
      }
      return { accessToken: token, user };
    } catch {
      return rejectWithValue('Biometric authentication failed');
    }
  },
);

/** Silent token refresh (called by Axios interceptor) */
export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_: void, { rejectWithValue }) => {
    try {
      const refreshToken = await SecureStorage.getRefreshToken();
      if (!refreshToken) {return rejectWithValue('No refresh token');}
      const { data } = await AuthAPI.refreshToken(refreshToken);
      await SecureStorage.setTokens(data.access_token, data.refresh_token ?? refreshToken);
      return data.access_token as string;
    } catch (_error) {
      return rejectWithValue('Session expired');
    }
  },
);

/** Logout — clear both keychain and store */
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_: void) => {
    try {
      await AuthAPI.logout();
    } catch {
      // best-effort
    } finally {
      await SecureStorage.clearAll();
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.accessToken = null;
      state.user        = null;
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    setBiometricAvailable: (state, action: PayloadAction<boolean>) => {
      state.biometricAvailable = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ── Login ────────────────────────────────────────────────────────────────
    builder
      .addCase(loginThunk.pending, (state) => { state.isLoading = true; })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.isLoading  = false;
        state.accessToken = payload.accessToken;
        state.user        = payload.user;
      })
      .addCase(loginThunk.rejected, (state) => { state.isLoading = false; });

    // ── Biometric Login ──────────────────────────────────────────────────────
    builder
      .addCase(biometricLoginThunk.fulfilled, (state, { payload }) => {
        state.accessToken = payload.accessToken;
        state.user        = payload.user;
      });

    // ── Token Refresh ────────────────────────────────────────────────────────
    builder
      .addCase(refreshTokenThunk.fulfilled, (state, { payload }) => {
        state.accessToken = payload;
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.accessToken = null;
        state.user        = null;
      });

    // ── Logout ───────────────────────────────────────────────────────────────
    builder
      .addCase(logoutThunk.fulfilled, (state) => {
        state.accessToken = null;
        state.user        = null;
      });
  },
});

export const { clearAuth, setOfflineMode, setBiometricAvailable } = authSlice.actions;
export default authSlice.reducer;
