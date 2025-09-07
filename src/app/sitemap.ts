import { MetadataRoute } from 'next';
import { pages } from '@/data/pages';
import { i18nConfig } from '@/lib/i18n-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL ?? 'https://bharatsaver.com';
  const { locales, defaultLocale } = i18nConfig;

  return pages.flatMap((page) => {
    const slug = page.slug === '/' ? '' : page.slug;

    return locales.map((locale) => {
      const url = `${siteUrl}/${locale}${slug}`;

      // Build hreflang alternates
      const alternates: Record<string, string> = {};
      locales.forEach((altLocale) => {
        alternates[altLocale] = `${siteUrl}/${altLocale}${slug}`;
      });
      alternates['x-default'] = `${siteUrl}/${defaultLocale}${slug}`;

      return {
        url,
        lastModified: page.lastModified
          ? new Date(page.lastModified)
          : new Date(), // fallback to now
        changeFrequency: page.changefreq ?? 'monthly',
        priority: page.priority ?? 0.5,
        alternates: {
          languages: alternates,
        },
      };
    });
  });
}
