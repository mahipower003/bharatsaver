
import { MetadataRoute } from 'next';
import { i18nConfig } from '@/lib/i18n-config';
import { pages } from '@/data/pages';

const BASE_URL = process.env.SITE_URL || 'https://bharatsaver.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const { locales, defaultLocale } = i18nConfig;

  return pages.map(page => {
    const pagePath = page.slug === '/' ? '' : page.slug;
    
    // Create a map of locales to absolute URLs for the alternates object
    const languages = locales.reduce((acc, locale) => {
      acc[locale] = `${BASE_URL}/${locale}${pagePath}`;
      return acc;
    }, {} as Record<string, string>);

    return {
      url: `${BASE_URL}/${defaultLocale}${pagePath}`,
      lastModified: new Date(page.lastModified),
      changeFrequency: page.changefreq,
      priority: page.priority,
      alternates: {
        languages,
      },
    };
  });
}
