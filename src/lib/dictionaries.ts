
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
    'mutual_fund_screener': (locale: Locale) => {
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

    return resultDictionary;
};
