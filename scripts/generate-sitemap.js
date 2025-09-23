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
// This relies on the project being able to require .ts files.
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

function buildPageUrl(slug, locale) {
  const base = BASE_URL.replace(/\/$/, '');
  if (locale === DEFAULT_LOCALE) {
    return slug === '/' ? base + '/' : `${base}${slug}`;
  }
  return `${base}/${locale}${slug}`;
}


// --- Main Logic ---

function generateSitemaps() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const sitemapFiles = [];
  const stylesheet = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';

  // 1. Generate per-locale sitemaps
  for (const locale of LOCALES) {
    const sitemapContent = pages
      .map((page) => {
        const url = buildPageUrl(page.slug, locale);
        const lastMod = new Date(page.lastModified).toISOString();
        return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`;
      })
      .join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
${stylesheet}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapContent}
</urlset>`;

    const fileName = `sitemap-${locale}.xml`;
    fs.writeFileSync(path.join(OUT_DIR, fileName), sitemapXml, 'utf8');
    // The URL to the sitemap file itself is always at the root
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
${stylesheet}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexBody}
</sitemapindex>`;

  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), indexXml, 'utf8');
  console.log(`✅ Wrote sitemap.xml (index) referencing: ${sitemapFiles.map(f => f.file).join(', ')}`);
}

// Run the generation
generateSitemaps();
