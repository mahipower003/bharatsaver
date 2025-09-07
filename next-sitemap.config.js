/** @type {import('next-sitemap').IConfig} */
const { i18nConfig } = require('./src/lib/i18n-config');

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://bharatsaver.com',
  generateRobotsTxt: true,
  // This flag is important for next-sitemap to correctly handle
  // the alternate links generated in sitemap.ts
  generateIndexSitemap: false,
  // This tells next-sitemap to add alternate links to the sitemap.
  // The sitemap() function in sitemap.ts provides these alternates.
  alternateRefs: i18nConfig.locales.map(locale => ({
    href: `${process.env.SITE_URL || 'https://bharatsaver.com'}/${locale}`,
    hreflang: locale,
  })),
};
