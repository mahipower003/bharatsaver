
import { MutualFundOverlapCalculator } from "@/components/calculators/MutualFundOverlapCalculator";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart2, HelpCircle, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['mutual_fund_overlap_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/mutual-fund-overlap-calculator`;
  
  const title = dictionary.mutual_fund_overlap_calculator.meta_title;
  const description = dictionary.mutual_fund_overlap_calculator.meta_description;

  const softwareSchema = {
    "@context":"https://schema.org",
    "@type":"SoftwareApplication",
    "name":"Mutual Fund Overlap Calculator",
    "url": pageUrl,
    "applicationCategory":"FinanceApplication",
    "operatingSystem":"Web",
    "description":"Compare holdings across mutual funds in India and compute weighted overlap."
  };

  const articleSchema = {
    "@context":"https://schema.org",
    "@type":"Article",
    "headline": dictionary.mutual_fund_overlap_calculator.h1,
    "author":{"@type":"Person","name":"Mahesh Chaube","jobTitle":"CFP","url":`${siteUrl}/${params.lang}/author/mahesh-chaube`},
    "datePublished":"2025-09-01","dateModified":"2025-09-12",
    "publisher":{"@type":"Organization","name":"BharatSaver","logo":{"@type":"ImageObject","url":`${siteUrl}/icon.svg`}}
  };
  
  const faqSchema = {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": dictionary.mutual_fund_overlap_calculator.faq.faqs.map((faq: { q: string, a: string }) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
    }))
  };

  return {
    title: title,
    description: description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/mutual-fund-overlap-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
     other: {
      'application/ld+json': JSON.stringify([articleSchema, softwareSchema, faqSchema]),
    },
  };
}

export default async function MutualFundOverlapCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['mutual_fund_overlap_calculator', 'author_card']);
  
  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl">
         <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.mutual_fund_overlap_calculator.h1}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.hero.subtitle }} />
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{dictionary.mutual_fund_overlap_calculator.tool.title}</CardTitle>
            <CardDescription>{dictionary.mutual_fund_overlap_calculator.tool.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <MutualFundOverlapCalculator dictionary={dictionary.mutual_fund_overlap_calculator} />
          </CardContent>
        </Card>
        
        <div className="space-y-8 mt-12">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-primary" />{dictionary.mutual_fund_overlap_calculator.what_is_overlap.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.what_is_overlap.body }} />
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><FileText className="h-6 w-6 text-primary" />{dictionary.mutual_fund_overlap_calculator.how_it_works.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.how_it_works.body }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><BarChart2 className="h-6 w-6 text-primary" />{dictionary.mutual_fund_overlap_calculator.live_example.h2}</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="mb-4">{dictionary.mutual_fund_overlap_calculator.live_example.intro}</p>
                    <Alert>
                        <AlertTitle>Example Result</AlertTitle>
                        <AlertDescription dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.live_example.result }} />
                    </Alert>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-primary" />{dictionary.mutual_fund_overlap_calculator.interpreting_results.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.interpreting_results.body }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-primary" />{dictionary.mutual_fund_overlap_calculator.what_to_do.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.what_to_do.body }} />
            </Card>
        </div>

        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">{dictionary.mutual_fund_overlap_calculator.faq.h2}</h2>
            <Accordion type="single" collapsible className="w-full">
            {dictionary.mutual_fund_overlap_calculator.faq.faqs.map((faq: { q: string, a: string }, index: number) => (
                <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>
                    <p dangerouslySetInnerHTML={{ __html: faq.a }}></p>
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </div>

        <AuthorCard dictionary={dictionary.author_card} />

        <Card className="mt-12 text-sm text-muted-foreground">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="h-5 w-5"/>
                    <h2 className="text-2xl font-bold">{dictionary.mutual_fund_overlap_calculator.methodology.h2}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.methodology.body }}/>
        </Card>
      </div>
    </div>
  );
}
