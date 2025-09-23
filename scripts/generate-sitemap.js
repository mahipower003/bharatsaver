/**
 * generate-sitemap.js
 *
 * This script generates a sitemap index and individual sitemap files for each locale.
 * It reads page data from `src/data/pages.ts` to build the URLs.
 *
 * To run: `node scripts/generate-sitemap.js`
 */

const fs = require('fs');
const path = require('path');

// --- Configuration ---
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public');
const BASE_URL = 'https://bharatsaver.com';
const LOCALES = ['en', 'hi', 'mr', 'ta', 'te'];
const DEFAULT_LOCALE = 'en';

// Import pages data directly.
const { pages } = require('../src/data/pages.ts');

// --- Helper Functions ---

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildLocaleUrl(slug, locale) {
  if (locale === DEFAULT_LOCALE) {
    return `${BASE_URL}${slug}`;
  }
  return `${BASE_URL}/${locale}${slug}`;
}

// --- Main Logic ---

function generateSitemaps() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const sitemapFiles = [];

  // 1. Generate per-locale sitemaps
  for (const locale of LOCALES) {
    const sitemapContent = pages
      .map((page) => {
        const url = buildLocaleUrl(page.slug, locale);
        return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${new Date(page.lastModified).toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`;
      })
      .join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapContent}
</urlset>`;

    const fileName = `sitemap-${locale}.xml`;
    fs.writeFileSync(path.join(OUT_DIR, fileName), sitemapXml, 'utf8');
    sitemapFiles.push({ file: fileName, url: `${BASE_URL}/${fileName}` });
    console.log(`✅ Wrote ${fileName} with ${pages.length} routes`);
  }

  // 2. Generate sitemap.xml (index)
  const indexBody = sitemapFiles
    .map(
      (s) =>
        `  <sitemap>
    <loc>${escapeXml(s.url)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
    )
    .join('\n');

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexBody}
</sitemapindex>`;

  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), indexXml, 'utf8');
  console.log(`✅ Wrote sitemap.xml (index) referencing: ${sitemapFiles.map(f => f.file).join(', ')}`);
}

// Run the generation
generateSitemaps();
