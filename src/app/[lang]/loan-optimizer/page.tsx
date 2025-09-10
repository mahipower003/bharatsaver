
import { LoanOptimizer } from "@/components/calculators/LoanOptimizer";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, TrendingUp, Star, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { AuthorCard } from "@/components/layout/AuthorCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export async function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang, ['loan_optimization_calculator', 'author_card']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/loan-optimizer`;
  
  const faqItems = dictionary.loan_optimization_calculator.faq.faqs;
  const faqSchema = {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": faqItems.map((faq: { q: string, a: string }) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a.replace(/<[^>]*>/g, ''), // Strip HTML tags for JSON-LD
      },
    })),
  };

  const softwareSchema = {
    "@context":"https://schema.org",
    "@type":"SoftwareApplication",
    "name":"Loan Optimization Calculator India 2025 — Reduce EMI & Save Interest",
    "url": pageUrl,
    "applicationCategory":"FinanceApplication",
    "operatingSystem":"Web",
    "description": "Free Loan Optimization Calculator (India). Compare prepayment vs invest, optimize EMI, plan balance transfer, download amortization schedule.",
    "offers": {
      "@type":"Offer",
      "url": pageUrl,
      "price":"0",
      "priceCurrency":"INR"
    }
  };
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": dictionary.loan_optimization_calculator.h1,
    "description": "This guide + interactive calculator helps you answer: How can I minimize total interest, reduce my EMI or tenure, and make the best choice between prepaying, refinancing, or investing my surplus?",
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
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Laveena Vijayi",
          "jobTitle": "BharatSaver Editorial Team"
        }
    },
    "datePublished": "2024-08-01",
    "dateModified": "2025-09-01"
  };

  return {
    title: dictionary.loan_optimization_calculator.meta_title,
    description: dictionary.loan_optimization_calculator.meta_description,
    alternates: {
      canonical: pageUrl,
      languages: i18nConfig.locales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}/loan-optimizer`;
        return acc;
      }, {} as Record<string, string>),
    },
    other: {
      'application/ld+json': JSON.stringify([faqSchema, softwareSchema, articleSchema]),
    },
  };
}

export default async function LoanOptimizerPage({ params }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(params.lang, ['loan_optimization_calculator', 'author_card']);
  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'Loan Optimization Calculator', item: `${siteUrl}/${params.lang}/loan-optimizer` },
    ],
  };

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {dictionary.loan_optimization_calculator.h1}
          </h1>
          <div className="bs-byline justify-center text-center">
            <span className="bs-author">By <strong>Mahesh Chaube, CFP</strong></span>
            <span className="bs-sep">|</span>
            <span className="bs-updated">Last updated: <time dateTime="2025-09-01">September 2025</time></span>
            <div className="bs-reviewed">Reviewed by <strong>Laveena Vijayi</strong> — BharatSaver Editorial Team</div>
          </div>
          <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.summary }} />
        </div>
        
        <LoanOptimizer dictionary={dictionary.loan_optimization_calculator} />

        <div className="prose dark:prose-invert max-w-none mt-12 space-y-8">
            <section id="why-a-loan-optimization-calculator">
                <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.why.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.why.body}} />
            </section>
            
            <section id="how-this-loan-optimization-calculator-works">
                <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.how_it_works.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.how_it_works.body}} />
            </section>
            
            <section id="the-amortization-deep-dive">
                <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.amortization_dive.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.amortization_dive.body}} />
            </section>
            
            <section id="the-optimization-masterclass">
                <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.optimization_masterclass.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.optimization_masterclass.body}} />
            </section>
            
            <section id="prepayment-vs-invest">
                <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.prepay_vs_invest.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.prepay_vs_invest.body}} />
            </section>

            <section id="refinance-balance-transfer">
                <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.refinance.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.refinance.body}} />
            </section>
            
            <section id="multiple-loans">
                <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.multiple_loans.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.multiple_loans.body}} />
            </section>
            
            <section id="worked-examples">
                <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.examples.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.examples.body}} />
            </section>
            
            <section id="how-to-use">
                 <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.how_to_use.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.how_to_use.body}} />
            </section>
            
            <section id="downloads-embedding">
                 <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.downloads.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.downloads.body}} />
            </section>

            <section id="tax-penalties">
                <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.tax_notes.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.tax_notes.body}} />
            </section>

            <section id="faq">
                <h2 className="text-2xl font-bold text-center mb-6">{dictionary.loan_optimization_calculator.faq.h2}</h2>
                <Accordion type="single" collapsible className="w-full">
                {dictionary.loan_optimization_calculator.faq.faqs.map((faq: { q: string, a: string }, index: number) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                    <AccordionContent>
                        <p dangerouslySetInnerHTML={{ __html: faq.a }}></p>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </section>
            
            <section id="sources-methodology">
                <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.methodology.h2}</h2>
                <div dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.methodology.body}} />
            </section>
        </div>
        
        <AuthorCard dictionary={dictionary.author_card} />
      </div>
    </div>
  );
}
