import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['terms_page']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/terms`;
  return {
    title: dictionary.terms_page.meta_title,
    description: dictionary.terms_page.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/terms`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function TermsPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['terms_page']);
  
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline mb-8">
          {dictionary.terms_page.h1}
        </h1>
        <div className="prose dark:prose-invert max-w-none">
            <p>{dictionary.terms_page.p1}</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">{dictionary.terms_page.h2_1}</h2>
            <p>{dictionary.terms_page.p2}</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">{dictionary.terms_page.h2_2}</h2>
            <p>{dictionary.terms_page.p3}</p>
            <h2 className="text_2xl font-bold mt-8 mb-4">{dictionary.terms_page.h2_3}</h2>
            <p>{dictionary.terms_page.p4}</p>
        </div>
      </div>
    </div>
  );
}
