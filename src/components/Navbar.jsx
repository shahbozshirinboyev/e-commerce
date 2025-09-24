"use client";
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuthStore();
  const [ready, setReady] = useState(false);

  // Ensure i18n language matches persisted choice before rendering to avoid hydration mismatch
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('appLang');
    if (stored && i18n.language !== stored) {
      i18n.changeLanguage(stored);
    }
    setReady(true);
  }, [i18n]);
  const toggleLang = () => {
    const next = i18n.language === 'uz' ? 'en' : 'uz';
    i18n.changeLanguage(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLang', next);
    }
  };

  if (!ready) {
    // Render minimal shell to preserve layout without translated text
    return (
      <nav className="w-full bg-white/20 backdrop-blur sticky top-0 z-50" aria-hidden>
        <div className="max-w-6xl mx-auto px-4 py-3" />
      </nav>
    );
  }

  return (
    <nav suppressHydrationWarning className="w-full bg-white/20 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold">{t('app.title')}</Link>
        <div className="flex-1" />
        <Link href="/dashboard" className="hover:underline">{t('nav.dashboard')}</Link>
        <Link href="/products" className="hover:underline">{t('nav.products')}</Link>
        <Link href="/orders" className="hover:underline">{t('nav.orders')}</Link>
        <Link href="/profile" className="hover:underline">{t('nav.profile')}</Link>
        
        {!isAuthenticated ? (
          <>
            <Link href="/login" className="hover:underline">{t('nav.login')}</Link>
          </>
        ) : (
          <button onClick={logout} className="ml-2 px-3 py-1 rounded bg-gray-900 text-white">{t('logout')}</button>
        )}

        <button onClick={toggleLang} className="px-2 py-1 rounded border text-sm">
          {(i18n.language || 'en').toUpperCase()}
        </button>
      </div>
    </nav>
  );
}
