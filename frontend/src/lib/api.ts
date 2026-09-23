import axios from 'axios';

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

// Response Interceptor: Tangani error global
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Hapus token kadaluwarsa
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
