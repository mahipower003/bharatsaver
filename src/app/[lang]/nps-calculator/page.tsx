import { NpsCalculator } from "@/components/calculators/NpsCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, ShieldCheck, Scale, Star } from "lucide-react";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const pageDict = (await import(`@/dictionaries/${lang}/nps-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/nps-calculator`;
  const ogImageUrl = `${siteUrl}/images/nps-calculator-online.png`;


  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": "NPS Calculator 2025 — National Pension System Corpus & Pension",
    "description": "Use our NPS calculator to plan your retirement. Enter contribution, expected returns and retirement age to get corpus & monthly pension estimates.",
    "image": ogImageUrl,
    "author": {
      "@type": "Person",
      "name": "Mahesh Chaube, CFP",
      "url": "https://www.linkedin.com/in/mahi003/",
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
      "@type": "Organization",
      "name": "BharatSaver Editorial Team"
    },
    "about": ["National Pension System", "NPS Calculator", "Retirement Planning"],
    "datePublished": "2024-07-26",
    "dateModified": "2025-09-01"
  }

  return {
    title: pageDict.meta_title,
    description: pageDict.meta_description,
    openGraph: {
      title: "NPS Calculator 2025 — National Pension System Corpus & Pension",
      description: "Use our NPS calculator to plan your retirement. Enter contribution, expected returns and retirement age to get corpus & monthly pension estimates.",
      url: pageUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'BharatSaver NPS Calculator' }],
      locale: lang === 'en' ? 'en_IN' : lang,
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
        acc[locale] = `${siteUrl}/${locale}/nps-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify(articleSchema),
    },
  };
}

export default async function NpsCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = { ...(await import(`@/dictionaries/${lang}/nps-calculator.json`)).default };
  const comparisonData = pageDict.comparison.table;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/nps-calculator`;
  
  return (
    <CalculatorPageLayout
      lang={lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.description}
      lastUpdated="September 2025"
      calculator={<NpsCalculator dictionary={pageDict} />}
      faqs={pageDict.faqs}
      faqTitle={pageDict.faq_title}
      pageUrl={pageUrl}
    >
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.what_is_nps.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div></div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageDict.what_is_nps.points.map((point: {title: string, body: string}, index: number) => (
                <div key={index} className="bg-muted/50 p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-primary">{point.title}</h3>
                  <div></div>
                </div>
              ))}
            </div>
             <div></div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <h2 className="text-2xl font-bold">{pageDict.how_it_works.title}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-lg mb-2">{pageDict.how_it_works.formula_title}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{pageDict.how_it_works.annual.title}</h4>
                  <div></div>
                </div>
                 <div>
                  <h4 className="font-medium">{pageDict.how_it_works.monthly.title}</h4>
                   <div></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg">{pageDict.example.title}</h3>
              <div></div>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
                {pageDict.example.assumptions.map((point: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                ))}
              </ul>
               <div className="mt-4 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: pageDict.example.calculation_steps }}></div>
              <div className="mt-4 bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                <div></div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.example.annuity_intro }}></div>
              <div></div>
              <div></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{pageDict.tax_benefits.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div></div>
                 <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {pageDict.tax_benefits.points.map((point: string, index: number) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }}></li>
                    ))}
                  </ul>
            </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Scale className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.rules.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg">{pageDict.rules.tier1.title}</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                    {pageDict.rules.tier1.points.map((point: string, index: number) => (
                        <li key={index} dangerouslySetInnerHTML={{__html: point}}></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{pageDict.rules.tier2.title}</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                    {pageDict.rules.tier2.points.map((point: string, index: number) => (
                        <li key={index} dangerouslySetInnerHTML={{__html: point}}></li>
                    ))}
                  </ul>
                </div>
             </div>
             <div className="pt-4 border-t mt-4">
                <h3 className="font-semibold text-lg">{pageDict.rules.withdrawal.title}</h3>
                <div></div>
             </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <h2 className="text-2xl font-bold">{pageDict.comparison.title}</h2>
          </CardHeader>
          <CardContent>
              <div className="overflow-x-auto">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              {comparisonData.headers.map((header: string, index: number) => (
                                  <TableHead key={index} className={index > 0 ? "text-center whitespace-nowrap" : "whitespace-nowrap"}>{header}</TableHead>
                              ))}
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {comparisonData.rows.map((row: string[], rowIndex: number) => (
                              <TableRow key={rowIndex}>
                                  {row.map((cell: string, cellIndex: number) => (
                                      <TableCell key={cellIndex} className={cellIndex > 0 ? 'text-center' : ''} dangerouslySetInnerHTML={{ __html: cell }}></TableCell>
                                  ))}
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
               <div></div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-accent/5 border-accent/20 hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-7 w-7 text-accent" />
              <h2 className="text-2xl font-bold">{pageDict.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div></div>
          </CardContent>
        </Card>
    </CalculatorPageLayout>
  );
}