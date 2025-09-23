/**
 * generate-sitemaps.js
 *
 * This script generates a sitemap index and individual sitemaps for each locale.
 * - public/sitemap.xml: The sitemap index file.
 * - public/sitemap-[locale].xml: Sitemap for each language.
 *
 * It dynamically pulls routes from the `calculators.ts` data file.
 */

const fs = require('fs');
const path = require('path');
const { calculators } = require('../dist/data/calculators'); // Use compiled JS file

// === CONFIGURATION ===
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public');
const BASE_URL = "https://bharatsaver.com"; // Your production domain
const LOCALES = ["en", "hi", "mr", "ta", "te"];
const DEFAULT_LOCALE = "en";

// Define static routes (add new static pages here)
const STATIC_ROUTES = ["/", "/about", "/contact", "/blog", "/guides", "/calculators", "/terms", "/author/mahesh-chaube"];
// === END CONFIGURATION ===

// Helper to escape XML special characters
function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Builds a URL for a specific page route and locale.
 * - For default locale, it's https://domain.com/page
 * - For other locales, it's https://domain.com/hi/page
 */
function buildPageUrl(route, locale) {
  const url = new URL(BASE_URL);
  if (locale === DEFAULT_LOCALE) {
    url.pathname = route;
  } else {
    url.pathname = `/${locale}${route}`;
  }
  return url.href.replace(/\/$/, "") || url.href; // Handle root path
}

// 1. Get all routes
const calculatorRoutes = calculators.map(c => `/${c.slug}`);
const allRoutes = [...STATIC_ROUTES, ...calculatorRoutes];

// 2. Generate per-locale sitemaps (e.g., sitemap-en.xml)
const sitemapIndexEntries = [];
for (const locale of LOCALES) {
  const urls = allRoutes.map(route => {
    const loc = buildPageUrl(route, locale);
    const lastmod = new Date().toISOString(); 
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  }).join('\n');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  const filename = `sitemap-${locale}.xml`;
  fs.writeFileSync(path.join(OUT_DIR, filename), sitemapContent, 'utf8');
  console.log(`✅ Generated ${filename} with ${allRoutes.length} routes.`);

  // Entry for the sitemap index file
  // **CORRECTED LOGIC**: The URL for the sitemap file itself does NOT have a locale prefix.
  const sitemapUrl = `${BASE_URL}/${filename}`;
  sitemapIndexEntries.push(`  <sitemap>
    <loc>${escapeXml(sitemapUrl)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`);
}

// 3. Generate the sitemap index file (sitemap.xml)
const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapIndexEntries.join('\n')}
</sitemapindex>`;

fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemapIndexContent, 'utf8');
console.log(`✅ Generated sitemap.xml (index) linking to ${sitemapIndexEntries.length} sitemaps.`);

// 4. Create sitemap.xsl for styling
const xslContent = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>XML Sitemap</title>
        <style>
          body { font-family: sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
          th { background-color: #f2f2f2; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is an XML sitemap, typically used by search engines to index a website's content.</p>
        <xsl:choose>
          <xsl:when test="/s:sitemapindex">
            <h2>Sitemap Index</h2>
            <table>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
              </tr>
              <xsl:for-each select="/s:sitemapindex/s:sitemap">
                <tr>
                  <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                  <td><xsl:value-of select="s:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </table>
          </xsl:when>
          <xsl:when test="/s:urlset">
            <h2>URL Set</h2>
            <table>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
              </tr>
              <xsl:for-each select="/s:urlset/s:url">
                <tr>
                  <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                  <td><xsl:value-of select="s:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </table>
          </xsl:when>
        </xsl:choose>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xsl'), xslContent, 'utf8');
console.log('✅ Generated sitemap.xsl for styling.');
