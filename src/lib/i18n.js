import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uz from '@/locales/uz.json';
import en from '@/locales/en.json';

// Prefer persisted language; default to English on first load
const STORED_LANG = typeof window !== 'undefined' ? localStorage.getItem('appLang') : null;
const DEFAULT_LANG = STORED_LANG || 'en';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        uz: { translation: uz },
        en: { translation: en },
      },
      lng: DEFAULT_LANG,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
}

export default i18n;
