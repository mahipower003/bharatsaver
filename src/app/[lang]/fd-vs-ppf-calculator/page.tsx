
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

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['fd_vs_ppf_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/fd-vs-ppf-calculator`;

  const faqItems = dictionary.fd_vs_ppf_calculator.faqs;
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

  return {
    title: dictionary.fd_vs_ppf_calculator.meta_title,
    description: dictionary.fd_vs_ppf_calculator.meta_description,
    openGraph: {
      title: dictionary.fd_vs_ppf_calculator.og_title,
      description: dictionary.fd_vs_ppf_calculator.og_description,
      url: pageUrl,
      images: [{ url: `/images/fd-vs-ppf-calculator.png`, width: 1200, height: 630, alt: 'BharatSaver FD vs PPF Calculator' }],
      locale: params.lang === 'en' ? 'en_IN' : params.lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.fd_vs_ppf_calculator.meta_title,
      description: dictionary.fd_vs_ppf_calculator.meta_description,
      images: [`${siteUrl}/images/fd-vs-ppf-calculator.png`],
    },
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/fd-vs-ppf-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify(faqSchema),
    },
  };
}


export default async function FdVsPpfCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['fd_vs_ppf_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const comparisonData = dictionary.fd_vs_ppf_calculator.comparison.table;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'FD vs PPF Calculator', item: `${siteUrl}/${params.lang}/fd-vs-ppf-calculator` },
    ],
  };
  
  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
         <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{__html: dictionary.fd_vs_ppf_calculator.h1}}></h1>
          <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{__html: dictionary.fd_vs_ppf_calculator.description}}></p>
        </div>

        <FdVsPpfCalculator dictionary={dictionary.fd_vs_ppf_calculator} />

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <HelpCircle className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.fd_vs_ppf_calculator.quick_answer.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.fd_vs_ppf_calculator.quick_answer.body.replace(/{lang}/g, params.lang) }}></p>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
              <h2 className="text-2xl font-bold">{dictionary.fd_vs_ppf_calculator.how_it_works.title}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{dictionary.fd_vs_ppf_calculator.how_it_works.example1.title}</h3>
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.fd_vs_ppf_calculator.how_it_works.example1.body }} />
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{dictionary.fd_vs_ppf_calculator.how_it_works.example2.title}</h3>
               <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.fd_vs_ppf_calculator.how_it_works.example2.body }} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Landmark className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{dictionary.fd_vs_ppf_calculator.ppf_features.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {dictionary.fd_vs_ppf_calculator.ppf_features.points.map((point: string, index: number) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                    ))}
                </ul>
            </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Banknote className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{dictionary.fd_vs_ppf_calculator.fd_features.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {dictionary.fd_vs_ppf_calculator.fd_features.points.map((point: string, index: number) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                    ))}
                </ul>
            </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
              <h2 className="text-2xl font-bold">{dictionary.fd_vs_ppf_calculator.comparison.title}</h2>
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

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.fd_vs_ppf_calculator.tax_impact.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.fd_vs_ppf_calculator.tax_impact.body }}></p>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <CheckCircle className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{dictionary.fd_vs_ppf_calculator.checklist.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {dictionary.fd_vs_ppf_calculator.checklist.points.map((point: string, index: number) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                    ))}
                </ul>
            </CardContent>
        </Card>

        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">{dictionary.fd_vs_ppf_calculator.faq_title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {dictionary.fd_vs_ppf_calculator.faqs.map((faq: { question: string, answer: string }, index: number) => (
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
              <h2 className="text-2xl font-bold">{dictionary.fd_vs_ppf_calculator.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.fd_vs_ppf_calculator.conclusion.body.replace(/{lang}/g, params.lang) }}></p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
