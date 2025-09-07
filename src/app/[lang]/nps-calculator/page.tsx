
import { NpsCalculator } from "@/components/calculators/NpsCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, TrendingUp, ShieldCheck, Scale, Star, FileText } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['nps_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/nps-calculator`;

  const faqItems = dictionary.nps_calculator.faqs;
  const faqSchema = {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": faqItems.map((faq: { question: string, answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return {
    title: dictionary.nps_calculator.meta_title,
    description: dictionary.nps_calculator.meta_description,
    openGraph: {
      title: dictionary.nps_calculator.meta_title,
      description: dictionary.nps_calculator.meta_description,
      url: pageUrl,
      images: [{ url: `${siteUrl}/images/nps-calculator-online.png`, width: 1200, height: 630, alt: 'BharatSaver NPS Calculator' }],
      locale: params.lang === 'en' ? 'en_IN' : params.lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.nps_calculator.meta_title,
      description: dictionary.nps_calculator.meta_description,
      images: [`${siteUrl}/images/nps-calculator-online.png`],
    },
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/nps-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify(faqSchema),
    },
  };
}

export default async function NpsCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['nps_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'NPS Calculator', item: `${siteUrl}/${params.lang}/nps-calculator` },
    ],
  };

  const comparisonData = dictionary.nps_calculator.comparison.table;
  
  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{__html: dictionary.nps_calculator.h1}}></h1>
          <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{__html: dictionary.nps_calculator.description}}></p>
        </div>
        
        <NpsCalculator dictionary={dictionary.nps_calculator} />

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.nps_calculator.what_is_nps.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.nps_calculator.what_is_nps.body }}></p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {dictionary.nps_calculator.what_is_nps.points.map((point: {title: string, body: string}, index: number) => (
                <div key={index} className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-primary">{point.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{point.body}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.nps_calculator.how_it_works.title}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{dictionary.nps_calculator.how_it_works.formula_title}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{dictionary.nps_calculator.how_it_works.annual.title}</h4>
                  <p className="font-mono bg-background p-3 rounded-md text-center text-sm md:text-base mt-1">{dictionary.nps_calculator.how_it_works.annual.formula}</p>
                </div>
                 <div>
                  <h4 className="font-medium">{dictionary.nps_calculator.how_it_works.monthly.title}</h4>
                  <p className="font-mono bg-background p-3 rounded-md text-center text-sm md:text-base mt-1">{dictionary.nps_calculator.how_it_works.monthly.formula}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg">{dictionary.nps_calculator.example.title}</h3>
              <p className="text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: dictionary.nps_calculator.example.intro }}></p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
                {dictionary.nps_calculator.example.assumptions.map((point: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                ))}
              </ul>
              <div className="mt-4 bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-muted-foreground font-semibold" dangerouslySetInnerHTML={{ __html: dictionary.nps_calculator.example.result }}></p>
              </div>
              <div className="mt-4 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.nps_calculator.example.annuity_intro }}></div>
              <p className="mt-2 text-sm text-muted-foreground font-semibold" dangerouslySetInnerHTML={{ __html: dictionary.nps_calculator.example.annuity_result }}></p>
              <p className="mt-4 text-xs italic text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.nps_calculator.example.disclaimer }}></p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{dictionary.nps_calculator.tax_benefits.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.nps_calculator.tax_benefits.intro }}></p>
                 <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {dictionary.nps_calculator.tax_benefits.points.map((point: string, index: number) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                    ))}
                  </ul>
            </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Scale className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.nps_calculator.rules.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.nps_calculator.rules.intro }}></p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg">{dictionary.nps_calculator.rules.tier1.title}</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                    {dictionary.nps_calculator.rules.tier1.points.map((point: string, index: number) => (
                        <li key={index} dangerouslySetInnerHTML={{__html: point}}></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{dictionary.nps_calculator.rules.tier2.title}</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                    {dictionary.nps_calculator.rules.tier2.points.map((point: string, index: number) => (
                        <li key={index} dangerouslySetInnerHTML={{__html: point}}></li>
                    ))}
                  </ul>
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.nps_calculator.comparison.title}</h2>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          {comparisonData.headers.map((header: string, index: number) => (
                              <TableHead key={index} className={index > 0 ? "text-center" : ""}>{header}</TableHead>
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
               <p className="text-sm text-muted-foreground mt-4" dangerouslySetInnerHTML={{ __html: dictionary.nps_calculator.comparison.footer_note.replace('{lang}', params.lang) }}></p>
          </CardContent>
        </Card>

        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">{dictionary.nps_calculator.faq_title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {dictionary.nps_calculator.faqs.map((faq: { question: string, answer: string }, index: number) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>

        <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-7 w-7 text-accent" />
              <h2 className="text-2xl font-bold">{dictionary.nps_calculator.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{dictionary.nps_calculator.conclusion.body}</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

    