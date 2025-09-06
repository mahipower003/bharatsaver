import { PopularTools } from '@/components/home/PopularTools';
import { getDictionary } from '@/lib/dictionaries';
import { i18nConfig, type Locale } from '@/lib/i18n-config';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['calculators_page']);
  return {
    title: dictionary.calculators_page.meta_title,
    description: dictionary.calculators_page.meta_description,
  };
}

export default async function CalculatorsPage({ params }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(params.lang, ['home.popular_tools']);
  return (
    <div className="py-12">
      <PopularTools lang={params.lang} dictionary={dictionary.home.popular_tools} />
    </div>
  );
}
