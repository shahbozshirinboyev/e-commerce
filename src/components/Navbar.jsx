"use client";
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuthStore();
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  // Scroll effects: change nav background/shadow and show progress bar
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 4);
      const doc = document.documentElement;
      const height = doc.scrollHeight - doc.clientHeight;
      const p = height > 0 ? Math.min(100, Math.max(0, (y / height) * 100)) : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = useMemo(() => (
    'nav-link px-2 py-1 rounded transition-colors duration-200 hover:text-blue-600'
  ), []);

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
    <nav
      suppressHydrationWarning
      className="w-full sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)',
        backdropFilter: 'saturate(180%) blur(10px)',
        WebkitBackdropFilter: 'saturate(180%) blur(10px)',
        boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      {/* Top progress bar */}
      <div
        aria-hidden
        style={{ width: `${progress}%` }}
        className="h-[2px] bg-blue-600 transition-[width] duration-150"
      />
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold nav-logo transition-transform duration-300 hover:scale-[1.02]">
          {t('app.title')}
        </Link>
        <div className="flex-1" />
        <Link href="/dashboard" className={`${linkClass} ${pathname === '/dashboard' ? 'active' : ''}`}>{t('nav.dashboard')}</Link>
        <Link href="/products" className={`${linkClass} ${pathname === '/products' ? 'active' : ''}`}>{t('nav.products')}</Link>
        <Link href="/orders" className={`${linkClass} ${pathname === '/orders' ? 'active' : ''}`}>{t('nav.orders')}</Link>
        {!isAuthenticated ? (
          <>
            <Link href="/login" className={`${linkClass} ${pathname === '/login' ? 'active' : ''}`}>{t('nav.login')}</Link>
          </>
        ) : (
          <button onClick={logout} className="ml-2 px-3 py-1 rounded bg-gray-900 text-white hover:opacity-90 transition-opacity">
            {t('logout')}
          </button>
        )}
        <button onClick={toggleLang} className="px-2 py-1 rounded border text-sm hover:bg-black/5 transition-colors">
          {(i18n.language || 'en').toUpperCase()}
        </button>
      </div>
    </nav>
  );
}
