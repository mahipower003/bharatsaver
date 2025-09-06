
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Noto_Sans } from 'next/font/google';
import { i18nConfig } from '@/lib/i18n-config';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const noto_sans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-sans',
});

const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BharatSaver - Smarter Savings for Every Indian',
    template: '%s | BharatSaver',
  },
  description: 'Free calculators, guides and tools to plan your financial future— in English and regional languages.',
  openGraph: {
    title: 'BharatSaver - Smarter Savings for Every Indian',
    description: 'Free calculators, guides and tools to plan your financial future.',
    url: siteUrl,
    siteName: 'BharatSaver',
    images: [{ 
      url: `/hero-image.png`, 
      width: 1200, 
      height: 630, 
      alt: 'BharatSaver Hero Image' 
    }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BharatSaver - Smarter Savings for Every Indian',
    description: 'Free calculators, guides and tools to plan your financial future.',
    images: [`/hero-image.png`],
  },
  alternates: {
    canonical: siteUrl,
    languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}`;
        return acc;
    }, {} as Record<string, string>),
  },
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    name: 'BharatSaver',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/${params.lang ?? i18nConfig.defaultLocale}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang={params.lang ?? i18nConfig.defaultLocale} suppressHydrationWarning className={`${inter.variable} ${noto_sans.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
