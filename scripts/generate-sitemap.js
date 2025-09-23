
// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');

// Manually define i18nConfig to avoid import issues
const i18nConfig = {
  locales: ['en', 'hi', 'mr', 'ta', 'te'],
  defaultLocale: 'en',
};

// Manually define calculators to avoid import issues
const calculators = [
  { slug: 'ppf-calculator', lastModified: '2024-07-28', priority: 0.9, changefreq: 'monthly' },
  { slug: 'ssy-calculator', lastModified: '2024-07-27', priority: 0.9, changefreq: 'monthly' },
  { slug: 'nps-calculator', lastModified: '2024-07-26', priority: 0.9, changefreq: 'monthly' },
  { slug: 'apy-calculator', lastModified: '2024-07-25', priority: 0.9, changefreq: 'monthly' },
  { slug: 'fd-vs-ppf-calculator', lastModified: '2024-07-24', priority: 0.9, changefreq: 'monthly' },
  { slug: 'tax-regime-calculator', lastModified: '2024-07-30', priority: 0.9, changefreq: 'monthly' },
  { slug: 'retirement-corpus-calculator', lastModified: '2024-07-22', priority: 0.9, changefreq: 'monthly' },
  { slug: 'loan-optimizer', lastModified: '2024-08-01', priority: 0.9, changefreq: 'monthly' },
  { slug: 'mutual-fund-overlap-calculator', lastModified: '2024-07-20', priority: 0.9, changefreq: 'monthly' },
  { slug: 'ups-pension-calculator', lastModified: '2024-08-02', priority: 0.9, changefreq: 'monthly' },
  { slug: 'mutual-fund-screener', lastModified: '2024-08-05', priority: 0.9, changefreq: 'monthly' },
];

const staticPages = [
  { slug: '/', lastModified: '2024-07-29', priority: 1.0, changefreq: 'weekly' },
  { slug: '/about', lastModified: '2024-07-29', priority: 0.5, changefreq: 'monthly' },
  { slug: '/blog', lastModified: '2024-07-29', priority: 0.7, changefreq: 'weekly' },
  { slug: '/calculators', lastModified: '2024-07-29', priority: 0.8, changefreq: 'monthly' },
  { slug: '/contact', lastModified: '2024-07-29', priority: 0.3, changefreq: 'yearly' },
  { slug: '/guides', lastModified: '2024-07-29', priority: 0.6, changefreq: 'monthly' },
  { slug: '/terms', lastModified: '2024-07-29', priority: 0.3, changefreq: 'yearly' },
  { slug: '/author/mahesh-chaube', lastModified: '2024-07-29', priority: 0.4, changefreq: 'monthly' },
];

const allPages = [...staticPages, ...calculators];

const siteUrl = 'https://bharatsaver.com';

function generateSitemap(pages, locale) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${pages
    .map((page) => {
      const getUrl = (loc) => {
        const isDefaultLocale = loc === i18nConfig.defaultLocale;
        const slug = page.slug.startsWith('/') ? page.slug : `/${page.slug}`;
        const path = slug === '/' ? '' : slug;
        return isDefaultLocale ? `${siteUrl}${path}` : `${siteUrl}/${loc}${path}`;
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
