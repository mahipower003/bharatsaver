
import { FdVsPpfCalculator } from "@/components/calculators/FdVsPpfCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Landmark, ArrowRightLeft, ShieldCheck, Banknote, HelpCircle, Star, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const pageDict = (await import(`@/dictionaries/${lang}/fd-vs-ppf-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/fd-vs-ppf-calculator`;
  const ogImageUrl = `${siteUrl}/images/fd-vs-ppf-calculator.png`;

  return {
    title: pageDict.meta_title,
    description: pageDict.meta_description,
    openGraph: {
      title: pageDict.og_title,
      description: pageDict.og_description,
      url: pageUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'BharatSaver FD vs PPF Calculator' }],
      "locale": lang === 'en' ? 'en_IN' : lang,
      type: 'website',
    },
    twitter: buildTwitterCard(pageDict.meta_title, pageDict.meta_description, ogImageUrl),
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/fd-vs-ppf-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}


export default async function FdVsPpfCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = { ...(await import(`@/dictionaries/${lang}/fd-vs-ppf-calculator.json`)).default };
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const comparisonData = pageDict.comparison.table;

  return (
    <CalculatorPageLayout
      lang={lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.description}
      lastUpdated="September 2025"
      calculator={<FdVsPpfCalculator dictionary={pageDict} />}
      faqs={pageDict.faqs}
      faqTitle={pageDict.faq_title}
      pageUrl={`${siteUrl}/${lang}/fd-vs-ppf-calculator`}
    >
      <div className="mt-12 space-y-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <HelpCircle className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.quick_answer.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.quick_answer.body.replace(/{lang}/g, lang) }}></div>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
              <h2 className="text-2xl font-bold">{pageDict.how_it_works.title}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{pageDict.how_it_works.example1.title}</h3>
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pageDict.how_it_works.example1.body.replace(/{lang}/g, lang) }} />
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{pageDict.how_it_works.example2.title}</h3>
               <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pageDict.how_it_works.example2.body.replace(/{lang}/g, lang) }} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Landmark className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{pageDict.ppf_features.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {pageDict.ppf_features.points.map((point: string, index: number) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }}></li>
                    ))}
                </ul>
            </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Banknote className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{pageDict.fd_features.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {pageDict.fd_features.points.map((point: string, index: number) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }}></li>
                    ))}
                </ul>
            </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
              <h2 className="text-2xl font-bold">{pageDict.comparison.title}</h2>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          {comparisonData.headers.map((header: string, index: number) => (
                              <TableHead key={index}>{header}</TableHead>
                          ))}
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {comparisonData.rows.map((row: string[], rowIndex: number) => (
                          <TableRow key={rowIndex}>
                              {row.map((cell: string, cellIndex: number) => (
                                  <TableCell key={cellIndex} dangerouslySetInnerHTML={{ __html: cell.replace(/{lang}/g, lang) }}></TableCell>
                              ))}
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.tax_impact.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.tax_impact.body.replace(/{lang}/g, lang) }}></div>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <CheckCircle className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{pageDict.checklist.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {pageDict.checklist.points.map((point: string, index: number) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }}></li>
                    ))}
                </ul>
            </CardContent>
        </Card>



        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Banknote className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-bold">{pageDict.related_calculators.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.related_calculators.body.replace(/{lang}/g, lang) }}></div>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-7 w-7 text-accent" />
              <h2 className="text-2xl font-bold">{pageDict.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.conclusion.body.replace(/{lang}/g, lang) }}></div>
          </CardContent>
        </Card>
      </div>
    </CalculatorPageLayout>
  );
}

    

    