/** @type {import('next-sitemap').IConfig} */
const { i18nConfig } = require('./src/lib/i18n-config');
const { pages } = require('./src/data/pages');

const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

// This function generates the full list of URLs for the sitemap.
// It iterates through each page and each locale to create a complete sitemap entry.
const generateSitemapPaths = () => {
  const allPageUrls = [];

  pages.forEach(page => {
    i18nConfig.locales.forEach(locale => {
      // Base slug, handle homepage case
      const slug = page.slug === '/' ? '' : page.slug;
      
      // The primary URL for this sitemap entry
      const loc = `${siteUrl}/${locale}${slug}`;

      // Create alternate language references for this page
      const alternateRefs = i18nConfig.locales.map(altLocale => ({
        href: `${siteUrl}/${altLocale}${slug}`,
        hreflang: altLocale,
      }));

      allPageUrls.push({
        loc: loc,
        lastmod: page.lastModified,
        changefreq: page.changefreq,
        priority: page.priority,
        alternateRefs: alternateRefs,
      });
    });
  });
  
  return allPageUrls;
};

module.exports = {
  siteUrl: siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false, // We want a single sitemap file
  
  // Use additionalPaths to programmatically generate all our URLs.
  // We return a function that returns the array of paths.
  additionalPaths: async (config) => {
    const paths = generateSitemapPaths();
    // The library expects an array of path objects, so we return what we generated.
    return paths;
  },
};
