
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
  const { locales, defaultLocale } = i18nConfig;

  // Get all unique slugs from the pages data
  const allRoutes = pages.map(p => p.slug === '/' ? '' : p.slug);

  const sitemapEntries: SitemapEntry[] = allRoutes.map(route => {
    const pageData = pages.find(p => p.slug === (route === '' ? '/' : route));
    
    // Create alternate links for each locale
    const alternates: Record<string, string> = {};
    locales.forEach(locale => {
      alternates[locale] = `${BASE_URL}/${locale}${route}`;
    });

    return {
      url: `${BASE_URL}/${defaultLocale}${route}`,
      lastModified: pageData ? new Date(pageData.lastModified) : new Date(),
      alternates: {
        languages: alternates,
      },
    };
  });

  return sitemapEntries;
}
