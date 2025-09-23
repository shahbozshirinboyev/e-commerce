import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-e-commerce.tenzorsoft.uz';
const TOKEN_KEY = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'authToken';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        // optional: custom event for auth logout
        window.dispatchEvent(new Event('app:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
