
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, FileText, TrendingUp, AlertTriangle, BadgeCheck, HelpCircle, Download } from "lucide-react";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['mutual_fund_overlap_calculator', 'author_card']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/mutual-fund-overlap-calculator`;
  const ogImageUrl = `${siteUrl}/images/mutual-fund-overlap-og.png`;
  
  if (params.lang !== 'en') {
    return {
      title: dictionary.mutual_fund_overlap_calculator.meta_title,
      description: dictionary.mutual_fund_overlap_calculator.meta_description,
       alternates: {
        canonical: pageUrl,
        languages: i18nConfig.locales.reduce((acc, locale) => {
            acc[locale] = `${siteUrl}/${locale}/mutual-fund-overlap-calculator`;
            return acc;
        }, {} as Record<string, string>),
       },
    };
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Mutual Fund Overlap Calculator India (2025)",
    "url": pageUrl,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "description": "Free tool to check for portfolio overlap between two or more Indian mutual funds. See common stocks, sector concentration, and get actionable insights to improve diversification.",
     "author": {
      "@type": "Person",
      "name": "Mahesh Chaube",
      "jobTitle": "CFP",
      "sameAs": "https://www.linkedin.com/in/mahi003/"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
    "headline": dictionary.mutual_fund_overlap_calculator.h1,
    "description": dictionary.mutual_fund_overlap_calculator.meta_description,
    "image": [ogImageUrl],
    "author": {
        "@type": "Person",
        "name": "Mahesh Chaube",
        "jobTitle": "CFP",
        "url": `${siteUrl}/${params.lang}/author/mahesh-chaube`
    },
    "editor": {
        "@type": "Person",
        "name": "Laveena Vijayi",
        "jobTitle": "Senior Financial Research Analyst"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BharatSaver",
      "logo": { "@type": "ImageObject", "url": `${siteUrl}/icon.svg` }
    },
    "datePublished": "2024-07-20",
    "dateModified": "2025-09-01"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": dictionary.mutual_fund_overlap_calculator.faq.faqs.map((faq: { q: string, a: string }) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };

  return {
    title: dictionary.mutual_fund_overlap_calculator.meta_title,
    description: dictionary.mutual_fund_overlap_calculator.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/mutual-fund-overlap-calculator`;
        return acc;
      }, {} as Record<string, string>),
    },
    openGraph: {
      title: dictionary.mutual_fund_overlap_calculator.meta_title,
      description: dictionary.mutual_fund_overlap_calculator.meta_description,
      url: pageUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Mutual Fund Overlap Calculator Report' }],
      locale: 'en_IN',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.mutual_fund_overlap_calculator.meta_title,
      description: dictionary.mutual_fund_overlap_calculator.meta_description,
      images: [ogImageUrl]
    },
    other: {
      'application/ld+json': JSON.stringify([softwareSchema, articleSchema, faqSchema]),
    },
  };
}

export default async function MutualFundOverlapCalculatorPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['mutual_fund_overlap_calculator', 'author_card']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/mutual-fund-overlap-calculator`;

  if (params.lang !== 'en') {
    return (
        <div className="py-12">
        <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.mutual_fund_overlap_calculator.h1}
            </h1>
            <p className="mt-8 text-2xl text-muted-foreground">Coming Soon</p>
        </div>
        </div>
    );
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'Mutual Fund Overlap Calculator', item: pageUrl },
    ],
  };

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.mutual_fund_overlap_calculator.h1}
          </h1>
           <div className="bs-byline justify-center text-center mt-4">
            <span className="bs-author">By <strong>Mahesh Chaube, CFP</strong></span>
            <span className="bs-sep">|</span>
            <span className="bs-updated">Last updated: <time dateTime="2025-09-01">September 2025</time></span>
            <div className="bs-reviewed" dangerouslySetInnerHTML={{ __html: dictionary.author_card.review_text }} />
          </div>
          <p className="mt-4 text-lg text-muted-foreground">{dictionary.mutual_fund_overlap_calculator.hero.subtitle}</p>
        </div>

        {/* Tool Section - Placeholder */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><Layers className="h-6 w-6 text-primary"/>{dictionary.mutual_fund_overlap_calculator.tool_section.h2}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-12">{dictionary.mutual_fund_overlap_calculator.tool_section.placeholder}</p>
          </CardContent>
        </Card>

        <div className="space-y-12">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-primary"/>{dictionary.mutual_fund_overlap_calculator.what_is_overlap.h2}</CardTitle></CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.what_is_overlap.body }}/>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><FileText className="h-6 w-6 text-primary"/>{dictionary.mutual_fund_overlap_calculator.how_it_works.h2}</CardTitle></CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.how_it_works.body }}/>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-primary"/>{dictionary.mutual_fund_overlap_calculator.live_example.h2}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{dictionary.mutual_fund_overlap_calculator.live_example.intro}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock</TableHead>
                    <TableHead>Weight in Fund A (%)</TableHead>
                    <TableHead>Weight in Fund B (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dictionary.mutual_fund_overlap_calculator.live_example.table.map((row:any, index:number) => (
                    <TableRow key={index}>
                      <TableCell>{row.stock}</TableCell>
                      <TableCell>{row.weightA}</TableCell>
                      <TableCell>{row.weightB}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Alert>
                <AlertTriangle className="h-4 w-4"/>
                <AlertTitle>Result</AlertTitle>
                <AlertDescription dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.live_example.result }}/>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><BadgeCheck className="h-6 w-6 text-primary"/>{dictionary.mutual_fund_overlap_calculator.interpreting_results.h2}</CardTitle></CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.interpreting_results.body }}/>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-primary"/>{dictionary.mutual_fund_overlap_calculator.what_to_do.h2}</CardTitle></CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.what_to_do.body }}/>
          </Card>
          
           <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><Download className="h-6 w-6 text-primary"/>{dictionary.mutual_fund_overlap_calculator.faq.h2}</CardTitle></CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Layers className="h-6 w-6 text-primary"/>{dictionary.mutual_fund_overlap_calculator.methodology.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.mutual_fund_overlap_calculator.methodology.body }} />
            </Card>
        </div>

        <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Layers className="h-7 w-7 text-accent" />
              <h2 className="text-2xl font-bold">{dictionary.mutual_fund_overlap_calculator.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{dictionary.mutual_fund_overlap_calculator.conclusion.body}</p>
          </CardContent>
        </Card>

        <AuthorCard dictionary={dictionary.author_card} />
      </div>
    </div>
  );
}

