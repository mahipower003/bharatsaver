import { MetadataRoute } from 'next';
import { pages } from '@/data/pages';
import { i18nConfig } from '@/lib/i18n-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const { locales } = i18nConfig;

  const sitemapEntries: MetadataRoute.Sitemap = [];

  pages.forEach((page) => {
    locales.forEach((locale) => {
      const slug = page.slug === '/' ? '' : page.slug;
      const url = `${siteUrl}/${locale}${slug}`;

      const alternates: { [key: string]: string } = {};
      locales.forEach((altLocale) => {
        alternates[altLocale] = `${siteUrl}/${altLocale}${slug}`;
      });

      sitemapEntries.push({
        url: url,
        lastModified: new Date(page.lastModified),
        changeFrequency: page.changefreq,
        priority: page.priority,
        alternates: {
          languages: alternates,
        },
      });
    });
  });

  return sitemapEntries;
}
