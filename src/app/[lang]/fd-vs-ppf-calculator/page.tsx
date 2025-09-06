import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['fd_vs_ppf_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/fd-vs-ppf-calculator`;
  return {
    title: dictionary.fd_vs_ppf_calculator.meta_title,
    description: dictionary.fd_vs_ppf_calculator.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/fd-vs-ppf-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function FdVsPpfCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['fd_vs_ppf_calculator']);
  
  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          {dictionary.fd_vs_ppf_calculator.h1}
        </h1>
        <p className="mt-8 text-2xl text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  );
}
