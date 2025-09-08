
import { PpfCalculator } from "@/components/calculators/PpfCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, TrendingUp, Landmark, ArrowRight, ShieldCheck, Scale, Star } from "lucide-react";
import Link from "next/link";
import { AuthorCard } from "@/components/layout/AuthorCard";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['ppf_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/ppf-calculator`;
  const ogImageUrl = `${siteUrl}/images/calculate-ppf-online.png`;

  const faqItems = dictionary.ppf_calculator.faqs;
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
    title: dictionary.ppf_calculator.meta_title,
    description: dictionary.ppf_calculator.meta_description,
    openGraph: {
        title: dictionary.ppf_calculator.meta_title,
        description: dictionary.ppf_calculator.meta_description,
        url: pageUrl,
        siteName: 'BharatSaver',
        images: [{ 
          url: ogImageUrl,
          width: 1200, 
          height: 630, 
          alt: 'BharatSaver PPF Calculator' 
        }],
        locale: params.lang === 'en' ? 'en_IN' : params.lang,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: dictionary.ppf_calculator.meta_title,
        description: dictionary.ppf_calculator.meta_description,
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
      'application/ld+json': JSON.stringify([faqSchema, articleSchema]),
    },
  };
}

export default async function PpfCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['ppf_calculator', 'author_card']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'PPF Calculator', item: `${siteUrl}/${params.lang}/ppf-calculator` },
    ],
  };
  
  const comparisonData = dictionary.ppf_calculator.comparison.table;
  const historicalRatesData = dictionary.ppf_calculator.historical_rates.table;

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.ppf_calculator.h1}
          </h1>
          <div className="bs-byline justify-center text-center">
            <span className="bs-author">By <strong>Mahesh Chaube</strong></span>
            <span className="bs-creds">, CFP</span>
            <span className="bs-sep">|</span>
            <span className="bs-updated">Last updated: <time dateTime="2025-09-01">September 2025</time></span>
            <div className="bs-reviewed">Reviewed by <strong>Laveena Vijayi</strong> — BharatSaver Editorial Team</div>
          </div>
          <p className="mt-4 text-lg text-muted-foreground">
            {dictionary.ppf_calculator.description}
          </p>
        </div>
        
        <PpfCalculator dictionary={dictionary.ppf_calculator} />

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.advantages.title}</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">{dictionary.ppf_calculator.advantages.intro}</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {dictionary.ppf_calculator.advantages.points.map((point: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-semibold" dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.advantages.conclusion }}></p>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg bg-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-7 w-7 text-primary"/>
                  <span className="text-2xl font-bold">{dictionary.ppf_calculator.investment_strategy.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.investment_strategy.intro }}></p>
              <ul>
                {dictionary.ppf_calculator.investment_strategy.points.map((point: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                ))}
              </ul>
            </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
          <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.tax_benefits.title}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{dictionary.ppf_calculator.tax_benefits.intro}</p>
            <div>
                <h3 className="text-lg font-semibold">{dictionary.ppf_calculator.tax_benefits.contribution_title}</h3>
                <p className="text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.tax_benefits.contribution_body }}></p>
            </div>
            <div>
                <h3 className="text-lg font-semibold">{dictionary.ppf_calculator.tax_benefits.interest_title}</h3>
                <p className="text-muted-foreground mt-1">{dictionary.ppf_calculator.tax_benefits.interest_body}</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold">{dictionary.ppf_calculator.tax_benefits.maturity_title}</h3>
                <p className="text-muted-foreground mt-1">{dictionary.ppf_calculator.tax_benefits.maturity_body}</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
              <p className="font-semibold" dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.tax_benefits.why_matters }}></p>
            </div>
            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.tax_benefits.footer_note }}></p>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Scale className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.rules.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <ul className="space-y-3">
                {dictionary.ppf_calculator.rules.points.map((point: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: point }}></span>
                    </li>
                ))}
            </ul>
            <p className="text-sm text-muted-foreground pt-4" dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.rules.footer_note }}></p>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Landmark className="h-7 w-7 text-primary"/>
              <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.how_to_open.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>{dictionary.ppf_calculator.how_to_open.intro}</p>
            <ol className="list-decimal pl-5 space-y-2">
              {dictionary.ppf_calculator.how_to_open.steps.map((step: string, index: number) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: step }}></li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-4 mt-6">
                {dictionary.ppf_calculator.how_to_open.links.map((link: { text: string; href: string }, index: number) => (
                    <Link href={link.href} key={index} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                        {link.text} <ArrowRight className="h-4 w-4" />
                    </Link>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.historical_rates.title}</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">{dictionary.ppf_calculator.historical_rates.intro}</p>
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
            <div className="prose dark:prose-invert max-w-none mt-4">
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.historical_rates.sources }}></p>
                <p className="font-semibold italic">{dictionary.ppf_calculator.historical_rates.insight}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.comparison.title}</h2>
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
                                    <TableCell key={cellIndex} className={cellIndex > 0 ? 'text-center' : ''}>{cell}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <p className="text-sm text-muted-foreground mt-4" dangerouslySetInnerHTML={{ __html: dictionary.ppf_calculator.comparison.footer_note.replace('{lang}', params.lang) }}></p>
            </CardContent>
        </Card>

        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">{dictionary.ppf_calculator.faq_title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {dictionary.ppf_calculator.faqs.map((faq: { question: string, answer: string }, index: number) => (
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
              <h2 className="text-2xl font-bold">{dictionary.ppf_calculator.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{dictionary.ppf_calculator.conclusion.body}</p>
          </CardContent>
        </Card>
        <AuthorCard dictionary={dictionary.author_card} />
      </div>
    </div>
  );
}
