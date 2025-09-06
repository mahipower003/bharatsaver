import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['contact_page']);
  return {
    title: dictionary.contact_page.meta_title,
    description: dictionary.contact_page.meta_description,
  };
}

export default async function ContactPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['contact_page']);
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          {dictionary.contact_page.h1}
        </h1>
        <p className="mt-8 text-2xl text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  );
}
