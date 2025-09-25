"use client";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect, useMemo, useState, createContext, useContext } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Toaster } from 'react-hot-toast';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/lib/createEmotionCache';

const ThemeModeContext = createContext({ mode: 'light', toggle: () => {} });

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export default function Providers({ children }) {
  const initialize = useAuthStore((s) => s.initialize);
  const [mode, setMode] = useState('light');
  const [emotionCache] = useState(() => createEmotionCache());
  const [mounted, setMounted] = useState(false);

  // Load persisted theme mode
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('themeMode');
    if (stored === 'light' || stored === 'dark') setMode(stored);
  }, []);

  const theme = useMemo(() => createTheme({
    palette: { mode },
    typography: {
      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    },
  }), [mode]);

  const toggle = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') localStorage.setItem('themeMode', next);
      return next;
    });
  };

  useEffect(() => {
    initialize();
    const onUnauthorized = () => {
      // could redirect to login here
    };
    window.addEventListener('app:unauthorized', onUnauthorized);
    return () => window.removeEventListener('app:unauthorized', onUnauthorized);
  }, [initialize]);

  // Ensure child-only client components (like Toaster) mount after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure persisted language is applied after refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('appLang');
    if (stored && i18n.language !== stored) {
      i18n.changeLanguage(stored);
    }
  }, []);

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <I18nextProvider i18n={i18n}>
            {mounted && <Toaster position="top-right" />}
            {children}
          </I18nextProvider>
        </ThemeProvider>
      </CacheProvider>
    </ThemeModeContext.Provider>
  );
}
