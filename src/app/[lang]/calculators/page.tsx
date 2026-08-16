import { PopularTools } from '@/components/home/PopularTools';
import { getDictionary } from '@/lib/dictionaries';
import { i18nConfig, type Locale } from '@/lib/i18n-config';
import type { Metadata } from 'next';
import { CATEGORIES } from '@/lib/categories';
import { calculators } from '@/data/calculators';
import Link from 'next/link';

export async function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/calculators`;
  return {
    title: `Financial Calculators 2026: LIC, Retirement, PPF & Mutual Funds | BharatSaver`,
    description: `Access 25+ free Indian financial calculators categorized into LIC policies, pension & retirement planning, PPF tax savings, and mutual fund comparisons.`,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/calculators`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function CalculatorsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

  // ItemList JSON-LD for rich snippet sitelinks
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'BharatSaver Financial Calculators & Decision Tools',
    'description': 'Comprehensive suite of financial calculators for LIC policies, retirement, tax savings, and mutual funds.',
    'itemListElement': calculators.map((calc, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': calc.title,
      'url': `${siteUrl}/${lang}/${calc.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="py-12 bg-secondary/10 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4 text-foreground">
              {dictionary.calculators_page?.h1 || "All Financial Calculators & Tools"}
            </h1>
            <p className="text-lg text-muted-foreground">
              Compare LIC plans, calculate guaranteed returns, plan retirement corpus, and optimize loan repayments with our free 2026 financial calculators.
            </p>
          </div>

          {/* Quick Hub Navigation Links for Crawlers */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs font-semibold">
            <span className="text-muted-foreground">Category Hubs:</span>
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="bg-card hover:bg-primary hover:text-primary-foreground text-foreground px-3 py-1.5 rounded-md border transition-colors"
              >
                {cat.shortName}
              </a>
            ))}
          </div>

          <PopularTools lang={lang} dictionary={dictionary.home.popular_tools} />
        </div>
      </div>
    </>
  );
}
