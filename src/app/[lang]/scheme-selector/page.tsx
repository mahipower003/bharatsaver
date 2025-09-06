import { SchemeSelector } from "@/components/calculators/SchemeSelector";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['scheme_selector']);
  return {
    title: dictionary.scheme_selector.meta_title,
    description: dictionary.scheme_selector.meta_description,
  };
}


export default async function SchemeSelectorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['scheme_selector']);
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <SchemeSelector dictionary={dictionary.scheme_selector}/>
    </div>
  );
}
