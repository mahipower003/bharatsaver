
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['about_page']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/about`;
  return {
    title: dictionary.about_page.meta_title,
    description: dictionary.about_page.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/about`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function AboutPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['about_page']);
  
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4">
            {dictionary.about_page.h1}
            </h1>
            <p className="text-xl text-muted-foreground">
            {dictionary.about_page.p1}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h2 className="text-3xl font-bold font-headline">{dictionary.about_page.h2_1}</h2>
                <p className="text-muted-foreground">{dictionary.about_page.p2}</p>
                <p className="text-muted-foreground">{dictionary.about_page.p3}</p>
            </div>
            <div>
                <Image 
                    src="/images/about-us.png" 
                    alt="A team of financial experts collaborating in a modern office."
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl"
                    data-ai-hint="finance office"
                />
            </div>
        </div>
      </div>
    </div>
  );
}
