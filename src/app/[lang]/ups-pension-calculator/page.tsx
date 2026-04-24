
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { UpsPensionCalculator } from "@/components/calculators/UpsPensionCalculator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, TrendingUp, Star, AlertTriangle, CheckCircle, HelpCircle, GitCompareArrows, Table as TableIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = (await import(`@/dictionaries/${lang}/ups-pension-calculator.json`)).default;
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/ups-pension-calculator`;

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
      'application/ld+json': JSON.stringify([softwareSchema, articleSchema, howToSchema]),
    },
  };
}

export default async function UpsPensionCalculatorPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const dict = (await import(`@/dictionaries/${lang}/ups-pension-calculator.json`)).default;
  const workedExamples = dict.worked_examples;

  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${lang}/ups-pension-calculator`;

  const mappedFaqs = dict.faqs ? dict.faqs.map((f: any) => ({ question: f.q, answer: f.a })) : [];

  return (
    <CalculatorPageLayout
      lang={lang}
      dictionary={dictionary}
      pageDict={dict}
      h1={dict.h1}
      description={dict.hero_subtitle}
      lastUpdated="September 2025"
      calculator={<UpsPensionCalculator dictionary={dict} />}
      faqs={mappedFaqs}
      faqTitle={dict.faq_title}
      pageUrl={pageUrl}
    >
        <div className="space-y-8 mt-12 print-hide">
            {workedExamples && <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><TableIcon className="h-6 w-6 text-primary" />{workedExamples.h2}</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{workedExamples.scenario1.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: workedExamples.scenario1.body.replace(/{lang}/g, lang) }} />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{workedExamples.scenario2.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: workedExamples.scenario2.body.replace(/{lang}/g, lang) }} />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{workedExamples.scenario3.title}</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: workedExamples.scenario3.body.replace(/{lang}/g, lang) }} />
                  </div>
                </CardContent>
            </Card>}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-primary" />{dict.how_it_works.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.how_it_works.body.replace(/{lang}/g, lang) }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><FileText className="h-6 w-6 text-primary" />{dict.formula_section.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.formula_section.body.replace(/{lang}/g, lang) }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><GitCompareArrows className="h-6 w-6 text-primary" />{dict.family_pension.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.family_pension.body.replace(/{lang}/g, lang) }} />
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><GitCompareArrows className="h-6 w-6 text-primary" />{dict.comparison.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.comparison.body.replace(/{lang}/g, lang) }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-primary" />{dict.tax_rules.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.tax_rules.body.replace(/{lang}/g, lang) }} />
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-primary" />{dict.optimization.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dict.optimization.body.replace(/{lang}/g, lang) }} />
            </Card>

            <Card id="methodology" className="mt-12 text-sm text-muted-foreground">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="h-5 w-5"/>
                        <h2 className="text-2xl font-bold">{dict.methodology.h2}</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: dict.methodology.body.replace(/{lang}/g, lang) }}/>
            </Card>
             <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Star className="h-7 w-7 text-accent" />
                  <h2 className="text-2xl font-bold">{dict.conclusion.h2}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: dict.conclusion.body.replace(/{lang}/g, lang) }}></div>
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
              <AlertDescription dangerouslySetInnerHTML={{ __html: dict.disclaimer.body.replace(/{lang}/g, lang) }} />
            </Alert>
        </div>
    </CalculatorPageLayout>
  );
}
