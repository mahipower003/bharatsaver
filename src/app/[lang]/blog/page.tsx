
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { pages } from '@/data/pages';
import { calculators } from '@/data/calculators';
import Link from "next/link";
import Image from "next/image";
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

  const combinedContent = [
    ...pages,
    ...calculators.map(calc => ({
      ...calc,
      // Map calculator fields to match page fields for consistency
      changefreq: 'monthly' as const,
      priority: 0.9,
    }))
  ].filter(item => item.lastModified); // Ensure item has a lastModified date

  const sortedContent = combinedContent.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4">
              {dictionary.blog_page.h1}
            </h1>
            <p className="text-xl text-muted-foreground">
              {dictionary.blog_page.subtitle}
            </p>
        </div>

        <div className="space-y-12">
          {sortedContent.map((item) => (
             <Link key={item.slug} href={`/${params.lang}${item.slug.startsWith('/') ? item.slug : `/${item.slug}`}`} className="group block">
                <Card className="transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/30 overflow-hidden md:flex md:flex-row">
                    <div className="md:w-1/3">
                        <Image
                            src={item.image || "https://picsum.photos/400/250"}
                            alt={item.title}
                            width={400}
                            height={250}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint="financial planning"
                        />
                    </div>
                    <div className="md:w-2/3 flex flex-col">
                        <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                            <CardDescription className="mt-2">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-end justify-between text-sm text-muted-foreground">
                            <span>{format(new Date(item.lastModified), 'MMMM d, yyyy')}</span>
                            <div className="flex items-center text-primary font-semibold">
                                <span>Read More</span>
                                <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
