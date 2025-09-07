
import { MetadataRoute } from 'next';
import { i18nConfig } from '@/lib/i18n-config';
import { pages } from '@/data/pages';

const BASE_URL = process.env.SITE_URL || 'https://bharatsaver.com';

type SitemapEntry = {
  url: string;
  lastModified?: string | Date;
  alternates?: {
    languages: Record<string, string>;
  };
};

export default function sitemap(): MetadataRoute.Sitemap {
  const { locales } = i18nConfig;

  const sitemapEntries: SitemapEntry[] = pages.flatMap(page => {
    // For each page, create a sitemap entry for each locale
    return locales.map(locale => {
      const pagePath = page.slug === '/' ? '' : page.slug;
      
      // Create alternate links for each locale
      const alternates: Record<string, string> = {};
      locales.forEach(altLocale => {
        alternates[altLocale] = `${BASE_URL}/${altLocale}${pagePath}`;
      });

      return {
        url: `${BASE_URL}/${locale}${pagePath}`,
        lastModified: new Date(page.lastModified),
        alternates: {
          languages: alternates,
        },
      };
    });
  });

  return sitemapEntries;
}
