
import { MutualFundOverlapCalculator } from "@/components/calculators/MutualFundOverlapCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, GitCompareArrows, HelpCircle, FileText, AlertTriangle, Table as TableIcon, BarChart2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { FooterCta } from "@/components/layout/FooterCta";


export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = (await import(`@/dictionaries/${params.lang}/mutual-fund-overlap-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/mutual-fund-overlap-calculator`;
  
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
    "author":{"@type":"Person","name":"Mahesh Chaube","jobTitle":"CFP","url":`${siteUrl}/${params.lang}/author/mahesh-chaube`},
    "datePublished":"2025-09-01","dateModified":"2025-09-12",
    "publisher":{"@type":"Organization","name":"BharatSaver","logo":{"@type":"ImageObject","url":`${siteUrl}/icon.svg`}}
  };
  
  const faqSchema = {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": dict.faq.faqs.map((faq: { q: string, a: string }) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
    }))
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
      'application/ld+json': JSON.stringify([articleSchema, softwareSchema, faqSchema]),
    },
  };
}

export default async function MutualFundOverlapCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang);
  const dict = (await import(`@/dictionaries/${params.lang}/mutual-fund-overlap-calculator.json`)).default;
  const liveExample = dict.live_example;
  
  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl">
         <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dict.h1}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: dict.hero.subtitle }} />
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{dict.tool.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <MutualFundOverlapCalculator dictionary={dict} />
          </CardContent>
        </Card>
        
        <div className="space-y-8 mt-12">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-primary" />{dict.what_is_overlap.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.what_is_overlap.body }} />
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><FileText className="h-6 w-6 text-primary" />{dict.how_it_works.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.how_it_works.body }} />
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
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.interpreting_results.body }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-primary" />{dict.what_to_do.h2}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.what_to_do.body }} />
                  <div className="my-6">
                    <Image src="/images/decision-flowchart-placeholder.png" alt="Decision flowchart for mutual fund overlap" width={800} height={500} className="rounded-lg border shadow-md mx-auto" />
                  </div>
                </CardContent>
            </Card>
        </div>

        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">{dict.faq.h2}</h2>
            <Accordion type="single" collapsible className="w-full">
            {dict.faq.faqs.map((faq: { q: string, a: string }, index: number) => (
                <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>
                    <p dangerouslySetInnerHTML={{ __html: faq.a }}></p>
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </div>

        <AuthorCard dictionary={dictionary.author_card} />

        <Card id="methodology" className="mt-12 text-sm text-muted-foreground">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="h-5 w-5"/>
                    <h2 className="text-2xl font-bold">{dict.methodology.h2}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: dict.methodology.body }}/>
        </Card>
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}

    

    