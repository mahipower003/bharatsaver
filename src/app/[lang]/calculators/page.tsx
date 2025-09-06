import { PopularTools } from '@/components/home/PopularTools';
import { getDictionary } from '@/lib/dictionaries';
import { i18nConfig, type Locale } from '@/lib/i18n-config';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.calculators_page.meta_title,
    description: dictionary.calculators_page.meta_description,
  };
}

export default async function CalculatorsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="py-12">
      <PopularTools lang={lang} dictionary={dictionary.home.popular_tools} />
    </div>
  );
}
