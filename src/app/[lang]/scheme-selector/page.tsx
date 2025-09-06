import { SchemeSelector } from "@/components/calculators/SchemeSelector";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['scheme_selector']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/scheme-selector`;
  return {
    title: dictionary.scheme_selector.meta_title,
    description: dictionary.scheme_selector.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/scheme-selector`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}


export default async function SchemeSelectorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['scheme_selector']);
  return (
    <div className="py-12">
        <SchemeSelector dictionary={dictionary.scheme_selector}/>
    </div>
  );
}
