import { SsyCalculator } from "@/components/calculators/SsyCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, TrendingUp, ShieldCheck, Scale, Star, Baby, IndianRupee, Landmark, FileText, ArrowRightLeft } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['ssy_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/ssy-calculator`;

  const faqItems = dictionary.ssy_calculator.faqs;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq: { question: string, answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  
  return {
    title: dictionary.ssy_calculator.meta_title,
    description: dictionary.ssy_calculator.meta_description,
    openGraph: {
        title: dictionary.ssy_calculator.meta_title,
        description: dictionary.ssy_calculator.meta_description,
        url: pageUrl,
        siteName: 'BharatSaver',
        images: [{ 
          url: `/images/calculate-ssy-online.png`,
          width: 1200, 
          height: 630, 
          alt: 'BharatSaver SSY Calculator' 
        }],
        locale: params.lang === 'en' ? 'en_IN' : params.lang,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: dictionary.ssy_calculator.meta_title,
        description: dictionary.ssy_calculator.meta_description,
        images: [`/images/calculate-ssy-online.png`],
    },
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/ssy-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify(faqSchema),
    },
  };
}

export default async function SsyCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['ssy_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'SSY Calculator', item: `${siteUrl}/${params.lang}/ssy-calculator` },
    ],
  };
  
  const historicalRatesData = dictionary.ssy_calculator.historical_rates.table;
  const comparisonData = dictionary.ssy_calculator.comparison.table;
  const exampleData = dictionary.ssy_calculator.example.table;

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.ssy_calculator.h1}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{__html: dictionary.ssy_calculator.description}}></p>
        </div>
        
        <SsyCalculator dictionary={dictionary.ssy_calculator} />

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Baby className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.ssy_calculator.what_is_ssy.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.what_is_ssy.body }}></p>
            <h3 className="font-semibold mt-4 mb-2">{dictionary.ssy_calculator.what_is_ssy.quick_facts.title}</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {dictionary.ssy_calculator.what_is_ssy.quick_facts.points.map((point: string, index: number) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.ssy_calculator.how_it_works.title}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{dictionary.ssy_calculator.example.intro}</p>
            <p className="font-mono bg-muted p-2 rounded-md text-sm">{dictionary.ssy_calculator.example.formula}</p>

            <h3 className="font-semibold pt-4">{dictionary.ssy_calculator.example.scenario.title}</h3>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.example.scenario.body }}></p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {dictionary.ssy_calculator.example.scenario.points.map((point: string, index: number) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
              ))}
            </ul>
            <p className="text-muted-foreground font-semibold" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.example.scenario.result }}></p>

            <h4 className="font-semibold pt-2">{dictionary.ssy_calculator.example.snapshot_title}</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  {exampleData.headers.map((header: string, index: number) => (
                    <TableHead key={index} className={index > 0 ? "text-right" : ""}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {exampleData.rows.map((row: string[], rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <TableCell key={cellIndex} className={cellIndex > 0 ? "text-right" : ""}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground italic pt-2">{dictionary.ssy_calculator.example.footer_note}</p>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.ssy_calculator.comparison.title}</h2>
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
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-7 w-7 text-primary"/>
                  <span className="text-2xl font-bold">{dictionary.ssy_calculator.investment_strategy.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <ol className="list-decimal pl-5 space-y-2">
                {dictionary.ssy_calculator.investment_strategy.points.map((point: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                ))}
              </ol>
            </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <FileText className="h-7 w-7 text-primary"/>
                  <h2 className="text-2xl font-bold">{dictionary.ssy_calculator.how_to_open.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>{dictionary.ssy_calculator.how_to_open.intro}</p>
              <ol className="list-decimal pl-5 space-y-2">
                {dictionary.ssy_calculator.how_to_open.steps.map((step: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: step }}></li>
                ))}
              </ol>
            </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.ssy_calculator.historical_rates.title}</h2>
          </CardHeader>
          <CardContent>
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
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">{dictionary.ssy_calculator.faq_title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {dictionary.ssy_calculator.faqs.map((faq: { question: string, answer: string }, index: number) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>

      </div>
    </div>
  );
}
