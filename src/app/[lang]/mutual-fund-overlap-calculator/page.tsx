import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.mutual_fund_overlap_calculator.meta_title,
    description: dictionary.mutual_fund_overlap_calculator.meta_description,
  };
}

export default async function MutualFundOverlapCalculatorPage({ params: { lang } }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(lang);
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          {dictionary.mutual_fund_overlap_calculator.h1}
        </h1>
        <p className="mt-8 text-2xl text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  );
}
