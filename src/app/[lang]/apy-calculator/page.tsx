
import { ApyCalculator } from "@/components/calculators/ApyCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, BarChart2, UserCheck, Landmark, GitCompareArrows, AlertTriangle, Star } from "lucide-react";
import Link from "next/link";
import { ApyPremiumChart } from "@/components/calculators/ApyPremiumChart";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { FooterCta } from "@/components/layout/FooterCta";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const pageDict = (await import(`@/dictionaries/${lang}/apy-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/apy-calculator`;
  const ogImageUrl = `${siteUrl}/images/APY-Calculator-online.png`;

  const faqItems = pageDict.faqs;
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": "APY Calculator 2025 — Atal Pension Yojana Premium Chart & Pension",
    "description": "Use our FREE APY Calculator to find the monthly premium required for ₹1,000–₹5,000 pensions. Get age-based premium charts, eligibility, FAQs and downloadable CSV. Updated Sep 2025.",
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
    "about": ["Atal Pension Yojana", "Pension Calculator", "Government Schemes"],
    "datePublished": "2024-07-25",
    "dateModified": "2025-09-01"
  };

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
    twitter: {
      card: 'summary_large_image',
      title: pageDict.meta_title,
      description: pageDict.meta_description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/apy-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([faqSchema, articleSchema]),
    },
  };
}

export default async function ApyCalculatorPage({ params }: { params: Promise<{ lang: Locale }>}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const pageDict = (await import(`@/dictionaries/${lang}/apy-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'APY Calculator', item: `${siteUrl}/${lang}/apy-calculator` },
    ],
  };
  
  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{__html: pageDict.h1}}></h1>
          <div className="bs-byline justify-center text-center">
            <span className="bs-author">By <strong>Mahesh Chaube</strong></span>
            <span className="bs-creds">, CFP</span>
            <span className="bs-sep">|</span>
            <span className="bs-updated">Last updated: <time dateTime="2025-09-01">September 2025</time></span>
            <div className="bs-reviewed">Reviewed by <strong>Laveena Vijayi</strong> — BharatSaver Editorial Team</div>
          </div>
          <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{__html: pageDict.description}}></p>
        </div>
        
        <ApyCalculator dictionary={pageDict} />

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Shield className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{pageDict.what_is_apy.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.what_is_apy.body }}></p>
            <ul className="mt-4 space-y-2">
                {pageDict.what_is_apy.points.map((point: string, index: number) => (
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
              <h2 className="text-2xl font-bold">{pageDict.how_it_works.title}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
              <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.how_it_works.intro }}></p>
              <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">{pageDict.how_it_works.example.title}</h3>
                  <p className="mt-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.how_it_works.example.body }}></p>
                   <p className="mt-2 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.how_it_works.example.note }}></p>
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
            <p className="mb-4 text-muted-foreground" dangerouslySetInnerHTML={{__html: pageDict.premium_chart.description}}></p>
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
                    <li key={index} dangerouslySetInnerHTML={{__html: step}}></li>
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
            <div dangerouslySetInnerHTML={{__html: pageDict.rules.body}} />
          </CardContent>
        </Card>

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
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.related_calculators.body.replace(/{lang}/g, lang) }} />
          </CardContent>
        </Card>
        <AuthorCard dictionary={dictionary.author_card} />
        <FooterCta dictionary={dictionary.footer_cta} lang={lang} />
      </div>
    </div>
  );
}

    

    