const fs = require('fs');
const path = require('path');

const sitemaps = [
  { file: 'sitemap-en.xml', lang: 'en' },
  { file: 'sitemap-hi.xml', lang: 'hi' },
  { file: 'sitemap-mr.xml', lang: 'mr' },
  { file: 'sitemap-ta.xml', lang: 'ta' },
  { file: 'sitemap-te.xml', lang: 'te' },
];

const newRoutes = [
  'lic-policy-status',
  'lic-premium-receipt-download',
  'lic-vs-sip'
];

const date = new Date().toISOString().split('T')[0];

sitemaps.forEach(({ file, lang }) => {
  const filePath = path.join(__dirname, 'public', file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if routes already exist to avoid duplicates
  const routesToAdd = newRoutes.filter(route => !content.includes(`<loc>https://bharatsaver.com/${lang === 'en' ? '' : lang + '/'}${route}</loc>`));

  if (routesToAdd.length === 0) {
    console.log(`${file} is already up to date.`);
    return;
  }

  let newXmlNodes = '';
  routesToAdd.forEach(route => {
    const loc = lang === 'en' ? `https://bharatsaver.com/${route}` : `https://bharatsaver.com/${lang}/${route}`;
    newXmlNodes += `
  <url>
    <loc>${loc}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://bharatsaver.com/${route}" />
    <xhtml:link rel="alternate" hreflang="hi" href="https://bharatsaver.com/hi/${route}" />
    <xhtml:link rel="alternate" hreflang="mr" href="https://bharatsaver.com/mr/${route}" />
    <xhtml:link rel="alternate" hreflang="ta" href="https://bharatsaver.com/ta/${route}" />
    <xhtml:link rel="alternate" hreflang="te" href="https://bharatsaver.com/te/${route}" />
  </url>`;
  });

  content = content.replace('</urlset>', newXmlNodes + '\n</urlset>');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
