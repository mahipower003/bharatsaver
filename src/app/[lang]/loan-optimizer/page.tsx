
import { LoanOptimizer } from "@/components/calculators/LoanOptimizer";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, TrendingUp, Star, AlertTriangle, CheckCircle, HelpCircle, GitCompareArrows, LineChart, Banknote, Table as TableIcon } from "lucide-react";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';


export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const pageDict = (await import(`@/dictionaries/${lang}/loan-optimization-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/loan-optimizer`;
  
  const softwareSchema = {
    "@context":"https://schema.org",
    "@type":"SoftwareApplication",
    "name":"Loan Optimization Calculator India 2025 — Reduce EMI & Save Interest",
    "url": pageUrl,
    "applicationCategory":"FinanceApplication",
    "operatingSystem":"Web",
    "description": "Free Loan Optimization Calculator (India). Compare prepayment vs invest, optimize EMI, plan balance transfer, download amortization schedule.",
    "offers": {
      "@type":"Offer",
      "url": pageUrl,
      "price":"0",
      "priceCurrency":"INR"
    }
  };
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": pageDict.h1,
    "description": "This guide + interactive calculator helps you answer: How can I minimize total interest, reduce my EMI or tenure, and make the best choice between prepaying, refinancing, or investing my surplus?",
    "author": {
      "@type": "Person",
      "name": "Mahesh Chaube, CFP",
      "url": `${siteUrl}/${lang}/author/mahesh-chaube`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "BharatSaver",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/icon.svg`
      }
    },
    "reviewedBy": {
        "@type": "Person",
        "name": "Laveena Vijayi",
        "jobTitle": "BharatSaver Editorial Team"
    },
    "datePublished": "2024-08-01",
    "dateModified": "2026-08-16"
  };

  return {
    title: "Loan Optimization Calculator India 2025 — EMI, Prepayment & Refinance Savings",
    description: "Use our Loan Optimization Calculator (India) to see EMI, prepayment & refinance savings instantly. Download amortization schedule & export CSV.",
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/loan-optimizer`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([softwareSchema, articleSchema]),
    },
  };
}

export default async function LoanOptimizerPage({ params }: { params: Promise<{ lang: Locale }>}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = (await import(`@/dictionaries/${lang}/loan-optimization-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  
  const comparisonData = pageDict.comparison_table;
  const pageUrl = `${siteUrl}/${lang}/loan-optimizer`;
  
  const mappedFaqs = pageDict.faq?.faqs ? pageDict.faq.faqs.map((f: any) => ({ question: f.q, answer: f.a })) : [];

  return (
    <CalculatorPageLayout
      lang={lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.summary}
      lastUpdated="August 2026"
      calculator={<LoanOptimizer dictionary={pageDict} />}
      faqs={mappedFaqs}
      faqTitle={pageDict.faq?.h2 || "Frequently Asked Questions"}
      pageUrl={pageUrl}
    >
        <div className="space-y-8 mt-12 print-hide">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-primary" />{pageDict.why.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pageDict.why.body.replace(/{lang}/g, lang) }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><FileText className="h-6 w-6 text-primary" />{pageDict.how_it_works.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pageDict.how_it_works.body.replace(/{lang}/g, lang) }} />
            </Card>

            {pageDict.worked_examples && (
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><LineChart className="h-6 w-6 text-primary" />{pageDict.worked_examples.h2}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{pageDict.worked_examples.scenario1.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: pageDict.worked_examples.scenario1.body.replace(/{lang}/g, lang) }} />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{pageDict.worked_examples.scenario2.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: pageDict.worked_examples.scenario2.body.replace(/{lang}/g, lang) }} />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{pageDict.worked_examples.scenario3.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: pageDict.worked_examples.scenario3.body.replace(/{lang}/g, lang) }} />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-primary" />{pageDict.optimization_masterclass.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pageDict.optimization_masterclass.body.replace(/{lang}/g, lang) }} />
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><GitCompareArrows className="h-6 w-6 text-primary" />{pageDict.prepay_vs_invest.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pageDict.prepay_vs_invest.body.replace(/{lang}/g, lang) }} />
            </Card>
            
            {comparisonData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3"><TableIcon className="h-6 w-6 text-primary" />{comparisonData.title}</CardTitle>
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
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Banknote className="h-6 w-6 text-primary" />{pageDict.refinance.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pageDict.refinance.body.replace(/{lang}/g, lang) }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-primary" />{pageDict.tax_notes.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pageDict.tax_notes.body.replace(/{lang}/g, lang) }} />
            </Card>

            {pageDict.related_tools && (
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-primary" />{pageDict.related_tools.h2}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pageDict.related_tools.links.map((link: any, index: number) => (
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
    </CalculatorPageLayout>
  );
}

    