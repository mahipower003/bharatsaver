/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://bharatsaver.com',
  generateRobotsTxt: true,
  // This flag is important for next-sitemap to correctly handle
  // the alternate links generated in sitemap.ts
  generateIndexSitemap: false,
};
