import { MetadataRoute } from 'next';
import { i18nConfig } from '@/lib/i18n-config';
import { calculators } from '@/data/calculators';

const BASE_URL = 'https://bharatsaver.com'; // Replace with your actual domain

export default function sitemap(): MetadataRoute.Sitemap {
  const { locales } = i18nConfig;

  // Home, calculators, guides, blog pages for each locale
  const mainRoutes = locales.flatMap((locale) => 
    ['', '/calculators', '/guides', '/blog', '/terms', '/contact', '/about'].map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
    }))
  );

  // Individual calculator pages for each locale
  const calculatorRoutes = locales.flatMap((locale) =>
    calculators.map((calculator) => ({
      url: `${BASE_URL}/${locale}/${calculator.slug}`,
      lastModified: new Date(),
    }))
  );

  return [...mainRoutes, ...calculatorRoutes];
}
