import 'server-only';
import type { Locale } from './i18n-config';
import { i18nConfig } from './i18n-config';

// Define a type for our dictionary loader function
type DictionaryLoader = () => Promise<any>;

// Map locales to their dynamic import functions
const dictionaries: Record<Locale, DictionaryLoader> = {
  en: () => import('@/dictionaries/en.json').then(module => module.default),
  hi: () => import('@/dictionaries/hi.json').then(module => module.default),
  mr: () => import('@/dictionaries/mr.json').then(module => module.default),
  ta: () => import('@/dictionaries/ta.json').then(module => module.default),
  te: () => import('@/dictionaries/te.json').then(module => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const selectedLocale = i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale;
  const loader = dictionaries[selectedLocale] || dictionaries.en;
  
  try {
    const dictionary = await loader();
    // The loaded JSON is the dictionary itself.
    return dictionary;
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error);
    // Fallback to English dictionary in case of any error
    const fallbackLoader = dictionaries.en;
    return fallbackLoader();
  }
};
