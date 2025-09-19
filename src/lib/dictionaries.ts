
import 'server-only';
import type { Locale } from './i18n-config';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then(module => module.default),
  hi: () => import('@/dictionaries/hi.json').then(module => module.default),
  mr: () => import('@/dictionaries/mr.json').then(module => module.default),
  ta: () => import('@/dictionaries/ta.json').then(module => module.default),
  te: () => import('@/dictionaries/te.json').then(module => module.default),
};

const pageDictionaries: Record<string, (locale: Locale) => Promise<any>> = {
    'mutual-fund-screener': (locale: Locale) => {
        switch (locale) {
            case 'en':
                return import('@/dictionaries/en/mutual-fund-screener.json').then(module => module.default);
            case 'hi':
                return import('@/dictionaries/hi/mutual-fund-screener.json').then(module => module.default);
            case 'mr':
                return import('@/dictionaries/mr/mutual-fund-screener.json').then(module => module.default);
            case 'ta':
                return import('@/dictionaries/ta/mutual-fund-screener.json').then(module => module.default);
            case 'te':
                return import('@/dictionaries/te/mutual-fund-screener.json').then(module => module.default);
            default:
                return import('@/dictionaries/en/mutual-fund-screener.json').then(module => module.default);
        }
    }
};

export const getDictionary = async (locale: Locale, keys: string[] = []) => {
    const baseDictionary = await dictionaries[locale]();
    const resultDictionary: any = { ...baseDictionary };

    for (const key of keys) {
        if (pageDictionaries[key]) {
            const pageDict = await pageDictionaries[key](locale);
            if (pageDict) {
                resultDictionary[key] = pageDict;
            }
        }
    }

    if (keys.length === 0) {
        return resultDictionary;
    }

    // This filtering logic seems complex and might be the source of issues.
    // Let's simplify: if keys are provided, we assume they are top-level and already loaded.
    // The logic above should handle page-specific dictionaries correctly.
    const filteredDictionary: any = {};
    for (const key of keys) {
        if (resultDictionary[key]) {
            filteredDictionary[key] = resultDictionary[key];
        }
    }

    // If no specific keys were found in the page dictionaries, return the base dictionary.
    // This part is tricky. A better approach is to merge dictionaries.
    // Let's stick with the merged approach from above (resultDictionary).

    return resultDictionary;
};
