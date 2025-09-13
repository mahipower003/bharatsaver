
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { UpsPensionCalculator } from "@/components/calculators/UpsPensionCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, TrendingUp, Star, AlertTriangle, CheckCircle, HelpCircle, GitCompareArrows } from "lucide-react";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['ups_pension_calculator']);
  const dict = dictionary.ups_pension_calculator;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/ups-pension-calculator`;

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
        "url": `${siteUrl}/${params.lang}/author/mahesh-chaube`
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
      'application/ld+json': JSON.stringify([faqSchema, softwareSchema, articleSchema]),
    },
  };
}

export default async function UpsPensionCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['ups_pension_calculator', 'author_card']);
  const dict = dictionary.ups_pension_calculator;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://bharatsaver.com/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `https://bharatsaver.com/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'UPS Pension Calculator', item: `https://bharatsaver.com/${params.lang}/ups-pension-calculator` },
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
        
        <UpsPensionCalculator dictionary={dict} />

        <div className="mt-4 text-center text-xs text-muted-foreground font-mono bg-muted p-2 rounded-md">
            <span className="font-semibold">{dict.calculation_transcript.title}</span> {dict.calculation_transcript.formula}
        </div>

        <div className="space-y-8 mt-12">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-primary" />{dict.worked_examples.h2}</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{dict.worked_examples.scenario1.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: dict.worked_examples.scenario1.body }} />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{dict.worked_examples.scenario2.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: dict.worked_examples.scenario2.body }} />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{dict.worked_examples.scenario3.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: dict.worked_examples.scenario3.body }} />
                  </div>
                </CardContent>
            </Card>

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
                  <h2 className="text-2xl font-bold">{dict.conclusion.title}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{dict.conclusion.body}</p>
              </CardContent>
            </Card>

            <Alert variant="destructive" className="mt-8">
              <AlertTitle>{dict.disclaimer.title}</AlertTitle>
              <AlertDescription>
                {dict.disclaimer.body}
              </AlertDescription>
            </Alert>
            
            <AuthorCard dictionary={dictionary.author_card} />
        </div>
      </div>
    </div>
  );
}

    