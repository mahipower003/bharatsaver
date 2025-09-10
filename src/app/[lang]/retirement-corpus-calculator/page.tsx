
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { RetirementCorpusCalculator, type CalculationResult } from "@/components/calculators/RetirementCorpusCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calculator, HelpCircle, TrendingUp, Wallet, Landmark, Star, AlertTriangle, Download, BadgeCheck, LineChart, Banknote, TableIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { calculateRetirementCorpus, calculateSip } from "@/lib/calculations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

function formatCurrency(value: number) {
    if (Math.abs(value) >= 10000000) {
        return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(value) >= 100000) {
        return `₹${(value / 100000).toFixed(2)} Lakh`;
    }
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
    "description":"India-specific retirement corpus calculator with inflation, pre/post-ret returns and SIP estimate.",
    "offers":{
      "@type":"Offer",
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": "Retirement Corpus Calculator — How Much Money Do You Need to Retire in India (2025)",
    "description": "Use our free Retirement Corpus Calculator (India) — includes inflation, pre/post-retirement returns, life expectancy, existing savings and worked examples (₹6L/₹10L/₹15L). Export results & get a 1-page retirement plan.",
    "image": ogImageUrl,
    "author": {
      "@type": "Person",
      "name": "Mahesh Chaube, CFP",
      "url": `${siteUrl}/${params.lang}/author/mahesh-chaube`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "BharatSaver",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/icon.svg`
      }
    },
    "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Laveena Vijayi",
          "jobTitle": "Finance Editor"
        },
        "reviewBody": "This calculator provides a comprehensive and accurate retirement projection based on India-specific factors. The inclusion of worked examples and sensitivity analysis makes it an invaluable tool for financial planning."
    },
    "about": ["Retirement Planning", "SIP Calculator", "Retirement Corpus India"],
    "datePublished": "2024-07-22",
    "dateModified": "2025-09-01"
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
        title: dictionary.retirement_corpus_calculator.meta_title,
        description: dictionary.retirement_corpus_calculator.meta_description,
        url: pageUrl,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'BharatSaver Retirement Corpus Calculator' }],
        locale: params.lang === 'en' ? 'en_IN' : params.lang,
        type: 'website',
    },
    other: {
      'application/ld+json': JSON.stringify([softwareSchema, faqSchema, articleSchema]),
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

  const defaultValues = {
      currentAge: 30,
      retirementAge: 60,
      monthlyExpenses: 50000,
      currentSavings: 500000,
      inflationRate: 6,
      preRetirementReturns: 12,
      postRetirementReturns: 7,
  };

  const initialResult: CalculationResult = calculateRetirementCorpus(defaultValues);

  const sensitivityScenarios = [
    { label: 'Base Case', values: { ...defaultValues } },
    { label: '+1% Inflation', values: { ...defaultValues, inflationRate: 7 } },
    { label: '-1% Inflation', values: { ...defaultValues, inflationRate: 5 } },
    { label: '+2% Pre-Retirement Returns', values: { ...defaultValues, preRetirementReturns: 14 } },
    { label: '-2% Pre-Retirement Returns', values: { ...defaultValues, preRetirementReturns: 10 } },
  ];

  const sensitivityData = sensitivityScenarios.map(s => ({
    scenario: s.label,
    ...calculateRetirementCorpus(s.values)
  }));
  
  const sipPlanTargets = [10000000, 20000000, 50000000];
  const sipPlanAges = [30, 40, 50];
  const sipPlanData = sipPlanTargets.map(corpus => {
    const row: { [key: string]: string | number } = { corpus: formatCurrency(corpus) };
    sipPlanAges.forEach(age => {
      const yearsToRetire = 60 - age;
      const monthlySip = calculateSip({
          targetCorpus: corpus,
          yearsToRetire: yearsToRetire,
          rateOfReturn: 12, // assuming 12% for this table
          existingSavings: 0
      });
      row[`age${age}`] = formatCurrency(monthlySip);
    });
    return row;
  });


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
        
        <div className="bs-byline justify-center text-center">
            <span className="bs-author">By <strong>Mahesh Chaube, CFP</strong></span>
            <span className="bs-sep">|</span>
            <span className="bs-updated">Last updated: <time dateTime="2025-09-01">September 2025</time></span>
            <div className="bs-reviewed">Reviewed by <strong>Laveena Vijayi</strong> — BharatSaver Editorial Team</div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl font-headline mt-12 mb-6 text-center">
          {dictionary.retirement_corpus_calculator.tool_section.h2}
        </h2>
        <RetirementCorpusCalculator dictionary={dictionary.retirement_corpus_calculator} initialResult={initialResult} />

        <Alert className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{dictionary.retirement_corpus_calculator.assumptions.title}</AlertTitle>
            <AlertDescription>
                <div className="prose dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.assumptions.body }} />
            </AlertDescription>
        </Alert>

        <Card className="mt-8 shadow-lg">
           <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <Calculator className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.how_it_works.h2}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.how_it_works.body }} />
        </Card>
        
        <Card className="mt-8 shadow-lg">
           <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <HelpCircle className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.inputs_explained.h2}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.inputs_explained.body }} />
        </Card>

        <Card className="mt-8 shadow-lg">
          <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <FileText className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.worked_examples.h2}</h2>
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
                <TableIcon className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.sensitivity_analysis.title}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="mb-4 text-muted-foreground">{dictionary.retirement_corpus_calculator.sensitivity_analysis.body}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scenario</TableHead>
                    <TableHead className="text-right">Required Corpus</TableHead>
                    <TableHead className="text-right">Monthly SIP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sensitivityData.map(data => (
                    <TableRow key={data.scenario}>
                      <TableCell className="font-medium">{data.scenario}</TableCell>
                      <TableCell className="text-right">{formatCurrency(data.requiredCorpus)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(data.monthlySip)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>

        <Card className="mt-8 shadow-lg">
           <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.accumulation_strategy.h2}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.accumulation_strategy.body }} />
            <h3 className="font-semibold text-lg mt-6 mb-2">{dictionary.retirement_corpus_calculator.sip_plans.title}</h3>
            <p className="text-muted-foreground">{dictionary.retirement_corpus_calculator.sip_plans.body}</p>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Target Corpus</TableHead>
                  <TableHead className="text-right">SIP from Age 30</TableHead>
                  <TableHead className="text-right">SIP from Age 40</TableHead>
                  <TableHead className="text-right">SIP from Age 50</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sipPlanData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.corpus}</TableCell>
                    <TableCell className="text-right">{row.age30}</TableCell>
                    <TableCell className="text-right">{row.age40}</TableCell>
                    <TableCell className="text-right">{row.age50}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             <p className="text-xs text-muted-foreground mt-2 italic">Assuming 12% annual returns and retirement at 60.</p>
          </CardContent>
        </Card>

        <Card className="mt-8 shadow-lg">
           <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <Wallet className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.deaccumulation_strategy.h2}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.deaccumulation_strategy.body }} />
        </Card>
        
        <Card className="mt-8 shadow-lg">
           <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <Banknote className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.tax_rules.h2}</h2>
             </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.tax_rules.body }} />
        </Card>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <LineChart className="h-7 w-7 text-primary"/>
                <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.faq_title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.retirement_corpus_calculator.faq_content }} />
          </CardContent>
        </Card>
        
        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Download className="h-7 w-7 text-primary"/>
              <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.next_steps.h2}</h2>
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

        <Card className="mt-12 text-sm text-muted-foreground">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5"/>
                    <h2 className="text-2xl font-bold">{dictionary.retirement_corpus_calculator.methodology.h2}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>{dictionary.retirement_corpus_calculator.methodology.body}</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
