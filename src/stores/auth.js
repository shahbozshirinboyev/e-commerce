import { create } from 'zustand';

const TOKEN_KEY = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'authToken';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  initialize: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) set({ token, isAuthenticated: true });
  },

  login: ({ token, user }) => {
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    set({ token, user, isAuthenticated: !!token });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
