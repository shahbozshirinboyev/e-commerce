"use client";
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/cart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const cartCount = (Array.isArray(items) ? items : []).reduce((n, i) => n + (Number(i.quantity) || 0), 0);
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/dashboard" className={`${linkClass} ${pathname === '/dashboard' ? 'active' : ''}`}>{t('nav.dashboard')}</Link>
          <Link href="/products" className={`${linkClass} ${pathname === '/products' ? 'active' : ''}`}>{t('nav.products')}</Link>
          <Link href="/orders" className={`${linkClass} ${pathname === '/orders' ? 'active' : ''}`}>{t('nav.orders')}</Link>
          <Link href="/orders/new" className={`${linkClass} ${pathname === '/orders/new' ? 'active' : ''} relative inline-flex items-center`} aria-label="Cart">
            <ShoppingCartIcon fontSize="small" className="mr-1" />
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 text-xs px-1.5 rounded-full bg-blue-600 text-white" title={`Savat: ${cartCount}`}>
                {cartCount}
              </span>
            )}
          </Link>
          {!isAuthenticated ? (
            <Link href="/login" className={`${linkClass} ${pathname === '/login' ? 'active' : ''}`}>{t('nav.login')}</Link>
          ) : (
            <button onClick={logout} className="ml-2 px-3 py-1 rounded bg-gray-900 text-white hover:opacity-90 transition-opacity">
              {t('logout')}
            </button>
          )}
          <button onClick={toggleLang} className="px-2 py-1 rounded border text-sm hover:bg-black/5 transition-colors" aria-label="Toggle language">
            {(i18n.language || 'en').toUpperCase()}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded border px-2 py-1 text-sm hover:bg-black/5 transition-colors"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            // Close icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 11-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          ) : (
            // Hamburger icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            <Link href="/dashboard" className={`${linkClass} ${pathname === '/dashboard' ? 'active' : ''}`}>{t('nav.dashboard')}</Link>
            <Link href="/products" className={`${linkClass} ${pathname === '/products' ? 'active' : ''}`}>{t('nav.products')}</Link>
            <Link href="/orders" className={`${linkClass} ${pathname === '/orders' ? 'active' : ''}`}>{t('nav.orders')}</Link>
            <Link href="/orders/new" className={`${linkClass} ${pathname === '/orders/new' ? 'active' : ''} inline-flex items-center gap-2`} aria-label="Cart">
              <ShoppingCartIcon fontSize="small" />
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 text-xs px-1.5 rounded-full bg-blue-600 text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            {!isAuthenticated ? (
              <Link href="/login" className={`${linkClass} ${pathname === '/login' ? 'active' : ''}`}>{t('nav.login')}</Link>
            ) : (
              <button onClick={logout} className="px-3 py-1 rounded bg-gray-900 text-white w-full text-left">
                {t('logout')}
              </button>
            )}
            <button onClick={toggleLang} className="px-2 py-1 rounded border text-sm hover:bg-black/5 transition-colors w-max" aria-label="Toggle language">
              {(i18n.language || 'en').toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

