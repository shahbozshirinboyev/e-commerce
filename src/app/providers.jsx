"use client";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
    const onUnauthorized = () => {
      // could redirect to login here
    };
    window.addEventListener('app:unauthorized', onUnauthorized);
    return () => window.removeEventListener('app:unauthorized', onUnauthorized);
  }, [initialize]);

  // Ensure persisted language is applied after refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('appLang');
    if (stored && i18n.language !== stored) {
      i18n.changeLanguage(stored);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Toaster position="top-right" />
      {children}
    </I18nextProvider>
  );
}
