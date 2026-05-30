
import { PopularTools } from '@/components/home/PopularTools';
import { getDictionary } from '@/lib/dictionaries';
import { i18nConfig, type Locale } from '@/lib/i18n-config';
import type { Metadata } from 'next';
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

export async function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/calculators`;
  return {
    title: dictionary.calculators_page.meta_title,
    description: dictionary.calculators_page.meta_description,
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
  return (
    <div className="py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4">
                {dictionary.calculators_page.h1}
            </h1>
        </div>
      <PopularTools lang={lang} dictionary={dictionary.home.popular_tools} />
    </div>
  );
}
