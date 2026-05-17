import { MetadataRoute } from 'next';
import { calculators } from '@/data/calculators';

const SITE_URL = process.env.SITE_URL || 'https://bharatsaver.com';

const LOCALES = ['en', 'hi', 'mr', 'ta', 'te'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // 1. Add home pages
  LOCALES.forEach(locale => {
    routes.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: LOCALES.reduce((acc, l) => {
          acc[l] = `${SITE_URL}/${l}`;
          return acc;
        }, {} as Record<string, string>),
      },
    });
  });

  // 2. Add /calculators listing pages
  LOCALES.forEach(locale => {
    routes.push({
      url: `${SITE_URL}/${locale}/calculators`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: LOCALES.reduce((acc, l) => {
          acc[l] = `${SITE_URL}/${l}/calculators`;
          return acc;
        }, {} as Record<string, string>),
      },
    });
  });

  // 3. Add individual calculator and guide pages
  calculators.forEach(calc => {
    LOCALES.forEach(locale => {
      routes.push({
        url: `${SITE_URL}/${locale}/${calc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: LOCALES.reduce((acc, l) => {
            acc[l] = `${SITE_URL}/${l}/${calc.slug}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    });
  });

  return routes;
}
