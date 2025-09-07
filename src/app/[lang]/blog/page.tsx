
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { pages } from '@/data/pages';
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from 'date-fns';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['blog_page']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/blog`;
  return {
    title: dictionary.blog_page.meta_title,
    description: dictionary.blog_page.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/blog`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function BlogPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['blog_page']);

  const sortedPages = [...pages].sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4">
              {dictionary.blog_page.h1}
            </h1>
            <p className="text-xl text-muted-foreground">
              {dictionary.blog_page.subtitle}
            </p>
        </div>

        <div className="space-y-8">
          {sortedPages.map((page) => (
             <Link key={page.slug} href={`/${params.lang}${page.slug}`} className="group block">
                <Card className="transition-all duration-200 group-hover:shadow-xl group-hover:border-primary/20">
                    <CardHeader>
                        <CardTitle>{page.title}</CardTitle>
                        <CardDescription>{page.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{format(new Date(page.lastModified), 'MMMM d, yyyy')}</span>
                        <div className="flex items-center text-primary font-medium">
                            <span>Read More</span>
                            <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
