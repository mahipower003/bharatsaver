
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { UpsPensionCalculator } from "@/components/calculators/UpsPensionCalculator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, TrendingUp, Star, AlertTriangle, CheckCircle, HelpCircle, GitCompareArrows, Table as TableIcon } from "lucide-react";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FooterCta } from "@/components/layout/FooterCta";
import Link from "next/link";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = (await import(`@/dictionaries/${lang}/ups-pension-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/ups-pension-calculator`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": dict.faqs.map((faq: { q: string, a: string }) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
    }))
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "UPS Pension Calculator",
    "url": pageUrl,
    "applicationCategory": "FinanceApplication",
    "description": "Estimate your monthly pension, family pension and lump sum under the Unified Pension Scheme.",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
    }
  };

  const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": pageUrl
      },
      "headline": dict.h1,
      "datePublished": "2024-08-02",
      "dateModified": "2024-08-02",
      "author": {
        "@type": "Person",
        "name": "Mahesh Chaube, CFP",
        "url": `${siteUrl}/${lang}/author/mahesh-chaube`
      },
      "publisher": {
        "@type": "Organization",
        "name": "BharatSaver",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/icon.svg`
        }
      }
  };
  
  const howToSchema = {
    "@context":"https://schema.org",
    "@type":"HowTo",
    "name":"How to calculate your UPS pension (transcript)",
    "description":"Step-by-step example showing how the UPS Pension Calculator derives the monthly pension.",
    "step":[
      {"@type":"HowToStep","name":"Step 1","text":"Take last drawn Basic Pay and DA%."},
      {"@type":"HowToStep","name":"Step 2","text":"Compute Pensionable Salary = Basic × (1 + DA%/100)."},
      {"@type":"HowToStep","name":"Step 3","text":"Apply formula: Monthly Pension = (Pensionable Salary × Pension Factor × Service Years) / Divisor."},
      {"@type":"HowToStep","name":"Step 4","text":"Show family pension and commuted lump sum if applicable."}
    ]
  };

  return {
    title: dict.meta_title,
    description: dict.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/ups-pension-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
     other: {
      'application/ld+json': JSON.stringify([faqSchema, softwareSchema, articleSchema, howToSchema]),
    },
  };
}

export default async function UpsPensionCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const dict = (await import(`@/dictionaries/${lang}/ups-pension-calculator.json`)).default;
  const workedExamples = dict.worked_examples;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://bharatsaver.com/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `https://bharatsaver.com/${lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'UPS Pension Calculator', item: `https://bharatsaver.com/${lang}/ups-pension-calculator` },
    ],
  };

  return (
    <div className="py-12">
       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dict.h1}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{dict.hero_subtitle}</p>
        </div>

        <div className="bs-byline justify-center text-center">
            <span className="bs-author">By <strong>Mahesh Chaube, CFP</strong></span>
            <span className="bs-sep">|</span>
            <span className="bs-updated">Last reviewed: <time dateTime="2024-08-02">{dict.last_reviewed_date}</time></span>
            <div className="bs-reviewed">Reviewed by <strong>Laveena Vijayi</strong> — BharatSaver Editorial Team</div>
        </div>
        
        <UpsPensionCalculator dictionary={dict} />

        <div className="space-y-8 mt-12">
            {workedExamples && <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><TableIcon className="h-6 w-6 text-primary" />{workedExamples.h2}</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{workedExamples.scenario1.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: workedExamples.scenario1.body }} />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{workedExamples.scenario2.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: workedExamples.scenario2.body }} />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{workedExamples.scenario3.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: workedExamples.scenario3.body }} />
                  </div>
                </CardContent>
            </Card>}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-primary" />{dict.how_it_works.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.how_it_works.body }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><FileText className="h-6 w-6 text-primary" />{dict.formula_section.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.formula_section.body }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><GitCompareArrows className="h-6 w-6 text-primary" />{dict.family_pension.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.family_pension.body }} />
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><GitCompareArrows className="h-6 w-6 text-primary" />{dict.comparison.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.comparison.body }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-primary" />{dict.tax_rules.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.tax_rules.body }} />
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-primary" />{dict.optimization.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.optimization.body }} />
            </Card>

            <Card id="methodology" className="mt-12 text-sm text-muted-foreground">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="h-5 w-5"/>
                        <h2 className="text-2xl font-bold">{dict.methodology.h2}</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: dict.methodology.body }}/>
            </Card>
            
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-center mb-6">{dict.faq_title}</h2>
                <Accordion type="single" collapsible className="w-full">
                {dict.faqs.map((faq: { q: string, a: string }, index: number) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                    <AccordionContent>
                        <p dangerouslySetInnerHTML={{ __html: faq.a }}></p>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </div>

             <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Star className="h-7 w-7 text-accent" />
                  <h2 className="text-2xl font-bold">{dict.conclusion.h2}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{dict.conclusion.body}</p>
              </CardContent>
            </Card>

            {dict?.related_calculators && <Card className="mt-12 shadow-lg bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <h2 className="text-2xl font-bold">{dict.related_calculators.title}</h2>
                <p className="text-muted-foreground mt-2">{dict.related_calculators.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dict.related_calculators.tools.map((tool: { name: string; description: string; link: string }, index: number) => (
                    <Link
                      key={index}
                      href={tool.link.replace('{lang}', lang)}
                      className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md hover:border-blue-400 transition-all group bg-white dark:bg-slate-900"
                    >
                      <h3 className="font-semibold text-primary group-hover:underline mb-1">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>}
            
            <Alert variant="destructive" className="mt-8">
              <AlertTitle>{dict.disclaimer.title} (Last reviewed: August 2024)</AlertTitle>
              <AlertDescription>
                {dict.disclaimer.body}
              </AlertDescription>
            </Alert>
            
            <AuthorCard dictionary={dictionary.author_card} />
            <FooterCta dictionary={dictionary.footer_cta} lang={lang} />
        </div>
      </div>
    </div>
  );
}
