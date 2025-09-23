/**
 * generate-sitemaps.js
 *
 * Generates:
 *  - public/sitemap.xml        (the index sitemap)
 *  - public/sitemap-<locale>.xml (per-locale sitemap files)
 *
 * Assumes Next.js with i18n path prefixes (e.g., /hi/about).
 */

const fs = require('fs');
const path = require('path');
const { calculators } = require('../src/data/calculators');

// === CONFIG ===
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const baseUrl = "https://bharatsaver.com"; // your prod domain
const locales = ["en", "hi", "mr", "ta", "te"]; // all locales
const defaultLocale = "en";

// Combine static routes with dynamic calculator routes
const staticRoutes = ["/", "/about", "/contact", "/blog", "/guides", "/calculators", "/terms", "/author/mahesh-chaube"];
const calculatorRoutes = calculators.map(c => `/${c.slug}`);
const allRoutes = [...staticRoutes, ...calculatorRoutes];

// === END CONFIG ===

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildLocaleUrl(route, locale) {
  const base = baseUrl.replace(/\/$/, "");
  if (locale === defaultLocale) {
    return route === "/" ? base + "/" : `${base}${route}`;
  }
  return `${base}/${locale}${route === "/" ? "" : route}`;
}


function buildSitemapXml(locale, routes) {
  const stylesheet = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';
  const header =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `${stylesheet}\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  const footer = `</urlset>\n`;

  const body = routes
    .map((r) => {
      const loc = buildLocaleUrl(r, locale);
      // For now, using current date. Ideally, you'd get this from your data source.
      const lastMod = new Date().toISOString(); 
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastMod}</lastmod>\n  </url>`;
    })
    .join("\n");

  return header + body + "\n" + footer;
}

// 1. Generate per-locale sitemaps
const sitemapFiles = [];
for (const loc of locales) {
  const xml = buildSitemapXml(loc, allRoutes);
  const fname = `sitemap-${loc}.xml`;
  fs.writeFileSync(path.join(OUT_DIR, fname), xml, "utf8");
  // CRITICAL FIX: The URL to the sitemap file itself should be at the root.
  sitemapFiles.push({ file: fname, url: `${baseUrl}/${fname}` });
  console.log(`✅ Wrote ${fname} with ${allRoutes.length} routes`);
}

// 2. Generate sitemap.xml (index)
const stylesheet = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';
const indexHeader =
  `<?xml version="1.0" encoding="UTF-8"?>\n${stylesheet}\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
const indexFooter = `</sitemapindex>\n`;
const indexBody = sitemapFiles
  .map(
    (s) =>
      `  <sitemap>\n    <loc>${escapeXml(s.url)}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n  </sitemap>`
  )
  .join("\n");

const indexXml = indexHeader + indexBody + "\n" + indexFooter;
fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), indexXml, "utf8");

console.log("✅ Wrote sitemap.xml (index) with references to:", sitemapFiles.map(f => f.file).join(", "));
