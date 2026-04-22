
import { TaxRegimeCalculator } from "@/components/calculators/TaxRegimeCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, TrendingUp, Star, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FooterCta } from "@/components/layout/FooterCta";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const pageDict = (await import(`@/dictionaries/${lang}/tax-regime-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/tax-regime-calculator`;
  const ogImageUrl = `${siteUrl}/images/tax-regime-calculator-online.png`;

  const faqItems = pageDict.faqs;
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
      "url": `${siteUrl}/${lang}/author/mahesh-chaube`,
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
    "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Laveena Vijayi",
          "jobTitle": "Finance Editor"
        },
        "reviewBody": "This calculator provides an accurate comparison based on the latest tax slabs for FY 2024-25, including detailed deduction options like HRA and 80C, which is essential for informed decision-making."
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
    title: pageDict.meta_title,
    description: pageDict.meta_description,
    openGraph: {
      title: pageDict.meta_title,
      description: pageDict.meta_description,
      url: pageUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'BharatSaver Tax Regime Calculator' }],
      "locale": lang === 'en' ? 'en_IN' : lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageDict.meta_title,
      description: pageDict.meta_description,
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

export default async function TaxRegimeCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = { ...(await import(`@/dictionaries/${lang}/tax-regime-calculator.json`)).default };
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'Tax Regime Calculator', item: `${siteUrl}/${lang}/tax-regime-calculator` },
    ],
  };
  
  const comparisonData = pageDict.comparison_table;

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {pageDict.h1}
          </h1>
          <div className="bs-byline justify-center text-center">
            <span className="bs-author">By <strong>Mahesh Chaube</strong></span>
            <span className="bs-creds">, CFP</span>
            <span className="bs-sep">|</span>
            <span className="bs-updated">Last updated: <time dateTime="2025-09-01">September 2025</time></span>
            <div className="bs-reviewed">Reviewed by <strong>Laveena Vijayi</strong> — BharatSaver Editorial Team</div>
          </div>
          <p className="mt-4 text-lg text-muted-foreground">
            {pageDict.description}
          </p>
        </div>
        
        <TaxRegimeCalculator dictionary={pageDict} />
        
        {pageDict.assumptions && (
          <Alert className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{pageDict.assumptions.title}</AlertTitle>
            <AlertDescription>
              <div className="prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: pageDict.assumptions.body }} />
            </AlertDescription>
          </Alert>
        )}

        {comparisonData && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <FileText className="h-7 w-7 text-primary"/>
                  <h2 className="text-2xl font-bold">{comparisonData.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{comparisonData.description}</p>
              <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {comparisonData.table.headers.map((header: string, index: number) => (
                                <TableHead key={index}>{header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comparisonData.table.rows.map((row: string[], rowIndex: number) => (
                            <TableRow key={rowIndex}>
                                {row.map((cell: string, cellIndex: number) => (
                                    <TableCell key={cellIndex} dangerouslySetInnerHTML={{ __html: cell }}></TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        
        {pageDict.checklist && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="h-7 w-7 text-primary"/>
                  <h2 className="text-2xl font-bold">{pageDict.checklist.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pageDict.checklist.body }} />
          </Card>
        )}
        
        {pageDict.how_we_calculate && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <HelpCircle className="h-7 w-7 text-primary"/>
                  <h2 className="text-2xl font-bold">{pageDict.how_we_calculate.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pageDict.how_we_calculate.body.replace(/{lang}/g, lang) }} />
          </Card>
        )}

        {pageDict.common_scenarios && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-7 w-7 text-primary"/>
                  <h2 className="text-2xl font-bold">{pageDict.common_scenarios.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {pageDict.common_scenarios.scenario1 && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">{pageDict.common_scenarios.scenario1.title}</h3>
                  <div className="prose dark:prose-invert max-w-none mt-2" dangerouslySetInnerHTML={{ __html: pageDict.common_scenarios.scenario1.body }} />
                </div>
              )}
              {pageDict.common_scenarios.scenario2 && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">{pageDict.common_scenarios.scenario2.title}</h3>
                  <div className="prose dark:prose-invert max-w-none mt-2" dangerouslySetInnerHTML={{ __html: pageDict.common_scenarios.scenario2.body }} />
                </div>
              )}
              {pageDict.common_scenarios.scenario3 && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">{pageDict.common_scenarios.scenario3.title}</h3>
                  <div className="prose dark:prose-invert max-w-none mt-2" dangerouslySetInnerHTML={{ __html: pageDict.common_scenarios.scenario3.body }} />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {pageDict.faqs && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">{pageDict.faq_title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {pageDict.faqs.map((faq: { question: string, answer: string }, index: number) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
        
        {pageDict.next_steps && (
          <Card className="mt-12 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Download className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.next_steps.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="https://www.cleartax.in/e-filing-of-income-tax-return" target="_blank" rel="noopener noreferrer" className="block group">
                        <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Download className="h-8 w-8 text-primary"/>
                                <div>
                                    <CardTitle className="text-lg">{pageDict.next_steps.cta1_title}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{pageDict.next_steps.cta1_desc}</p>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                     <Link href={`/${lang}/calculators`} className="block group">
                        <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <TrendingUp className="h-8 w-8 text-primary"/>
                                <div>
                                    <CardTitle className="text-lg">{pageDict.next_steps.cta2_title}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{pageDict.next_steps.cta2_desc}</p>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </CardContent>
          </Card>
        )}

        {pageDict.conclusion && (
          <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Star className="h-7 w-7 text-accent" />
                <h2 className="text-2xl font-bold">{pageDict.conclusion.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" dangerouslySetInnerHTML={{__html: pageDict.conclusion.body.replace(/{lang}/g, lang)}}></p>
            </CardContent>
          </Card>
        )}

        {pageDict?.related_calculators && <Card className="mt-12 shadow-lg bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <h2 className="text-2xl font-bold">{pageDict.related_calculators.title}</h2>
            <p className="text-muted-foreground mt-2">{pageDict.related_calculators.description}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageDict.related_calculators.tools.map((tool: { name: string; description: string; link: string }, index: number) => (
                <Link
                  key={index}
                  href={tool.link.replace('{lang}', lang)}
                  className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md hover:border-blue-400 transition-all group bg-white dark:bg-slate-900"
                >
                  <h3 className="font-semibold text-primary group-hover:underline mb-1">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>}

        <AuthorCard dictionary={dictionary.author_card} />
        <FooterCta dictionary={dictionary.footer_cta} lang={lang} />
      </div>
    </div>
  );
}

    

    