
import { MetadataRoute } from 'next';
import { i18nConfig } from '@/lib/i18n-config';
import { pages } from '@/data/pages';

const BASE_URL = process.env.SITE_URL || 'https://bharatsaver.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const { locales } = i18nConfig;

  const sitemapEntries: MetadataRoute.Sitemap = [];

  pages.forEach(page => {
    // For each page, create an entry for every locale, and for each of those entries,
    // add alternate links for all other locales.
    locales.forEach(locale => {
        const pagePath = page.slug === '/' ? '' : page.slug;
        const currentUrl = `${BASE_URL}/${locale}${pagePath}`;
        
        const alternates: Record<string, string> = {};
        locales.forEach(altLocale => {
            alternates[altLocale] = `${BASE_URL}/${altLocale}${pagePath}`;
        });

        sitemapEntries.push({
            url: currentUrl,
            lastModified: new Date(page.lastModified),
            changeFrequency: page.changefreq,
            priority: page.priority,
            alternates: {
                languages: alternates,
            },
        });
    });
  });

  // The next-sitemap library, used in the postbuild script,
  // will now correctly consume this array and generate the full XML
  // structure with <urlset>, <url>, <loc>, and the required <xhtml:link> tags.
  // We only need to return one URL per page, and next-sitemap handles the alternates.
  // The logic below simplifies this to one canonical entry per page, letting the library do the work.

  return pages.map(page => {
    const pagePath = page.slug === '/' ? '' : page.slug;
    
    const alternates: Record<string, string> = {};
    locales.forEach(altLocale => {
      alternates[altLocale] = `${BASE_URL}/${altLocale}${pagePath}`;
    });

    return {
      url: `${BASE_URL}/${i18nConfig.defaultLocale}${pagePath}`,
      lastModified: new Date(page.lastModified),
      changeFrequency: page.changefreq,
      priority: page.priority,
      alternates: {
        languages: alternates,
      },
    };
  });
}
