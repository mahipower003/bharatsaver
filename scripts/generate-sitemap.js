
// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');
const { calculators } = require('../dist/data/calculators');
const { i18nConfig } = require('../dist/lib/i18n-config');


const staticPages = [
  { slug: '/', lastModified: '2024-07-29', priority: 1.0, changefreq: 'weekly' },
  { slug: '/about', lastModified: '2024-07-29', priority: 0.5, changefreq: 'monthly' },
  { slug: '/blog', lastModified: '2024-07-29', priority: 0.7, changefreq: 'weekly' },
  { slug: '/calculators', lastModified: '2024-07-29', priority: 0.8, changefreq: 'monthly' },
  { slug: '/contact', lastModified: '2024-08-29', priority: 0.3, changefreq: 'yearly' },
  { slug: '/guides', lastModified: '2024-07-29', priority: 0.6, changefreq: 'monthly' },
  { slug: '/terms', lastModified: '2024-07-29', priority: 0.3, changefreq: 'yearly' },
  { slug: '/author/mahesh-chaube', lastModified: '2024-07-29', priority: 0.4, changefreq: 'monthly' },
];

// Add priority and changefreq to calculator pages
const calculatorPages = calculators.map(calc => ({
    ...calc,
    priority: 0.9,
    changefreq: 'monthly'
}));


const allPages = [...staticPages, ...calculatorPages];

const siteUrl = 'https://bharatsaver.com';

function generateSitemap(pages, locale) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${pages
    .map((page) => {
      const getUrl = (loc) => {
        const isDefaultLocale = loc === i18nConfig.defaultLocale;
        const slug = page.slug.startsWith('/') ? page.slug : `/${page.slug}`;
        const path = isDefaultLocale ? (slug === '/' ? '' : slug) : `/${loc}${slug === '/' ? '' : slug}`;
        return `${siteUrl}${path}`;
      };

      const url = getUrl(locale);
      
      const alternates = i18nConfig.locales
        .map(
          (altLocale) =>
            `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${getUrl(altLocale)}" />`
        )
        .join('\n    ');

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${alternates}
  </url>`;
    })
    .join('')}
</urlset>`;
  return sitemap;
}

function main() {
  const publicPath = path.join(process.cwd(), 'public');

  i18nConfig.locales.forEach((locale) => {
    const sitemap = generateSitemap(allPages, locale);
    const sitemapPath = path.join(publicPath, `sitemap-${locale}.xml`);
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`Generated sitemap for ${locale} at ${sitemapPath}`);
  });

  // Create main sitemap index file
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${i18nConfig.locales
    .map((locale) => `<sitemap><loc>${siteUrl}/sitemap-${locale}.xml</loc></sitemap>`)
    .join('\n  ')}
</sitemapindex>`;

  const indexPath = path.join(publicPath, 'sitemap.xml');
  fs.writeFileSync(indexPath, sitemapIndex);
  console.log(`Generated sitemap index at ${indexPath}`);
}

main();
