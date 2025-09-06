import { Search } from "@/components/layout/Search";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ 
    params,
    searchParams 
}: { 
    params: { lang: Locale },
    searchParams: { q?: string }
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['search_page', 'header']);
  const query = searchParams.q;
  const title = query 
    ? `${dictionary.search_page.title_with_query} "${query}"` 
    : dictionary.search_page.title;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/search`;
  
  return {
    title: title,
    description: dictionary.search_page.meta_description,
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/search`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function SearchPage({ 
    params,
    searchParams
}: { 
    params: { lang: Locale },
    searchParams: { q?: string }
}) {
  const dictionary = await getDictionary(params.lang, ['search_page', 'header']);
  const query = searchParams.q;
  
  return (
    <div className="py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
            <Search lang={params.lang} dictionary={{ placeholder: dictionary.header.search_placeholder }} />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl font-headline">
          {query ? `${dictionary.search_page.h1_with_query} "${query}"` : dictionary.search_page.h1}
        </h1>

        {query && (
            <p className="mt-4 text-muted-foreground">
                {dictionary.search_page.results_placeholder}
            </p>
        )}
      </div>
    </div>
  );
}
