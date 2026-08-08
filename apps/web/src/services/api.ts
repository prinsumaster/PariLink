import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token, tenantId } = useAuthStore.getState();
    
    console.log(`[API Interceptor] URL: ${config.url}, tenantId: ${tenantId}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number };
    
    // 1. Exponential Backoff for Network / 5xx Errors
    originalRequest._retryCount = originalRequest._retryCount || 0;
    const MAX_RETRIES = 3;
    
    const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error';
    const isServerError = error.response && error.response.status >= 500 && error.response.status <= 599;
    
    if ((isNetworkError || isServerError) && originalRequest._retryCount < MAX_RETRIES) {
      originalRequest._retryCount += 1;
      const delay = Math.pow(2, originalRequest._retryCount) * 1000 + Math.random() * 500; // Exponential backoff with jitter
      
      console.warn(`[API] Connection failed. Retrying in ${Math.round(delay)}ms (Attempt ${originalRequest._retryCount}/${MAX_RETRIES})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return api(originalRequest);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt silent refresh via HttpOnly cookie
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        
        // Retry original request (cookies will be automatically included)
        if (originalRequest.headers && originalRequest.headers.Authorization) {
          delete originalRequest.headers.Authorization;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        useAuthStore.getState().logout();
        const nextUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname + window.location.search) : '';
        window.location.href = `/login?session_expired=true${nextUrl ? `&next=${nextUrl}` : ''}`;
        return Promise.reject(refreshError);
      }
    }
    
    // Error Normalization
    const data = error.response?.data as any;
    const message = data?.message || data?.error || error.message || 'An unexpected error occurred';
    const requestId = error.response?.headers?.['x-request-id'] || 'REQ-' + Math.random().toString(36).substring(7);
    
    // Construct premium rich toast
    const title = error.response?.status === 403 ? 'Permission Denied' :
                  error.response?.status === 429 ? 'Too Many Requests' :
                  error.response?.status === 500 ? 'System Error' :
                  error.response?.status === 400 ? 'Validation Error' : 'Request Failed';

    // Global Error Toaster for mutations (skip GET requests to avoid spamming UI on background polling fails)
    if (originalRequest.method !== 'get') {
      toast.error(title, {
        description: message,
        action: {
          label: 'Retry',
          onClick: () => {
            // Trigger retry manually
            return api(originalRequest);
          }
        },
        duration: 6000,
      });
    } else if (error.response?.status === 403 || error.response?.status === 500) {
      toast.error(title, {
        description: message,
      });
    }

    // Attach for localized component error boundaries
    return Promise.reject({
      ...error,
      normalizedMessage: message,
      requestId,
    });
  }
);
