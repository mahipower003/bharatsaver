
import { PpfCalculator } from "@/components/calculators/PpfCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, TrendingUp, Landmark, ArrowRight, ShieldCheck, Scale, Star } from "lucide-react";
import Link from "next/link";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const pageDict = (await import(`@/dictionaries/${lang}/ppf-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/ppf-calculator`;
  const ogImageUrl = `${siteUrl}/images/calculate-ppf-online.png`;

  const faqItems = pageDict.faqs;
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": "PPF Calculator 2025 — Calculate PPF Maturity Online (India)",
    "description": "Free PPF calculator for 2025: Instantly estimate PPF maturity, interest, and tax savings (EEE). Includes year-wise charts, extension rules, and comparison with FD, NPS, and SSY.",
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
    "about": ["Public Provident Fund", "PPF Calculator", "PPF Interest Rate"],
    "datePublished": "2024-07-28",
    "dateModified": "2025-09-01"
  }

  return {
    title: pageDict.meta_title,
    description: pageDict.meta_description,
    openGraph: {
        title: pageDict.meta_title,
        description: pageDict.meta_description,
        url: pageUrl,
        siteName: 'BharatSaver',
        images: [{ 
          url: ogImageUrl,
          width: 1200, 
          height: 630, 
          alt: 'BharatSaver PPF Calculator' 
        }],
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
        acc[locale] = `${siteUrl}/${locale}/ppf-calculator`;
        return acc;
    }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify(articleSchema),
    },
  };
}

export default async function PpfCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = { ...(await import(`@/dictionaries/${lang}/ppf-calculator.json`)).default };
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  
  const pageUrl = `${siteUrl}/${lang}/ppf-calculator`;
  
  const comparisonData = pageDict.comparison.table;
  const historicalRatesData = pageDict.historical_rates.table;

  return (
    <CalculatorPageLayout
      lang={lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.description}
      lastUpdated="September 2025"
      calculator={<PpfCalculator dictionary={pageDict} />}
      faqs={pageDict.faqs}
      faqTitle={pageDict.faq_title}
      pageUrl={pageUrl}
    >
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <h2 className="text-2xl font-bold">{pageDict.advantages.title}</h2>
          </CardHeader>
          <CardContent>
            <div></div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {pageDict.advantages.points.map((point: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }}></span>
                </li>
              ))}
            </ul>
            <div></div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-primary/10 border-primary/20 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-7 w-7 text-primary"/>
                  <span className="text-2xl font-bold">{pageDict.investment_strategy.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <div></div>
              <ul>
                {pageDict.investment_strategy.points.map((point: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }}></li>
                ))}
              </ul>
            </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.tax_benefits.title}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div></div>
            <div>
                <h3 className="text-lg font-semibold">{pageDict.tax_benefits.contribution_title}</h3>
                <div></div>
            </div>
            <div>
                <h3 className="text-lg font-semibold">{pageDict.tax_benefits.interest_title}</h3>
                <div></div>
            </div>
            <div>
                <h3 className="text-lg font-semibold">{pageDict.tax_benefits.maturity_title}</h3>
                <div></div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
              <div></div>
            </div>
            <div></div>
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
             <ul className="space-y-3">
                {pageDict.rules.points.map((point: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: point.replace(/{lang}/g, lang) }}></span>
                    </li>
                ))}
            </ul>
            <div></div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Landmark className="h-7 w-7 text-primary"/>
              <h2 className="text-2xl font-bold">{pageDict.how_to_open.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div></div>
            <ol className="list-decimal pl-5 space-y-2">
              {pageDict.how_to_open.steps.map((step: string, index: number) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: step.replace(/{lang}/g, lang) }}></li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-4 mt-6">
                {pageDict.how_to_open.links.map((link: { text: string; href: string }, index: number) => (
                    <Link href={link.href.replace(/{lang}/g, lang)} key={index} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                        {link.text} <ArrowRight className="h-4 w-4" />
                    </Link>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <h2 className="text-2xl font-bold">{pageDict.historical_rates.title}</h2>
          </CardHeader>
          <CardContent>
            <div></div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {historicalRatesData.headers.map((header: string, index: number) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicalRatesData.rows.map((row: string[], rowIndex: number) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell: string, cellIndex: number) => (
                        <TableCell key={cellIndex} dangerouslySetInnerHTML={{ __html: cell.replace(/{lang}/g, lang) }}></TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="prose dark:prose-invert max-w-none mt-4">
                <div></div>
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
                                      <TableCell key={cellIndex} className={cellIndex > 0 ? 'text-center' : ''} dangerouslySetInnerHTML={{ __html: cell.replace(/{lang}/g, lang) }}></TableCell>
                                  ))}
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
                </div>
                 <div></div>
            </CardContent>
        </Card>

        <Card className="shadow-lg bg-accent/10 border-accent/20 hover:shadow-xl transition-shadow duration-300">
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

        {pageDict.related_calculators && (
          <Card className="shadow-lg bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <h2 className="text-2xl font-bold">{pageDict.related_calculators.title}</h2>
              <p className="text-muted-foreground mt-2">{pageDict.related_calculators.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pageDict.related_calculators.tools.map((tool: { name: string; description: string; link: string }, index: number) => (
                  <Link
                    key={index}
                    href={tool.link.replace(/{lang}/g, lang)}
                    className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md hover:border-blue-400 transition-all group bg-white dark:bg-slate-900"
                  >
                    <h3 className="font-semibold text-primary group-hover:underline mb-1">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </CalculatorPageLayout>
  );
}

    

    