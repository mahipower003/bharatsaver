import 'server-only';
import type { Locale } from './i18n-config';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then(module => module.default),
  hi: () => import('@/dictionaries/hi.json').then(module => module.default),
  mr: () => import('@/dictionaries/mr.json').then(module => module.default),
  ta: () => import('@/dictionaries/ta.json').then(module => module.default),
  te: () => import('@/dictionaries/te.json').then(module => module.default),
};

export const getDictionary = async (locale: Locale, keys: string[] = []) => {
  const loader = dictionaries[locale] || dictionaries.en;
  const dictionary = await loader();

  if (keys.length === 0) {
    return dictionary;
  }

  const filteredDictionary: any = {};
  for (const key of keys) {
    const keyParts = key.split('.');
    let currentDictLevel: any = dictionary;
    let currentFilteredLevel: any = filteredDictionary;

    for (let i = 0; i < keyParts.length; i++) {
      const part = keyParts[i];
      if (currentDictLevel[part] !== undefined) {
        if (i === keyParts.length - 1) {
          currentFilteredLevel[part] = currentDictLevel[part];
        } else {
          currentFilteredLevel[part] = currentFilteredLevel[part] || {};
          currentFilteredLevel = currentFilteredLevel[part];
          currentDictLevel = currentDictLevel[part];
        }
      }
    }
  }

  return filteredDictionary;
};
