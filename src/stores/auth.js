import { create } from 'zustand';

const TOKEN_KEY = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'authToken';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  initialize: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const payload = safeDecodeJwt(token);
      const user = payload && (payload.user || { role: payload.role || payload.roles || payload.authorities });
      set({ token, user: user || null, isAuthenticated: true });
    }
  },

  login: ({ token, user }) => {
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    // If backend didn't return user info, try to decode from JWT
    let nextUser = user;
    if (!nextUser && token) {
      const payload = safeDecodeJwt(token);
      nextUser = payload && (payload.user || { role: payload.role || payload.roles || payload.authorities });
    }
    set({ token, user: nextUser || null, isAuthenticated: !!token });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ token: null, user: null, isAuthenticated: false });
  },

  // Helper to check admin role consistently in UI
  isAdmin: () => {
    const { user } = get();
    if (!user) return false;
    // Support several shapes: user.role (string), user.roles (array), authorities (array of strings/objects)
    const role = user.role || user?.roles || user?.authorities;
    if (typeof role === 'string') return role.toLowerCase().includes('admin');
    if (Array.isArray(role)) return role.map(String).some((r) => r.toLowerCase().includes('admin'));
    return false;
  },
}));

// --- utils ---
function safeDecodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
