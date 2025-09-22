import 'server-only';
import type { Locale } from './i18n-config';
import { i18nConfig } from './i18n-config';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then(module => module.default),
  hi: () => import('@/dictionaries/hi.json').then(module => module.default),
  mr: () => import('@/dictionaries/mr.json').then(module => module.default),
  ta: () => import('@/dictionaries/ta.json').then(module => module.default),
  te: () => import('@/dictionaries/te.json').then(module => module.default),
};

export const getDictionary = async (locale: Locale) => {
    const lang = i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale;
    const load = dictionaries[lang] || dictionaries.en;
    return load();
};
