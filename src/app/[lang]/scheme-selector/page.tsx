import { SchemeSelector } from "@/components/calculators/SchemeSelector";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export default async function SchemeSelectorPage({ params: { lang } }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <SchemeSelector dictionary={dictionary.scheme_selector}/>
    </div>
  );
}
