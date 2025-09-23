import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uz from '@/locales/uz.json';
import en from '@/locales/en.json';

const DEFAULT_LANG = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'uz';

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
