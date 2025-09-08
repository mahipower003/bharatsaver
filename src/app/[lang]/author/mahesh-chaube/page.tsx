
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { calculators } from '@/data/calculators';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { AuthorCard } from "@/components/layout/AuthorCard";


export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['author_page']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/author/mahesh-chaube`;
  return {
    title: dictionary.author_page.meta_title,
    description: dictionary.author_page.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/author/mahesh-chaube`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function AuthorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['author_page', 'author_card']);
  const authoredContent = calculators;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
            <AuthorCard dictionary={dictionary.author_card} />
        </header>

        <main>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline mb-8">
                {dictionary.author_page.h2}
            </h2>

            <div className="space-y-8">
            {authoredContent.map((item) => (
                <Link key={item.slug} href={`/${params.lang}/${item.slug}`} className="group block">
                    <Card className="transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/30">
                        <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                            <CardDescription className="mt-2">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="text-primary font-semibold flex items-center">
                                {dictionary.author_page.view_calculator}
                                <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            </div>
        </main>
      </div>
    </div>
  );
}
