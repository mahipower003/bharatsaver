/** @type {import('next-sitemap').IConfig} */
const { i18nConfig } = require('./src/lib/i18n-config');
const { pages } = require('./src/data/pages');

const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

// Generate URLs for all pages and locales
const allPageUrls = pages.flatMap(page => {
  return i18nConfig.locales.map(locale => {
    const slug = page.slug === '/' ? '' : page.slug;
    const path = `${siteUrl}/${locale}${slug}`;
    
    // Create alternate refs for this page in all locales
    const alternateRefs = i18nConfig.locales.map(altLocale => ({
      href: `${siteUrl}/${altLocale}${slug}`,
      hreflang: altLocale,
    }));

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
  generateIndexSitemap: false, // We'll create a single sitemap
  // The source of all URLs is our programmatically generated list
  additionalPaths: async (config) => {
    // The library expects relative paths for `loc` if we return from here.
    // However, since we are providing the full object with `alternateRefs`
    // which need to be absolute, we will return the pre-generated absolute URLs.
    // The library will handle them correctly.
    return allPageUrls;
  },
};