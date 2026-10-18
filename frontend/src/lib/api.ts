import axios from 'axios';
import { handleMockApi } from './mockData';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const unwrapApiData = <T>(payload: unknown): T => {
  if (isRecord(payload) && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
};

export const getApiData = async <T>(url: string): Promise<T> => {
  const payload = await api.get<ApiEnvelope<T> | T>(url);
  return unwrapApiData<T>(payload);
};

export const postApiData = async <T, TPayload extends object>(
  url: string,
  payload: TPayload,
): Promise<T> => {
  const response = await api.post<ApiEnvelope<T> | T>(url, payload);
  return unwrapApiData<T>(response);
};

export const resolveMediaUrl = (url?: string | null, fallback = '/header.png') => {
  if (!url) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

// Request Interceptor: Inject JWT Bearer Token if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('kilaubuild_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Fallback to Mock Data on Network Error / Offline (Vercel Demo)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Check if network error or connection refused (offline/Vercel without paid backend)
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message?.toLowerCase().includes('network');

    if (isNetworkError && error.config) {
      const method = error.config.method || 'GET';
      const url = error.config.url || '';
      let requestData: unknown = undefined;
      try {
        requestData = error.config.data
          ? typeof error.config.data === 'string'
            ? JSON.parse(error.config.data)
            : error.config.data
          : undefined;
      } catch {
        requestData = error.config.data;
      }

      const mockData = handleMockApi(method, url, requestData);
      if (mockData !== null) {
        return Promise.resolve(mockData);
      }
    }

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('kilaubuild_token');
      localStorage.removeItem('kilaubuild_user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.replace('/admin/login');
      }
    }

    return Promise.reject(error.response?.data || error);
  },
);

export default api;
