import { MetadataRoute } from 'next';
import { calculators } from '@/data/calculators';
import { i18nConfig } from '@/lib/i18n-config';

const SITE_URL = process.env.SITE_URL || 'https://bharatsaver.com';
const LOCALES = i18nConfig.locales; // ['en', 'hi', 'mr', 'ta', 'te']
const DEFAULT_LOCALE = i18nConfig.defaultLocale; // 'en'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];
  const processedUrls = new Set<string>();

  const buildHreflangs = (pathSuffix: string) => {
    const languages: Record<string, string> = {};
    LOCALES.forEach(l => {
      languages[l] = `${SITE_URL}/${l}${pathSuffix}`;
    });
    // Add x-default pointing to default locale (English)
    languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${pathSuffix}`;
    return languages;
  };

  const addRoute = (
    pathSuffix: string,
    lastModified: Date | string,
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly',
    priority: number
  ) => {
    LOCALES.forEach(locale => {
      const url = `${SITE_URL}/${locale}${pathSuffix}`;
      if (!processedUrls.has(url)) {
        processedUrls.add(url);
        routes.push({
          url,
          lastModified: typeof lastModified === 'string' ? new Date(lastModified) : lastModified,
          changeFrequency,
          priority,
          alternates: {
            languages: buildHreflangs(pathSuffix),
          },
        });
      }
    });
  };

  // 1. Home Pages (Priority 1.0)
  addRoute('', '2026-08-16', 'weekly', 1.0);

  // 2. Hub Listing Pages (Priority 0.9)
  addRoute('/calculators', '2026-08-16', 'weekly', 0.9);
  addRoute('/blog', '2026-08-16', 'daily', 0.9);
  addRoute('/guides', '2026-08-16', 'weekly', 0.9);

  // 3. Calculators & Article Pages from Data Source (Priority 0.85)
  calculators.forEach(calc => {
    const modDate = calc.lastModified || '2026-08-16';
    addRoute(`/${calc.slug}`, modDate, 'weekly', 0.85);
  });

  // 4. Info / Static Pages (Priority 0.4 - 0.7)
  addRoute('/about', '2026-08-16', 'monthly', 0.7);
  addRoute('/author/mahesh-chaube', '2026-08-16', 'monthly', 0.7);
  addRoute('/contact', '2026-08-16', 'monthly', 0.6);
  addRoute('/search', '2026-08-16', 'monthly', 0.5);
  addRoute('/terms', '2026-08-16', 'yearly', 0.4);

  return routes;
}
