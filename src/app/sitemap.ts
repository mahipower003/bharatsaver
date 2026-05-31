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

  // 3. Add individual calculator pages
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

  // 4. Add article pages
  const articles = [
    'lic-premium-receipt-download',
    'lic-policy-status',
    'lic-vs-sip',
    'lic-vs-mutual-fund',
    'lic-bonus-rates',
    'lic-paid-up-value',
  ];

  articles.forEach(slug => {
    LOCALES.forEach(locale => {
      routes.push({
        url: `${SITE_URL}/${locale}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: LOCALES.reduce((acc, l) => {
            acc[l] = `${SITE_URL}/${l}/${slug}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    });
  });

  // 5. Add tool pages (not in calculators data)
  const tools = [
    'mutual-fund-scheme-selector',
  ];

  tools.forEach(slug => {
    LOCALES.forEach(locale => {
      routes.push({
        url: `${SITE_URL}/${locale}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: LOCALES.reduce((acc, l) => {
            acc[l] = `${SITE_URL}/${l}/${slug}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    });
  });

  // 6. Add listing pages (blog, guides)
  const listingPages = [
    { slug: 'blog',   priority: 0.9, changeFrequency: 'daily'  as const },
    { slug: 'guides', priority: 0.9, changeFrequency: 'weekly' as const },
  ];

  listingPages.forEach(({ slug, priority, changeFrequency }) => {
    LOCALES.forEach(locale => {
      routes.push({
        url: `${SITE_URL}/${locale}/${slug}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: LOCALES.reduce((acc, l) => {
            acc[l] = `${SITE_URL}/${l}/${slug}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    });
  });

  // 7. Add info / static pages
  const infoPages = [
    { slug: 'about',   priority: 0.7, changeFrequency: 'monthly' as const },
    { slug: 'contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { slug: 'terms',   priority: 0.4, changeFrequency: 'yearly'  as const },
    { slug: 'search',  priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  infoPages.forEach(({ slug, priority, changeFrequency }) => {
    LOCALES.forEach(locale => {
      routes.push({
        url: `${SITE_URL}/${locale}/${slug}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: LOCALES.reduce((acc, l) => {
            acc[l] = `${SITE_URL}/${l}/${slug}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    });
  });

  // 8. Add author pages
  const authors = ['mahesh-chaube'];

  authors.forEach(author => {
    LOCALES.forEach(locale => {
      routes.push({
        url: `${SITE_URL}/${locale}/author/${author}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: LOCALES.reduce((acc, l) => {
            acc[l] = `${SITE_URL}/${l}/author/${author}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    });
  });

  return routes;
}
