
import { ApyCalculator } from "@/components/calculators/ApyCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, BarChart2, UserCheck, Landmark, GitCompareArrows, AlertTriangle, Star } from "lucide-react";
import Link from "next/link";
import { ApyPremiumChart } from "@/components/calculators/ApyPremiumChart";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { buildAlternates, buildOpenGraph, buildTwitterCard } from '@/lib/seo';

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const pageDict = (await import(`@/dictionaries/${lang}/apy-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/apy-calculator`;
  const ogImageUrl = `${siteUrl}/images/APY-Calculator-online.png`;

  return {
    title: pageDict.meta_title,
    description: pageDict.meta_description,
    openGraph: {
      title: pageDict.og_title,
      description: pageDict.og_description,
      url: pageUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'BharatSaver APY Calculator' }],
      locale: lang === 'en' ? 'en_IN' : lang,
      type: 'website',
    },
    twitter: buildTwitterCard(pageDict.meta_title, pageDict.meta_description, ogImageUrl),
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/apy-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function ApyCalculatorPage({ params }: { params: Promise<{ lang: Locale }>}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = { ...(await import(`@/dictionaries/${lang}/apy-calculator.json`)).default };
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

  return (
    <CalculatorPageLayout
      lang={lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.description}
      lastUpdated="September 2025"
      calculator={<ApyCalculator dictionary={pageDict} />}
      faqs={pageDict.faqs}
      faqTitle={pageDict.faq_title}
      pageUrl={`${siteUrl}/${lang}/apy-calculator`}
    >
      <div className="mt-12 space-y-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Shield className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.what_is_apy.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.what_is_apy.body.replace(/{lang}/g, lang) }}></div>
            <ul className="mt-4 space-y-2">
                {pageDict.what_is_apy.points.map((point: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                        <UserCheck className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{__html: point.replace(/{lang}/g, lang)}}></span>
                    </li>
                ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
          <CardHeader>
              <h2 className="text-2xl font-bold">{pageDict.how_it_works.title}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.how_it_works.intro.replace(/{lang}/g, lang) }}></div>
              <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">{pageDict.how_it_works.example.title}</h3>
                  <div className="mt-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.how_it_works.example.body.replace(/{lang}/g, lang) }}></div>
                   <div className="mt-2 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.how_it_works.example.note.replace(/{lang}/g, lang) }}></div>
              </div>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <BarChart2 className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.premium_chart.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-muted-foreground" dangerouslySetInnerHTML={{__html: pageDict.premium_chart.description.replace(/{lang}/g, lang)}}></div>
            <ApyPremiumChart dictionary={pageDict.premium_chart} />
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Landmark className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.enrollment.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{pageDict.enrollment.intro}</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {pageDict.enrollment.steps.map((step: string, index: number) => (
                    <li key={index} dangerouslySetInnerHTML={{__html: step.replace(/{lang}/g, lang)}}></li>
                ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <GitCompareArrows className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{pageDict.comparison.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent dangerouslySetInnerHTML={{__html: pageDict.comparison.body.replace(/{lang}/g, lang)}} />
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.rules.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div dangerouslySetInnerHTML={{__html: pageDict.rules.body.replace(/{lang}/g, lang)}} />
          </CardContent>
        </Card>



        <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-7 w-7 text-accent" />
              <h2 className="text-2xl font-bold">{pageDict.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.conclusion.body.replace(/{lang}/g, lang) }} />
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BarChart2 className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-bold">{pageDict.related_calculators.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.related_calculators.body.replace(/{lang}/g, lang) }}></div>
          </CardContent>
        </Card>
      </div>
    </CalculatorPageLayout>
  );
}

    

    