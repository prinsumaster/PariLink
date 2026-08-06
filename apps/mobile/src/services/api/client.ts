// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — API Service Layer
// Centralised Axios client with automatic JWT injection, silent token refresh,
// offline queueing, retry logic, and certificate pinning hooks.
// ─────────────────────────────────────────────────────────────────────────────

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axiosRetry from 'axios-retry';
import NetInfo from '@react-native-community/netinfo';
import { OfflineQueue } from '../../offline/OfflineQueue';
import { SecureStorage } from '../SecureStorage';
import { store } from '../../store';
import { clearAuth, refreshTokenThunk } from '../../store/slices/authSlice';

// ─── Configuration ────────────────────────────────────────────────────────────
const BASE_URL = __DEV__
  ? 'http://10.0.2.2:8080/api/v1'
  : (process.env.EXPO_PUBLIC_API_URL as string);

// ─── Axios Instance ───────────────────────────────────────────────────────────
const apiClient: AxiosInstance = axios.create({
  baseURL:        BASE_URL,
  timeout:        30000,
  headers: {
    'Content-Type':  'application/json',
    'X-Client-Type': 'mobile',
    'X-App-Version': '2.0.0',
  },
});

// ─── Retry Logic (network errors and 5xx) ────────────────────────────────────
axiosRetry(apiClient, {
  retries:            3,
  retryDelay:         (retryCount) => Math.pow(2, retryCount) * 500,
  retryCondition:     (error) =>
    axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error),
  shouldResetTimeout: true,
});

// ─── Request Interceptor — JWT Injection ─────────────────────────────────────
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor — Silent Token Refresh ─────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {reject(error);}
    else {resolve(token);}
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const result = await store.dispatch(refreshTokenThunk());
        if (refreshTokenThunk.fulfilled.match(result)) {
          const newToken = result.payload as string;
          processQueue(null, newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        } else {
          processQueue(new Error('Token refresh failed'));
          store.dispatch(clearAuth());
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError);
        store.dispatch(clearAuth());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const AuthAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),

  logout: () =>
    apiClient.post('/auth/logout'),

  requestOtp: (phone: string) =>
    apiClient.post('/auth/otp/request', { phone }),

  verifyOtp: (phone: string, otp: string) =>
    apiClient.post('/auth/otp/verify', { phone, otp }),

  me: () =>
    apiClient.get('/auth/me'),
};

// ─── Mobile / Driver API ──────────────────────────────────────────────────────
export const MobileAPI = {
  getActiveTrip: () =>
    apiClient.get('/mobile/trips/active'),

  updateTripStatus: (tripId: string, status: string) =>
    apiClient.patch(`/mobile/trips/${tripId}/status`, { status }),

  updateLoadStatus: (loadId: string, status: string) =>
    apiClient.patch(`/mobile/loads/${loadId}/status`, { status }),

  pingLocation: (payload: {
    tripId:    string;
    latitude:  number;
    longitude: number;
    speed?:    number;
    heading?:  number;
    accuracy?: number;
  }) =>
    apiClient.post('/mobile/location', payload),

  syncOfflineQueue: (queueData: unknown[]) =>
    apiClient.post('/mobile/sync', queueData),

  uploadDocument: (type: string, referenceId: string, formData: FormData) =>
    apiClient.post(`/mobile/upload/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { referenceId },
    }),
};

// ─── Driver API ───────────────────────────────────────────────────────────────
export const DriverAPI = {
  getMyProfile: (driverId: string) =>
    apiClient.get(`/drivers/${driverId}`),

  getEarnings: (driverId: string, params: { from: string; to: string }) =>
    apiClient.get(`/drivers/${driverId}/earnings`, { params }),

  getAttendance: (driverId: string, params: { month: string }) =>
    apiClient.get(`/drivers/${driverId}/attendance`, { params }),
};

// ─── Notifications API ────────────────────────────────────────────────────────
export const NotificationsAPI = {
  list: (page = 1, limit = 20) =>
    apiClient.get('/notifications', { params: { page, limit } }),

  markRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`),

  markAllRead: () =>
    apiClient.patch('/notifications/read-all'),

  registerDeviceToken: (token: string, platform: 'android' | 'ios') =>
    apiClient.post('/notifications/device-token', { token, platform }),
};

// ─── Expenses API ─────────────────────────────────────────────────────────────
export const ExpensesAPI = {
  list: (tripId?: string) =>
    apiClient.get('/expenses', { params: tripId ? { tripId } : undefined }),

  create: (payload: {
    tripId:      string;
    category:    string;
    amount:      number;
    description: string;
    receiptUrl?: string;
  }) =>
    apiClient.post('/expenses', payload),

  getAdvances: () =>
    apiClient.get('/finance/advances'),
};

// ─── Chat API ─────────────────────────────────────────────────────────────────
export const ChatAPI = {
  getConversations: () =>
    apiClient.get('/chat/conversations'),

  getMessages: (conversationId: string, page = 1) =>
    apiClient.get(`/chat/conversations/${conversationId}/messages`, {
      params: { page, limit: 50 },
    }),

  sendMessage: (conversationId: string, content: string) =>
    apiClient.post(`/chat/conversations/${conversationId}/messages`, { content }),
};

// ─── Network-Aware Request Wrapper ────────────────────────────────────────────
/**
 * Attempt the API call; on network failure, enqueue the action offline.
 */
export async function withOfflineFallback<T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  offlineAction: Parameters<typeof OfflineQueue.enqueue>[0],
): Promise<T | null> {
  const netState = await NetInfo.fetch();
  if (!netState.isConnected) {
    await OfflineQueue.enqueue(offlineAction);
    return null;
  }
  const response = await apiCall();
  return response.data;
}

export default apiClient;
