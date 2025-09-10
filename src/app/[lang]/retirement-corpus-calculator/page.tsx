
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { RetirementCorpusCalculator } from "@/components/calculators/RetirementCorpusCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calculator, HelpCircle, TrendingUp, Wallet, Landmark, Star, AlertTriangle, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { AuthorCard } from "@/components/layout/AuthorCard";


export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang:Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['retirement_corpus_calculator']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/retirement-corpus-calculator`;
  const ogImageUrl = `${siteUrl}/images/retirement-calc-og.png`;
  
  const softwareSchema = {
    "@context":"https://schema.org",
    "@type":"SoftwareApplication",
    "name":"Retirement Corpus Calculator",
    "url": pageUrl,
    "applicationCategory":"FinanceApplication",
    "operatingSystem":"Web",
    "description":"Calculator to estimate retirement corpus, monthly SIP required and post-retirement income for India.",
    "offers": {
      "@type":"Offer",
      "url": pageUrl,
      "price":"0",
      "priceCurrency":"INR"
    }
  };

  const faqItems = dictionary.retirement_corpus_calculator.faqs;
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
    title: dictionary.retirement_corpus_calculator.meta_title,
    description: dictionary.retirement_corpus_calculator.meta_description,
    alternates: {
      canonical: `https://bharatsaver.com/en/retirement-corpus-calculator`,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/retirement-corpus-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    openGraph: {
        title: "Retirement Corpus Calculator 2025 — How Much to Save to Retire in India",
        description: "Estimate the corpus and monthly SIP required to retire comfortably. India-specific, includes NPS/PPF/EPF guidance.",
        url: pageUrl,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'BharatSaver Retirement Corpus Calculator' }],
        locale: params.lang === 'en' ? 'en_IN' : params.lang,
        type: 'website',
    },
    other: {
      'application/ld+json': JSON.stringify([softwareSchema, faqSchema]),
    },
  };
}

export default async function RetirementCorpusCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['retirement_corpus_calculator', 'author_card']);
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://bharatsaver.com/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `https://bharatsaver.com/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'Retirement Corpus Calculator', item: `https://bharatsaver.com/${params.lang}/retirement-corpus-calculator` },
    ],
  };

  return (
    <div className="py-12">
       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.retirement_corpus_calculator.h1}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{dictionary.retirement_corpus_calculator.intro}</p>
        </div>

        <RetirementCorpusCalculator dictionary={dictionary.retirement_corpus_calculator} />

        <Card className="mt-8 shadow-lg">
          <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <Calculator className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.how_it_works.title}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.how_it_works.body }} />
        </Card>
        
        <Card className="mt-8 shadow-lg">
           <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <HelpCircle className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.inputs_explained.title}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.inputs_explained.body }} />
        </Card>

        <Card className="mt-8 shadow-lg">
          <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <FileText className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.worked_examples.title}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{dictionary.retirement_corpus_calculator.worked_examples.scenario1.title}</h3>
              <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.worked_examples.scenario1.body }} />
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{dictionary.retirement_corpus_calculator.worked_examples.scenario2.title}</h3>
              <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.worked_examples.scenario2.body }} />
            </div>
             <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{dictionary.retirement_corpus_calculator.worked_examples.scenario3.title}</h3>
              <div className="prose dark:prose-invert max-w-none mt-2 text-sm" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.worked_examples.scenario3.body }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-8 shadow-lg">
           <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.accumulation_strategy.title}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.accumulation_strategy.body }} />
        </Card>

        <Card className="mt-8 shadow-lg">
           <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <Wallet className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.deaccumulation_strategy.title}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.deaccumulation_strategy.body }} />
        </Card>
        
        <Card className="mt-8 shadow-lg">
           <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <Landmark className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.tax_rules.title}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.tax_rules.body }} />
        </Card>
        
        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Download className="h-7 w-7 text-primary"/>
              <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.next_steps.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="https://www.cleartax.in/e-filing-of-income-tax-return" target="_blank" rel="noopener noreferrer" className="block group">
                      <Card className="h-full hover:shadow-md transition-shadow">
                          <CardHeader className="flex flex-row items-center gap-4">
                              <TrendingUp className="h-8 w-8 text-primary"/>
                              <div>
                                  <CardTitle className="text-lg">{dictionary.retirement_corpus_calculator.next_steps.cta1_title}</CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">{dictionary.retirement_corpus_calculator.next_steps.cta1_desc}</p>
                              </div>
                          </CardHeader>
                      </Card>
                  </Link>
                   <Link href={`/${params.lang}/calculators`} className="block group">
                      <Card className="h-full hover:shadow-md transition-shadow">
                          <CardHeader className="flex flex-row items-center gap-4">
                              <Calculator className="h-8 w-8 text-primary"/>
                              <div>
                                  <CardTitle className="text-lg">{dictionary.retirement_corpus_calculator.next_steps.cta2_title}</CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">{dictionary.retirement_corpus_calculator.next_steps.cta2_desc}</p>
                              </div>
                          </CardHeader>
                      </Card>
                  </Link>
              </div>
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-7 w-7 text-accent" />
              <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{dictionary.retirement_corpus_calculator.conclusion.body}</p>
          </CardContent>
        </Card>
        
        <Alert variant="destructive" className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{dictionary.retirement_corpus_calculator.disclaimer.title}</AlertTitle>
          <AlertDescription>
            {dictionary.retirement_corpus_calculator.disclaimer.body}
          </AlertDescription>
        </Alert>

        <AuthorCard dictionary={dictionary.author_card} />
      </div>
    </div>
  );
}

    