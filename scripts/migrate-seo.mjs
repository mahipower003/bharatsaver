/**
 * migrate-seo-v2.mjs
 * More targeted migration: replaces full alternates blocks and openGraph locale hacks.
 * Handles the remaining pages that need complete migration.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const LANG_DIR = path.join(ROOT, 'src', 'app', '[lang]');

function getAllPages(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllPages(full));
    else if (entry.name === 'page.tsx') results.push(full);
  }
  return results;
}

function extractSlug(filePath) {
  const rel = filePath.replace(LANG_DIR, '').replace(/\\/g, '/');
  const parts = rel.split('/').filter(Boolean);
  if (parts.length <= 1) return '';
  return '/' + parts.slice(0, -1).join('/');
}

function needsAlternatesMigration(content) {
  return content.includes('i18nConfig.locales.reduce') || 
         (content.includes('languages:') && content.includes("siteUrl}/${lang}"));
}

function needsOgMigration(content) {
  return content.includes("lang === 'en' ? 'en_IN' : lang");
}

function removeOldAlternatesImports(content) {
  // Remove i18nConfig import if it's only used for metadata (keep generateStaticParams usage)
  return content;
}

function migrateAlternates(content, slug) {
  // Pattern 1: i18nConfig.locales.reduce pattern
  const reducePattern = /alternates:\s*\{\s*["']?canonical["']?:\s*[^,\n]+,\s*languages:\s*i18nConfig\.locales\.reduce\([^)]+\)[^}]+\}\s*\},?/gs;
  content = content.replace(reducePattern, `alternates: buildAlternates(lang, '${slug}'),`);

  // Pattern 2: manual language objects  
  const manualPattern = /alternates:\s*\{\s*["']?canonical["']?:\s*[^,\n]+,\s*languages:\s*\{[^}]+\}\s*\},?/gs;
  content = content.replace(manualPattern, `alternates: buildAlternates(lang, '${slug}'),`);

  return content;
}

function migrateOpenGraph(content, slug) {
  // Replace openGraph blocks that contain the locale hack
  const ogPattern = /openGraph:\s*\{[^{}]*lang\s*===\s*['"]en['"][^{}]*type:\s*['"]website['"][^{}]*\},?/gs;
  
  content = content.replace(ogPattern, (match) => {
    // Extract ogImageUrl variable name
    const imgVarMatch = match.match(/url:\s*(ogImageUrl|`[^`]+`)/);
    const imgVar = imgVarMatch ? imgVarMatch[1] : 'ogImageUrl';
    
    // Extract title
    const titleMatch = match.match(/\btitle:\s*([^\n,]+)/);
    const title = titleMatch ? titleMatch[1].trim().replace(/,$/, '') : 'pageDict.meta_title';
    
    // Extract description  
    const descMatch = match.match(/\bdescription:\s*([^\n,]+)/);
    const desc = descMatch ? descMatch[1].trim().replace(/,$/, '') : 'pageDict.meta_description';
    
    return `openGraph: buildOpenGraph(lang, '${slug}', ${title}, ${desc}, ${imgVar}),`;
  });

  return content;
}

function ensureImport(content) {
  if (content.includes("from '@/lib/seo'")) return content;
  
  // Add import after the last import line before the first export/const
  const lastImportIdx = [...content.matchAll(/^import .+/gm)].pop();
  if (lastImportIdx) {
    const insertAt = lastImportIdx.index + lastImportIdx[0].length;
    return content.slice(0, insertAt) + 
      `\nimport { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';` +
      content.slice(insertAt);
  }
  return content;
}

// Main
const pages = getAllPages(LANG_DIR);
let migrated = 0;
let alreadyDone = 0;
let noChange = 0;

for (const fp of pages) {
  const slug = extractSlug(fp);
  if (!slug) { alreadyDone++; continue; }
  
  let content = fs.readFileSync(fp, 'utf8');
  
  const needsAlt = needsAlternatesMigration(content);
  const needsOg = needsOgMigration(content);
  
  if (!needsAlt && !needsOg) { alreadyDone++; continue; }

  const original = content;
  
  if (needsAlt) content = migrateAlternates(content, slug);
  if (needsOg) content = migrateOpenGraph(content, slug);
  content = ensureImport(content);

  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf8');
    const rel = fp.replace(ROOT, '').replace(/\\/g, '/');
    const actions = [needsAlt ? 'alternates' : null, needsOg ? 'openGraph' : null].filter(Boolean).join('+');
    console.log(`✅  [${actions}] ${rel}`);
    migrated++;
  } else {
    const rel = fp.replace(ROOT, '').replace(/\\/g, '/');
    console.log(`⚠️  No regex match: ${rel}`);
    noChange++;
  }
}

console.log(`\n✅ Migrated: ${migrated}  ✅ Already done: ${alreadyDone}  ⚠️ Unmatched: ${noChange}`);
