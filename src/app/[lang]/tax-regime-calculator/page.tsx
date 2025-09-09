
import { TaxRegimeCalculator } from "@/components/calculators/TaxRegimeCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, TrendingUp, Star, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['tax_regime_calculator', 'author_card']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/tax-regime-calculator`;
  const ogImageUrl = `${siteUrl}/images/tax-regime-calculator-online.png`;

  const faqItems = dictionary.tax_regime_calculator.faqs;
  const faqSchema = {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": faqItems.map((faq: { question: string, answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.replace(/<[^>]*>/g, ''), // Strip HTML tags for JSON-LD
      },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": "Tax Regime Calculator 2025 — Compare Old vs New Tax Regime (India)",
    "description": "Enter your salary and deductions to instantly compare tax under the old vs new regime. Updated for FY 2025-26 — includes HRA, 80C, 80D, and worked examples. Free downloadable summary & ITR filing options.",
    "image": ogImageUrl,
    "author": {
      "@type": "Person",
      "name": "Mahesh Chaube, CFP",
      "url": `${siteUrl}/${params.lang}/author/mahesh-chaube`,
      "sameAs": "https://www.linkedin.com/in/mahi003/"
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
      "jobTitle": "Finance Editor"
    },
    "about": ["Income Tax Calculator", "Old vs New Tax Regime", "Tax Planning India"],
    "datePublished": "2024-07-30",
    "dateModified": "2025-09-01"
  };

  const softwareSchema = {
    "@context":"https://schema.org",
    "@type":"SoftwareApplication",
    "name":"Tax Regime Calculator",
    "url": pageUrl,
    "applicationCategory":"FinanceApplication",
    "operatingSystem":"Web",
    "description": "Compare old vs new tax regime for salaried and self-employed in India (FY 2024-25 / AY 2025-26). Includes HRA, 80C, 80D, home loan and CSV export.",
    "offers": {
      "@type":"Offer",
      "url": pageUrl,
      "price":"0",
      "priceCurrency":"INR"
    }
  };

  return {
    title: dictionary.tax_regime_calculator.meta_title,
    description: dictionary.tax_regime_calculator.meta_description,
    openGraph: {
      title: dictionary.tax_regime_calculator.meta_title,
      description: dictionary.tax_regime_calculator.meta_description,
      url: pageUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'BharatSaver Tax Regime Calculator' }],
      locale: params.lang === 'en' ? 'en_IN' : params.lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.tax_regime_calculator.meta_title,
      description: dictionary.tax_regime_calculator.meta_description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/tax-regime-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([faqSchema, articleSchema, softwareSchema]),
    },
  };
}

export default async function TaxRegimeCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['tax_regime_calculator', 'author_card']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'Tax Regime Calculator', item: `${siteUrl}/${params.lang}/tax-regime-calculator` },
    ],
  };
  
  const comparisonData = dictionary.tax_regime_calculator.comparison_table.table;

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.tax_regime_calculator.h1}
          </h1>
          <div className="bs-byline justify-center text-center">
            <span className="bs-author">By <strong>Mahesh Chaube</strong></span>
            <span className="bs-creds">, CFP</span>
            <span className="bs-sep">|</span>
            <span className="bs-updated">Last updated: <time dateTime="2025-09-01">September 2025</time></span>
            <div className="bs-reviewed">Reviewed by <strong>Laveena Vijayi</strong> — BharatSaver Editorial Team</div>
          </div>
          <p className="mt-4 text-lg text-muted-foreground">
            {dictionary.tax_regime_calculator.description}
          </p>
        </div>
        
        <TaxRegimeCalculator dictionary={dictionary.tax_regime_calculator} />
        
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{dictionary.tax_regime_calculator.assumptions.title}</AlertTitle>
          <AlertDescription>
            <div className="prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: dictionary.tax_regime_calculator.assumptions.body }} />
          </AlertDescription>
        </Alert>

        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.tax_regime_calculator.comparison_table.title}</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">{dictionary.tax_regime_calculator.comparison_table.description}</p>
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

        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.tax_regime_calculator.how_we_calculate.title}</h2>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.tax_regime_calculator.how_we_calculate.body.replace(/{lang}/g, params.lang) }} />
        </Card>

        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.tax_regime_calculator.common_scenarios.title}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{dictionary.tax_regime_calculator.common_scenarios.scenario1.title}</h3>
              <div className="prose dark:prose-invert max-w-none mt-2" dangerouslySetInnerHTML={{ __html: dictionary.tax_regime_calculator.common_scenarios.scenario1.body }} />
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{dictionary.tax_regime_calculator.common_scenarios.scenario2.title}</h3>
              <div className="prose dark:prose-invert max-w-none mt-2" dangerouslySetInnerHTML={{ __html: dictionary.tax_regime_calculator.common_scenarios.scenario2.body }} />
            </div>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">{dictionary.tax_regime_calculator.faq_title}</h2>
          <Accordion type="single" collapsible className="w-full">
            {dictionary.tax_regime_calculator.faqs.map((faq: { question: string, answer: string }, index: number) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.tax_regime_calculator.next_steps.title}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="https://www.cleartax.in/e-filing-of-income-tax-return" target="_blank" rel="noopener noreferrer" className="block group">
                      <Card className="h-full hover:shadow-md transition-shadow">
                          <CardHeader className="flex flex-row items-center gap-4">
                              <Download className="h-8 w-8 text-primary"/>
                              <div>
                                  <CardTitle className="text-lg">{dictionary.tax_regime_calculator.next_steps.cta1_title}</CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">{dictionary.tax_regime_calculator.next_steps.cta1_desc}</p>
                              </div>
                          </CardHeader>
                      </Card>
                  </Link>
                   <Link href={`/${params.lang}/calculators`} className="block group">
                      <Card className="h-full hover:shadow-md transition-shadow">
                          <CardHeader className="flex flex-row items-center gap-4">
                              <TrendingUp className="h-8 w-8 text-primary"/>
                              <div>
                                  <CardTitle className="text-lg">{dictionary.tax_regime_calculator.next_steps.cta2_title}</CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">{dictionary.tax_regime_calculator.next_steps.cta2_desc}</p>
                              </div>
                          </CardHeader>
                      </Card>
                  </Link>
              </div>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-7 w-7 text-accent" />
              <h2 className="text-2xl font-bold">{dictionary.tax_regime_calculator.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{__html: dictionary.tax_regime_calculator.conclusion.body.replace(/{lang}/g, params.lang)}}></p>
          </CardContent>
        </Card>

        <AuthorCard dictionary={dictionary.author_card} />
      </div>
    </div>
  );
}
