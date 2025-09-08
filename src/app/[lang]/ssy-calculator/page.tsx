
import { SsyCalculator } from "@/components/calculators/SsyCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, TrendingUp, ShieldCheck, Scale, Star, Baby, IndianRupee, Landmark, FileText, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { AuthorCard } from "@/components/layout/AuthorCard";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['ssy_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/ssy-calculator`;
  const ogImageUrl = `${siteUrl}/images/calculate-ssy-online.png`;

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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": "SSY Calculator 2025 — Sukanya Samriddhi Yojana Returns & Maturity",
    "description": "Use our free SSY Calculator 2025 to estimate maturity, total interest and year-wise projection (8.2% current rate). Supports annual & monthly deposits. Export results as CSV.",
    "image": ogImageUrl,
    "author": {
      "@type": "Person",
      "name": "Mahesh Chaube",
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
    "datePublished": "2024-07-27",
    "dateModified": "2025-09-01"
  };
  
  return {
    title: "SSY Calculator 2025 — Sukanya Samriddhi Yojana Returns & Maturity",
    description: "Use our free SSY Calculator 2025 to estimate maturity, total interest and year-wise projection (8.2% current rate). Supports annual & monthly deposits. Export results as CSV.",
    openGraph: {
        title: "SSY Calculator 2025 — Sukanya Samriddhi Yojana Returns",
        description: "Plan your daughter's future with the SSY calculator. Updated with current SSY interest rate and download/export options.",
        url: pageUrl,
        images: [{ 
          url: ogImageUrl,
          width: 1200, 
          height: 630, 
          alt: 'BharatSaver SSY Calculator' 
        }],
        locale: params.lang === 'en' ? 'en_IN' : params.lang,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "SSY Calculator 2025 — Sukanya Samriddhi Yojana Returns & Maturity",
        description: "Free SSY Calculator 2025 — estimate Sukanya Samriddhi Yojana maturity, total interest earned and year-wise breakdown (8.2% rate). Compare SSY vs PPF, FD & NPS.",
        images: [ogImageUrl],
    },
    alternates: {
      canonical: `${siteUrl}/en/ssy-calculator`,
      languages: {
        'en': `${siteUrl}/en/ssy-calculator`,
        'hi': `${siteUrl}/hi/ssy-calculator`,
        'mr': `${siteUrl}/mr/ssy-calculator`,
        'ta': `${siteUrl}/ta/ssy-calculator`,
        'te': `${siteUrl}/te/ssy-calculator`,
        'x-default': `${siteUrl}/en/ssy-calculator`,
      }
    },
    other: {
      'application/ld+json': JSON.stringify([faqSchema, articleSchema]),
    },
  };
}

export default async function SsyCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['ssy_calculator', 'author_card']);
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{__html: dictionary.ssy_calculator.h1}}></h1>
           <div className="bs-byline justify-center text-center">
            <span className="bs-author">By <strong>Mahesh Chaube</strong></span>
            <span className="bs-creds">, CFP</span>
            <span className="bs-sep">|</span>
            <span className="bs-updated">Last updated: <time dateTime="2025-09-01">September 2025</time></span>
            <div className="bs-reviewed">Reviewed by <strong>BharatSaver Editorial Team</strong></div>
          </div>
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
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{dictionary.ssy_calculator.example.formula_title}</h3>
              <p className="text-sm text-muted-foreground mb-2" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.example.intro }}></p>
              <p className="font-mono bg-background p-3 rounded-md text-center text-sm md:text-base">{dictionary.ssy_calculator.example.formula}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">{dictionary.ssy_calculator.example.scenario.title}</h3>
              <p className="text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.example.scenario.body }}></p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
                {dictionary.ssy_calculator.example.scenario.points.map((point: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: point }}></li>
                ))}
              </ul>
              <div className="mt-4 bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-muted-foreground font-semibold" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.example.scenario.result }}></p>
              </div>
            </div>

             <div className="mt-2 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.example.timing_note }}></div>

            <div>
              <h4 className="font-semibold text-lg">{dictionary.ssy_calculator.example.snapshot_title}</h4>
              <div className="mt-2 overflow-x-auto">
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
              </div>
              <p className="text-xs text-muted-foreground italic pt-4" dangerouslySetInnerHTML={{__html: dictionary.ssy_calculator.example.footer_note}}></p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg bg-primary/10 border-primary/20">
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
               <div className="mt-4" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.investment_strategy.monthly_example }}></div>
            </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7 text-primary"/>
                    <h2 className="text-2xl font-bold">{dictionary.ssy_calculator.tax_benefits.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.tax_benefits.intro }}></p>
                <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.tax_benefits.body }}></p>
            </CardContent>
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Scale className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.ssy_calculator.rules.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold">{dictionary.ssy_calculator.rules.withdrawal_title}</h3>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.rules.withdrawal_body }}></p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.rules.withdrawal_example }}></p>
            </div>
            
            <h3 className="font-semibold pt-4">{dictionary.ssy_calculator.rules.revival_title}</h3>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.rules.revival_intro }}></p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {dictionary.ssy_calculator.rules.revival_steps.map((step: string, index: number) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: step }}></li>
              ))}
            </ul>

            <h3 className="font-semibold pt-4">{dictionary.ssy_calculator.rules.nomination_title}</h3>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.ssy_calculator.rules.nomination_body }}></p>
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

        <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-7 w-7 text-accent" />
              <h2 className="text-2xl font-bold">{dictionary.ssy_calculator.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{dictionary.ssy_calculator.conclusion.body}</p>
          </CardContent>
        </Card>
        <AuthorCard dictionary={dictionary.author_card} />
      </div>
    </div>
  );
}
