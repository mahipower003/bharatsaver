/** @type {import('next-sitemap').IConfig} */
const { i18nConfig } = require('./src/lib/i18n-config');
const { pages } = require('./src/data/pages');

const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

// Base configuration
const config = {
  siteUrl: siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false, // We'll create a single sitemap
};

// Generate URLs for all pages and locales
const allPageUrls = pages.flatMap(page => {
  return i18nConfig.locales.map(locale => {
    const slug = page.slug === '/' ? '' : page.slug;
    const path = `/${locale}${slug}`;
    
    // Create alternate refs for this page in all locales
    const alternateRefs = i18nConfig.locales.map(altLocale => ({
      href: `${siteUrl}/${altLocale}${slug}`,
      hreflang: altLocale,
    }));

    return {
      loc: path, // next-sitemap will make this absolute
      lastmod: page.lastModified,
      changefreq: page.changefreq,
      priority: page.priority,
      alternateRefs: alternateRefs,
    };
  });
});

module.exports = {
  ...config,
  // The source of all URLs is our programmatically generated list
  additionalPaths: async (cfg) => {
    return allPageUrls.map(page => ({
        loc: page.loc,
        lastmod: page.lastmod,
        changefreq: page.changefreq,
        priority: page.priority,
        alternateRefs: page.alternateRefs,
    }));
  },
};
