import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { calculators } from '@/data/calculators';
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from 'date-fns';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/blog`;
  return {
    title: `Financial Articles & Policy Analysis 2026 | BharatSaver Blog`,
    description: `Read in-depth analysis, worked examples, and strategy guides for LIC policies, retirement planning, PPF tax saving, and equity SIPs.`,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/blog`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  const sortedContent = [...calculators].sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

  return (
    <div className="py-12 bg-secondary/10 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline mb-4 text-foreground">
              {dictionary.blog_page?.h1 || "Financial Articles & Strategy Insights"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {dictionary.blog_page?.subtitle || "Research-backed articles, actuarial breakdowns, and investment comparisons to help you build real wealth in 2026."}
            </p>
        </div>

        {/* Category Bucket Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs">
          <span className="font-bold text-muted-foreground mr-2">Topic Buckets:</span>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/${lang}/calculators#${cat.id}`}
              className="bg-card hover:bg-primary hover:text-primary-foreground text-foreground px-3 py-1.5 rounded-full border transition-all shadow-sm flex items-center gap-1.5 font-medium"
            >
              <Tag className="h-3 w-3 text-primary" />
              <span>{cat.shortName}</span>
            </Link>
          ))}
        </div>

        {/* Articles Feed Categorized */}
        <div className="space-y-8">
          {sortedContent.map((item) => {
            const category = getCategoryBySlug(item.slug);
            return (
              <Link key={item.slug} href={`/${lang}/${item.slug}`} className="group block">
                <Card className="transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/40 overflow-hidden md:flex md:flex-row border-muted">
                    <div className="md:w-1/3 relative min-h-[200px]">
                        <Image
                            src={item.image || "/images/lic-maturity-calculator.png"}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div className="md:w-2/3 flex flex-col p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                            {category?.shortName || "Financial Guide"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Updated {format(new Date(item.lastModified), 'MMMM d, yyyy')}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {item.title}
                        </h2>
                        <CardDescription className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-grow">
                          {item.summary || item.description}
                        </CardDescription>
                        <div className="flex items-center justify-between text-primary font-bold text-sm mt-4 pt-3 border-t border-muted/60">
                            <span>Read Article & Use Tool</span>
                            <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
