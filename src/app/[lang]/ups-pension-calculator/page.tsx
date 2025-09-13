
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { UpsPensionCalculator } from "@/components/calculators/UpsPensionCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Download, TrendingUp, Star, AlertTriangle, CheckCircle, HelpCircle, GitCompareArrows } from "lucide-react";
import Link from "next/link";
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
      'application/ld+json': JSON.stringify([faqSchema]),
    },
  };
}

export default async function UpsPensionCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['ups_pension_calculator', 'author_card']);
  const dict = dictionary.ups_pension_calculator;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dict.h1}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{dict.hero_subtitle}</p>
        </div>

        <UpsPensionCalculator dictionary={dict} />

        <div className="space-y-8 mt-12">
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
                </CardContent>
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
            
            <Card id="methodology" className="mt-12 text-sm text-muted-foreground">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="h-5 w-5"/>
                        <h2 className="text-2xl font-bold">{dict.methodology.h2}</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: dict.methodology.body }}/>
            </Card>
            
            <Card className="mt-12 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Download className="h-7 w-7 text-primary"/>
                  <h2 className="text-2xl font-bold">{dict.ctas.h2}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{dict.ctas.body}</p>
              </CardContent>
            </Card>
        </div>
        
        <Alert variant="destructive" className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{dict.disclaimer.title}</AlertTitle>
          <AlertDescription>
            {dict.disclaimer.body}
          </AlertDescription>
        </Alert>

        <AuthorCard dictionary={dictionary.author_card} />
      </div>
    </div>
  );
}
