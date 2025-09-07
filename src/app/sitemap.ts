import { MetadataRoute } from 'next';
import { pages } from '@/data/pages';
import { i18nConfig } from '@/lib/i18n-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const { locales, defaultLocale } = i18nConfig;

  const sitemapEntries: MetadataRoute.Sitemap = pages.map((page) => {
    const slug = page.slug === '/' ? '' : page.slug;
    
    const alternates: { [key: string]: string } = {};
    locales.forEach((locale) => {
      alternates[locale] = `${siteUrl}/${locale}${slug}`;
    });

    return {
      url: `${siteUrl}/${defaultLocale}${slug}`,
      lastModified: new Date(page.lastModified),
      changeFrequency: page.changefreq,
      priority: page.priority,
      alternates: {
        languages: alternates,
      },
    };
  });

  return sitemapEntries;
}
