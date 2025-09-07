
import { MetadataRoute } from 'next';
import { i18nConfig } from '@/lib/i18n-config';
import { pages } from '@/data/pages';

const BASE_URL = process.env.SITE_URL || 'https://bharatsaver.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const { locales, defaultLocale } = i18nConfig;

  const sitemapEntries: MetadataRoute.Sitemap = [];

  pages.forEach(page => {
    const pagePath = page.slug === '/' ? '' : page.slug;
    
    // Create the object for alternate links
    const alternates: Record<string, string> = {};
    locales.forEach(altLocale => {
      alternates[altLocale] = `${BASE_URL}/${altLocale}${pagePath}`;
    });

    // Create a sitemap entry for each page.
    // The 'alternates' object will correctly generate the <xhtml:link> tags.
    // The `next-sitemap` library handles the XML structure based on this object.
    sitemapEntries.push({
      url: `${BASE_URL}/${defaultLocale}${pagePath}`,
      lastModified: new Date(page.lastModified),
      changeFrequency: page.changefreq,
      priority: page.priority,
      alternates: {
        languages: alternates,
      },
    });
  });

  // next-sitemap library, which is used in postbuild script,
  // will consume this array and generate the correct XML structure
  // with <urlset>, <url>, <loc>, <lastmod>, <changefreq>, <priority>,
  // and the <xhtml:link> tags for each language.
  return sitemapEntries;
}
