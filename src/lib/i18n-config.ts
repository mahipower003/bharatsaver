export const i18nConfig = {
  locales: ['en', 'hi', 'mr', 'ta', 'te'],
  defaultLocale: 'en',
} as const;

export type Locale = (typeof i18nConfig)['locales'][number];
