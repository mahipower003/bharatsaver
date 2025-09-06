import { MetadataRoute } from 'next';
import { i18nConfig } from '@/lib/i18n-config';
import { calculators } from '@/data/calculators';

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

  const staticRoutes = ['', '/calculators', '/guides', '/blog', '/terms', '/contact', '/about', '/search'];
  const calculatorRoutes = calculators.map(c => `/${c.slug}`);
  const allRoutes = [...staticRoutes, ...calculatorRoutes];

  const sitemapEntries: SitemapEntry[] = allRoutes.map(route => {
    const alternates: Record<string, string> = {};
    locales.forEach(locale => {
      alternates[locale] = `${BASE_URL}/${locale}${route}`;
    });

    return {
      url: `${BASE_URL}/${defaultLocale}${route}`,
      lastModified: new Date(),
      alternates: {
        languages: alternates,
      },
    };
  });

  return sitemapEntries;
}
