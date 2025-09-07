
import { MetadataRoute } from 'next';
import { i18nConfig } from '@/lib/i18n-config';
import { pages } from '@/data/pages';

const BASE_URL = process.env.SITE_URL || 'https://bharatsaver.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const { locales } = i18nConfig;

  const sitemapEntries: MetadataRoute.Sitemap = [];

  pages.forEach(page => {
    // We create an entry for each locale of a page
    // but the alternates will point to all locales
    // This is because some tools expect one URL per <url> entry
    
    const pagePath = page.slug === '/' ? '' : page.slug;
    
    // Create alternate links for each locale for the current page
    const alternates: Record<string, string> = {};
    locales.forEach(altLocale => {
      alternates[altLocale] = `${BASE_URL}/${altLocale}${pagePath}`;
    });

    locales.forEach(locale => {
       sitemapEntries.push({
        url: `${BASE_URL}/${locale}${pagePath}`,
        lastModified: new Date(page.lastModified),
        changeFrequency: page.changefreq,
        priority: page.priority,
        alternates: {
          languages: alternates,
        },
      });
    })
  });

  // To avoid duplication, we'll create a unique set of URLs.
  // Although we iterate through each locale for a page, the URL with alternates is the same.
  // We can just pick the first one for each page slug.
  const uniqueSitemapEntries = pages.map(page => {
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
    }
  });


  // The `next-sitemap` library handles the XML structure.
  // What we return here is an array of objects that will be converted to the XML.
  return uniqueSitemapEntries;
}
