
import { LoanOptimizer } from "@/components/calculators/LoanOptimizer";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, TrendingUp, Star, AlertTriangle, CheckCircle, HelpCircle, GitCompareArrows, LineChart, Banknote, Table as TableIcon } from "lucide-react";
import Link from "next/link";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['loan_optimization_calculator', 'author_card']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/loan-optimizer`;
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": dictionary.loan_optimization_calculator.faq.faqs.map((faq: { q: string, a: string }) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
    }))
  };

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
    "headline": dictionary.loan_optimization_calculator.h1,
    "description": "This guide + interactive calculator helps you answer: How can I minimize total interest, reduce my EMI or tenure, and make the best choice between prepaying, refinancing, or investing my surplus?",
    "author": {
      "@type": "Person",
      "name": "Mahesh Chaube, CFP",
      "url": `${siteUrl}/${params.lang}/author/mahesh-chaube`,
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
    "dateModified": "2025-09-01"
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
      'application/ld+json': JSON.stringify([faqSchema, softwareSchema, articleSchema]),
    },
  };
}

export default async function LoanOptimizerPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['loan_optimization_calculator', 'author_card']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'Loan Optimization Calculator', item: `${siteUrl}/${params.lang}/loan-optimizer` },
    ],
  };

  const comparisonData = dictionary.loan_optimization_calculator.comparison_table;


  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.loan_optimization_calculator.h1}
          </h1>
          <div className="bs-byline justify-center text-center mt-4">
            <span className="bs-author">By <strong>Mahesh Chaube, CFP</strong></span>
            <span className="bs-sep">|</span>
            <span className="bs-updated">Last updated: <time dateTime="2025-09-01">September 2025</time></span>
            <div className="bs-reviewed">Reviewed by <strong>Laveena Vijayi</strong> — BharatSaver Editorial Team</div>
          </div>
          <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.summary }} />
        </div>
        
        <LoanOptimizer dictionary={dictionary.loan_optimization_calculator} />

        <div className="space-y-8 mt-12">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.why.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.why.body }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><FileText className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.how_it_works.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.how_it_works.body }} />
            </Card>

            {dictionary.loan_optimization_calculator.worked_examples && (
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><LineChart className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.worked_examples.h2}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{dictionary.loan_optimization_calculator.worked_examples.scenario1.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.worked_examples.scenario1.body }} />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{dictionary.loan_optimization_calculator.worked_examples.scenario2.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.worked_examples.scenario2.body }} />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{dictionary.loan_optimization_calculator.worked_examples.scenario3.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.worked_examples.scenario3.body }} />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.optimization_masterclass.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.optimization_masterclass.body }} />
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><GitCompareArrows className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.prepay_vs_invest.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.prepay_vs_invest.body }} />
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
                                    <TableCell key={cellIndex} dangerouslySetInnerHTML={{ __html: cell }}></TableCell>
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
                    <CardTitle className="flex items-center gap-3"><Banknote className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.refinance.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.refinance.body }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.tax_notes.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.tax_notes.body }} />
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.faq.h2}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                    {dictionary.loan_optimization_calculator.faq.faqs.map((faq: { q: string, a: string }, index: number) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{faq.q}</AccordionTrigger>
                        <AccordionContent>
                            <p dangerouslySetInnerHTML={{ __html: faq.a }}></p>
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
        
        <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-7 w-7 text-accent" />
              <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{dictionary.loan_optimization_calculator.conclusion.body}</p>
          </CardContent>
        </Card>

        <AuthorCard dictionary={dictionary.author_card} />
      </div>
    </div>
  );
}
