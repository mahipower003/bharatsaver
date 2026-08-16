
import { MutualFundOverlapCalculator } from "@/components/calculators/MutualFundOverlapCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, GitCompareArrows, HelpCircle, FileText, AlertTriangle, Table as TableIcon, BarChart2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';


export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = (await import(`@/dictionaries/${lang}/mutual-fund-overlap-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/mutual-fund-overlap-calculator`;
  
  const title = dict.meta_title;
  const description = dict.meta_description;

  const softwareSchema = {
    "@context":"https://schema.org",
    "@type":"SoftwareApplication",
    "name":"Mutual Fund Overlap Calculator",
    "url": pageUrl,
    "applicationCategory":"FinanceApplication",
    "operatingSystem":"Web",
    "description":"Compare holdings across mutual funds in India and compute weighted overlap."
  };

  const articleSchema = {
    "@context":"https://schema.org",
    "@type":"Article",
    "headline": dict.h1,
    "author":{"@type":"Person","name":"Mahesh Chaube","jobTitle":"CFP","url":`${siteUrl}/${lang}/author/mahesh-chaube`},
    "datePublished":"2025-09-01","dateModified": "2026-08-16",
    "publisher":{"@type":"Organization","name":"BharatSaver","logo":{"@type":"ImageObject","url":`${siteUrl}/icon.svg`}}
  };
  

  return {
    title: title,
    description: description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/mutual-fund-overlap-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
     other: {
      'application/ld+json': JSON.stringify([articleSchema, softwareSchema]),
    },
  };
}

export default async function MutualFundOverlapCalculatorPage({ params }: { params: Promise<{ lang: Locale }>}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const dict = (await import(`@/dictionaries/${lang}/mutual-fund-overlap-calculator.json`)).default;
  const liveExample = dict.live_example;
  
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/mutual-fund-overlap-calculator`;
  
  const mappedFaqs = dict.faq?.faqs ? dict.faq.faqs.map((f: any) => ({ question: f.q, answer: f.a })) : [];

  return (
    <CalculatorPageLayout
      lang={lang}
      dictionary={dictionary}
      pageDict={dict}
      h1={dict.h1}
      description={dict.hero.subtitle}
      lastUpdated="August 2026"
      calculator={
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{dict.tool.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <MutualFundOverlapCalculator dictionary={dict} />
          </CardContent>
        </Card>
      }
      faqs={mappedFaqs}
      faqTitle={dict.faq?.h2 || "Frequently Asked Questions"}
      pageUrl={pageUrl}
    >
        <div className="space-y-8 mt-12 print-hide">
        

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-primary" />{dict.what_is_overlap.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.what_is_overlap.body.replace(/{lang}/g, lang) }} />
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><FileText className="h-6 w-6 text-primary" />{dict.how_it_works.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.how_it_works.body.replace(/{lang}/g, lang) }} />
            </Card>

            {liveExample && <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><BarChart2 className="h-6 w-6 text-primary" />{liveExample.h2}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{liveExample.intro}</p>
                <Alert variant="default" className="text-center p-6 mb-6">
                    <AlertTitle className="text-base font-semibold mb-1">{dict.results.weighted_overlap_title}</AlertTitle>
                    <AlertDescription className="text-3xl font-bold text-orange-500">
                        {liveExample.result_summary.split(' ')[0]} (Moderate)
                    </AlertDescription>
                </Alert>
                <Card>
                    <CardHeader>
                        <CardTitle>{liveExample.top_stocks_title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{dict.results.stock_header}</TableHead>
                                    <TableHead className="text-right">{dict.results.min_weight_header}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {liveExample.top_stocks.map((stock: any, idx: number) => (
                                    <TableRow key={`${stock.name}-${idx}`}>
                                        <TableCell className="font-medium">{stock.name}</TableCell>
                                        <TableCell className="text-right font-bold">{stock.weight}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
              </CardContent>
            </Card>}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><GitCompareArrows className="h-6 w-6 text-primary" />{dict.interpreting_results.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.interpreting_results.body.replace(/{lang}/g, lang) }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-primary" />{dict.what_to_do.h2}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.what_to_do.body.replace(/{lang}/g, lang) }} />
                  <div className="my-6">
                    <Image src="/images/Mutual Fund Overlap decision .png" alt="Decision flowchart for mutual fund overlap" width={800} height={500} className="rounded-lg border shadow-md mx-auto" />
                  </div>
                </CardContent>
            </Card>

             {dict.related_tools && (
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-primary" />{dict.related_tools.h2}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dict.related_tools.links.map((link: any, index: number) => (
                    <Link key={index} href={`/${lang}${link.href}`} className="group block">
                       <Card className="h-full hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{link.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
        </div>

            <Card id="methodology" className="mt-12 text-sm text-muted-foreground print-hide">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="h-5 w-5"/>
                        <h2 className="text-2xl font-bold">{dict.methodology.h2}</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: dict.methodology.body.replace(/{lang}/g, lang) }}/>
            </Card>
    </CalculatorPageLayout>
  );
}
