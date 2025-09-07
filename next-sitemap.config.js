/** @type {import('next-sitemap').IConfig} */
const { i18nConfig } = require('./src/lib/i18n-config');
const { pages } = require('./src/data/pages');

const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

// Generate URLs for all pages and locales
const allPageUrls = pages.flatMap(page => {
  // Create alternate refs for this page in all locales
  const alternateRefs = i18nConfig.locales.map(altLocale => {
    const slug = page.slug === '/' ? '' : page.slug;
    return {
      href: `${siteUrl}/${altLocale}${slug}`,
      hreflang: altLocale,
    };
  });
  
  // Create a sitemap entry for each locale of the page
  return i18nConfig.locales.map(locale => {
    const slug = page.slug === '/' ? '' : page.slug;
    const path = `${siteUrl}/${locale}${slug}`;
    
    return {
      loc: path,
      lastmod: page.lastModified,
      changefreq: page.changefreq,
      priority: page.priority,
      alternateRefs: alternateRefs,
    };
  });
});


module.exports = {
  siteUrl: siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  // The source of all URLs is our programmatically generated list
  // We use additionalPaths and return absolute URLs, so the library will use them directly
  additionalPaths: async (config) => {
    return allPageUrls;
  },
  // Exclude the default Next.js sitemap route
  exclude: ['/sitemap'],
};
