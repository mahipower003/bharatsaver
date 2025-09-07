/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://bharatsaver.com',
  generateRobotsTxt: true,
  // This flag is important for next-sitemap to correctly handle
  // the alternate links generated in sitemap.ts
  generateIndexSitemap: false,
  // This ensures that the alternate links are generated correctly.
  // The library will automatically create the <xhtml:link> tags.
  alternateRefs: i18nConfig.locales.map(locale => ({
    href: `${process.env.SITE_URL || 'https://bharatsaver.com'}/${locale}`,
    hreflang: locale,
  })),
  // This function is not strictly needed when using the alternates object from sitemap.ts
  // but it's a good practice to ensure all pages are covered.
  transform: async (config, path) => {
    const { locales, defaultLocale } = require('./src/lib/i18n-config');
    const nonDefaultLocales = locales.filter((l) => l !== defaultLocale);

    // Create alternateRefs for each path
    const alternateRefs = nonDefaultLocales.map((locale) => ({
      href: `${config.siteUrl}/${locale}${path.replace(`/${defaultLocale}`, '')}`,
      hreflang: locale,
    }));
    
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs,
    };
  },
};
