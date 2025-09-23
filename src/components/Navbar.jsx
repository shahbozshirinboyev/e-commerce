"use client";
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuthStore();
  const toggleLang = () => {
    const next = i18n.language === 'uz' ? 'en' : 'uz';
    i18n.changeLanguage(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLang', next);
    }
  };

  return (
    <nav className="w-full bg-white/20 backdrop-blur sticky top-0 z-50">
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
            <Link href="/register" className="hover:underline">{t('nav.register')}</Link>
          </>
        ) : (
          <button onClick={logout} className="ml-2 px-3 py-1 rounded bg-gray-900 text-white">{t('logout')}</button>
        )}

        <button onClick={toggleLang} className="px-2 py-1 rounded border text-sm">
          {(i18n.language || 'uz').toUpperCase()}
        </button>
      </div>
    </nav>
  );
}
