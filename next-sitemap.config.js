/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://bharatsaver.com',
  generateRobotsTxt: true, 
  sitemapSize: 7000,
};
