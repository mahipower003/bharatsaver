/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://bharatsaver.com',
  generateRobotsTxt: true,
  // Note: The sitemap generation is now handled by src/app/sitemap.ts
  // next-sitemap will use the output of that file.
  // We disable alternateRefs because we are generating them manually in sitemap.ts
  alternateRefs: [],
};
