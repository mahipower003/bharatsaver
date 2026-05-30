/**
 * seo.ts — Shared SEO metadata utilities for BharatSaver
 *
 * Provides standardized canonical + hreflang generation to prevent
 * duplicate content indexing across all 5 locales.
 */

import type { Metadata } from 'next';
import { i18nConfig } from '@/lib/i18n-config';
import type { Locale } from '@/lib/i18n-config';

const SITE_URL = process.env.SITE_URL || 'https://bharatsaver.com';

export const LOCALE_LANGUAGE_MAP: Record<Locale, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
};

/**
 * Generates the `alternates` block for Next.js Metadata with:
 * - Self-referential canonical tag
 * - Full hreflang set across all locales
 * - x-default pointing to English version
 *
 * @param lang - Current locale
 * @param path - Page path without locale prefix, e.g. "/ppf-calculator"
 */
export function buildAlternates(lang: Locale, path: string): Metadata['alternates'] {
  const canonicalUrl = `${SITE_URL}/${lang}${path}`;

  const languages = i18nConfig.locales.reduce((acc, locale) => {
    acc[LOCALE_LANGUAGE_MAP[locale as Locale]] = `${SITE_URL}/${locale}${path}`;
    return acc;
  }, {} as Record<string, string>);

  // x-default should always point to the English version
  languages['x-default'] = `${SITE_URL}/en${path}`;

  return {
    canonical: canonicalUrl,
    languages,
  };
}

/**
 * Builds the standard Open Graph block for a page.
 */
export function buildOpenGraph(
  lang: Locale,
  path: string,
  title: string,
  description: string,
  ogImageUrl: string
): Metadata['openGraph'] {
  return {
    title,
    description,
    url: `${SITE_URL}/${lang}${path}`,
    siteName: 'BharatSaver',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    locale: LOCALE_LANGUAGE_MAP[lang] ?? 'en_IN',
    type: 'website',
  };
}

/**
 * Builds the standard Twitter card block for a page.
 */
export function buildTwitterCard(
  title: string,
  description: string,
  ogImageUrl: string
): Metadata['twitter'] {
  return {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImageUrl],
  };
}

/**
 * Builds the standard Article JSON-LD schema.
 */
export function buildArticleSchema({
  lang,
  path,
  headline,
  description,
  ogImageUrl,
  datePublished,
  dateModified,
  about,
}: {
  lang: Locale;
  path: string;
  headline: string;
  description: string;
  ogImageUrl: string;
  datePublished: string;
  dateModified: string;
  about?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${lang}${path}`,
    },
    headline,
    description,
    image: ogImageUrl,
    author: {
      '@type': 'Person',
      name: 'Mahesh Chaube, CFP',
      url: 'https://www.linkedin.com/in/mahi003/',
      sameAs: 'https://www.linkedin.com/in/mahi003/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BharatSaver',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
      },
    },
    reviewedBy: {
      '@type': 'Organization',
      name: 'BharatSaver Editorial Team',
    },
    ...(about ? { about } : {}),
    datePublished,
    dateModified,
  };
}
