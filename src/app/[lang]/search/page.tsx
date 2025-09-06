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
  const dictionary = await getDictionary(params.lang, ['search_page']);
  const query = searchParams.q;
  const title = query 
    ? `${dictionary.search_page.title_with_query} "${query}"` 
    : dictionary.search_page.title;
  
  return {
    title: title,
    description: dictionary.search_page.meta_description,
    robots: {
        index: false,
        follow: false,
    }
  };
}

export default async function SearchPage({ 
    params,
    searchParams
}: { 
    params: { lang: Locale },
    searchParams: { q?: string }
}) {
  const dictionary = await getDictionary(params.lang, ['search_page']);
  const query = searchParams.q;
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          {query ? `${dictionary.search_page.h1_with_query} "${query}"` : dictionary.search_page.h1}
        </h1>

        {query && (
            <p className="mt-8 text-2xl text-muted-foreground">
                {dictionary.search_page.results_placeholder}
            </p>
        )}
      </div>
    </div>
  );
}
