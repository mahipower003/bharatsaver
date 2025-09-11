
import { LoanOptimizer } from "@/components/calculators/LoanOptimizer";
import { getDictionary } from "@/lib/dictionaries";
import { i18nConfig, type Locale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, TrendingUp, Star, AlertTriangle, CheckCircle, HelpCircle, GitCompareArrows, LineChart, Banknote } from "lucide-react";
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
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a Loan Optimization Calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A tool that models EMI, prepayment, refinancing and invest-vs-prepay scenarios to show interest saved, tenure changes and optimal actions."
        }
      },
      {
        "@type": "Question",
        "name": "How does a Loan Optimization Calculator work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It uses amortization formulas to compute EMI and outstanding balance, then simulates prepayment, tenure and refinance scenarios to show net savings."
        }
      },
      {
        "@type": "Question",
        "name": "How much interest can I save by prepaying my home loan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Savings depend on timing and amount; early large prepayments save the most. For example, a ₹5L prepayment on a ₹50L loan at 8.5% can save lakhs over the loan term."
        }
      },
      {
        "@type": "Question",
        "name": "Should I prepay my loan or invest my surplus?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If your expected after-tax investment return exceeds the loan rate, investing may be better; otherwise prepaying reduces guaranteed interest outgo and risk."
        }
      },
      {
        "@type": "Question",
        "name": "Does prepayment reduce EMI or tenure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lenders typically let you choose: prepayment can reduce tenure (default) or reduce EMI. Reducing tenure saves more total interest; reducing EMI eases cashflow."
        }
      },
      {
        "@type": "Question",
        "name": "What is an EMI and how is it calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EMI is the fixed monthly loan payment. Formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P = principal, r = monthly rate, n = months."
        }
      },
      {
        "@type": "Question",
        "name": "How can I reduce my EMI without prepayment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can refinance to a lower rate, extend the tenure, or request loan restructuring with your bank — but longer tenure raises total interest paid."
        }
      },
      {
        "@type": "Question",
        "name": "What is a home loan prepayment calculator in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is a tool showing how lump-sum or recurring prepayments change your outstanding balance, tenure, and total interest for Indian home loans."
        }
      },
      {
        "@type": "Question",
        "name": "What is a loan refinancing calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A calculator that compares your current loan with a new loan rate, accounting for processing fees and penalties to show net savings from refinancing."
        }
      },
      {
        "@type": "Question",
        "name": "How does refinancing (balance transfer) work in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You move your loan to another lender offering a lower effective rate; refinancing pays off the old loan and starts a new loan with new terms."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this calculator for multiple loans?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes — the tool supports optimizing multiple loans (home, car, personal, education, credit card) and helps prioritize high-interest debt first."
        }
      },
      {
        "@type": "Question",
        "name": "How do I decide between prepaying vs refinancing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Compare net savings: prepay if you have surplus cash and want guaranteed reduction in interest; refinance if new rate minus fees yields long-term savings."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is this Loan Optimization Calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It uses standard amortization math and current tax rules; accuracy depends on lender terms, fees and your inputs. Confirm results with your bank before acting."
        }
      },
      {
        "@type": "Question",
        "name": "Are there prepayment penalties in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RBI disallows prepayment penalty on floating-rate home loans; fixed-rate loans and some personal loans may still charge a fee, typically 1–3%."
        }
      },
      {
        "@type": "Question",
        "name": "Are home loan prepayments tax deductible?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Prepayment itself is not deductible. Only interest (u/s 24) and principal repaid under 80C (for certain loans) qualify for deductions."
        }
      },
      {
        "@type": "Question",
        "name": "Can this calculator generate an amortization schedule?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The tool produces a month-by-month amortization table showing principal, interest, outstanding balance and the impact of prepayments; you can download it."
        }
      },
      {
        "@type": "Question",
        "name": "Is refinancing always a good idea?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not always. Refinancing is beneficial if the rate difference and tenure justify processing fees and you plan to stay in the loan long enough to recoup costs."
        }
      },
      {
        "@type": "Question",
        "name": "How to prioritize paying off multiple loans?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use the debt avalanche: pay highest-rate debt first (credit card, personal loan), then move to lower-rate loans like car or home loan for maximum interest savings."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use the calculator for education or personal loans?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The calculator works for all amortized loans including education, personal, car, home and gold loans in India."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best way to optimize a home loan in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Combine early prepayments, consider refinance when rates drop materially, and align EMIs with salary growth using step-up payments to reduce interest and tenure."
        }
      }
    ]
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
    "reviewedBy": {
        "@type": "Person",
        "name": "Laveena Vijayi",
        "jobTitle": "BharatSaver Editorial Team"
    },
    "datePublished": "2024-08-01",
    "dateModified": "2025-09-01"
  };

  return {
    title: "Loan Optimization Calculator India 2025 — Reduce EMI & Save Interest",
    description: "Free Loan Optimization Calculator (India). Compare prepayment vs invest, optimize EMI, plan balance transfer, download amortization schedule.",
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
          <div className="bs-byline justify-center text-center mt-4">
            <span className="bs-author">By <strong>Mahesh Chaube, CFP</strong></span>
            <span className="bs-sep">|</span>
            <span className="bs-updated">Last updated: <time dateTime="2025-09-01">September 2025</time></span>
            <div className="bs-reviewed">Reviewed by <strong>Laveena Vijayi</strong> — BharatSaver Editorial Team</div>
          </div>
          <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.summary }} />
        </div>
        
        <LoanOptimizer dictionary={dictionary.loan_optimization_calculator} />

        <div className="space-y-8 mt-12">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><HelpCircle className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.why.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.why.body }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><FileText className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.how_it_works.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.how_it_works.body }} />
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><LineChart className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.amortization_dive.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.amortization_dive.body }} />
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.optimization_masterclass.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.optimization_masterclass.body }} />
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><GitCompareArrows className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.prepay_vs_invest.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.prepay_vs_invest.body }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Banknote className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.refinance.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.refinance.body }} />
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.tax_notes.h2}</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: dictionary.loan_optimization_calculator.tax_notes.body }} />
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-primary" />{dictionary.loan_optimization_calculator.faq.h2}</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
        
        <Card className="mt-12 shadow-lg bg-accent/10 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-7 w-7 text-accent" />
              <h2 className="text-2xl font-bold">{dictionary.loan_optimization_calculator.conclusion.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{dictionary.loan_optimization_calculator.conclusion.body}</p>
          </CardContent>
        </Card>

        <AuthorCard dictionary={dictionary.author_card} />
      </div>
    </div>
  );
}

    