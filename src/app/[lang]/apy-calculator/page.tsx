
import { ApyCalculator } from "@/components/calculators/ApyCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, BarChart2, UserCheck, Landmark, GitCompareArrows, AlertTriangle, Star } from "lucide-react";
import Link from "next/link";
import { ApyPremiumChart } from "@/components/calculators/ApyPremiumChart";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['apy_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/apy-calculator`;

  const faqItems = dictionary.apy_calculator.faqs;
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
    title: dictionary.apy_calculator.meta_title,
    description: dictionary.apy_calculator.meta_description,
    openGraph: {
      title: dictionary.apy_calculator.og_title,
      description: dictionary.apy_calculator.og_description,
      url: pageUrl,
      images: [{ url: `/images/APY-Calculator-online.png`, width: 1200, height: 630, alt: 'BharatSaver APY Calculator' }],
      locale: params.lang === 'en' ? 'en_IN' : params.lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.apy_calculator.meta_title,
      description: dictionary.apy_calculator.meta_description,
      images: [`${siteUrl}/images/APY-Calculator-online.png`],
    },
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/apy-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify(faqSchema),
    },
  };
}

export default async function ApyCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['apy_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'APY Calculator', item: `${siteUrl}/${params.lang}/apy-calculator` },
    ],
  };
  
  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{__html: dictionary.apy_calculator.h1}}></h1>
          <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{__html: dictionary.apy_calculator.description}}></p>
        </div>
        
        <ApyCalculator dictionary={dictionary.apy_calculator} />

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Shield className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.apy_calculator.what_is_apy.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.apy_calculator.what_is_apy.body }}></p>
            <ul className="mt-4 space-y-2">
                {dictionary.apy_calculator.what_is_apy.points.map((point: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                        <UserCheck className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{__html: point}}></span>
                    </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <BarChart2 className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.apy_calculator.premium_chart.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground" dangerouslySetInnerHTML={{__html: dictionary.apy_calculator.premium_chart.description}}></p>
            <ApyPremiumChart dictionary={dictionary.apy_calculator.premium_chart} />
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Landmark className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.apy_calculator.enrollment.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{dictionary.apy_calculator.enrollment.intro}</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {dictionary.apy_calculator.enrollment.steps.map((step: string, index: number) => (
                    <li key={index} dangerouslySetInnerHTML={{__html: step}}></li>
                ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <GitCompareArrows className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{dictionary.apy_calculator.comparison.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent dangerouslySetInnerHTML={{__html: dictionary.apy_calculator.comparison.body.replace(/{lang}/g, params.lang)}} />
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.apy_calculator.rules.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div dangerouslySetInnerHTML={{__html: dictionary.apy_calculator.rules.body}} />
          </CardContent>
        </Card>

        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">{dictionary.apy_calculator.faq_title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {dictionary.apy_calculator.faqs.map((faq: { question: string, answer: string }, index: number) => (
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
              <h2 className="text-2xl font-bold">{dictionary.apy_calculator.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{dictionary.apy_calculator.conclusion.body}</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
