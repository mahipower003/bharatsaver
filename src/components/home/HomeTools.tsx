
'use client';

import { PopularTools } from '@/components/home/PopularTools';
import type { Locale } from '@/lib/i18n-config';
import type { Dictionary } from '@/types';

type HomeToolsProps = {
  lang: Locale;
  dictionary: Dictionary['home']['popular_tools'];
};

export function HomeTools({ lang, dictionary }: HomeToolsProps) {
  if (!dictionary) {
    return null; // Or a loading skeleton
  }

  return <PopularTools lang={lang} dictionary={dictionary} />;
}
