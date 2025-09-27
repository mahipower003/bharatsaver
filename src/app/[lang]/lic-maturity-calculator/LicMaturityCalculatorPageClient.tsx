
'use client';

import { LicMaturityCalculator } from "@/components/calculators/LicMaturityCalculator";
import { AuthorCard } from "@/components/layout/AuthorCard";
import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { FooterCta } from "@/components/layout/FooterCta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle, SlidersHorizontal, StepForward, BarChart2, TrendingUp, FileText, GitCompareArrows, BookUser, Star, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function getIcon(iconName: string) {
    switch (iconName) {
        case 'HelpCircle': return HelpCircle;
        case 'SlidersHorizontal': return SlidersHorizontal;
        case 'StepForward': return StepForward;
        case 'BarChart2': return BarChart2;
        case 'TrendingUp': return TrendingUp;
        case 'FileText': return FileText;
        case 'GitCompareArrows': return GitCompareArrows;
        case 'BookUser': return BookUser;
        case 'CheckCircle': return CheckCircle;
        case 'ShieldCheck': return ShieldCheck;
        default: return Star;
    }
}

export default function LicMaturityCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

    const siteUrl = 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-maturity-calculator`;

    const faqItems = pageDict.faq?.questions ?? [];
    const faqSchema = {
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity": faqItems.map((faq: {q: string, a: string}) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a.replace(/<[^>]*>/g, '')
        }
      }))
    };
    
    const howToSchema = {
      "@context":"https://schema.org",
      "@type":"HowTo",
      "name":"How to use the LIC Maturity Calculator",
      "description":"Step-by-step instructions to estimate LIC maturity, surrender and paid-up values using our tool.",
      "step":[
        {"@type":"HowToStep","name":"Select plan preset","text":"Choose the LIC plan (for example Jeevan Labh) to set PPT and typical bonus ranges automatically."},
        {"@type":"HowToStep","name":"Enter policy details","text":"Input Sum Assured, policy term, annual premium (if required), bonus per ₹1000 SA and FAB (optional)."},
        {"@type":"HowToStep","name":"Provide dates","text":"Enter date of birth and last premium paid date for surrender/loan eligibility calculations."},
        {"@type":"HowToStep","name":"Click Calculate","text":"View maturity, total premiums paid, IRR, surrender and loan estimates; download the result as PDF."}
      ]
    };
    
    const financialProductSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "LIC Maturity Calculator",
        "description": "A tool to estimate maturity, surrender, and paid-up values for various LIC endowment and traditional plans.",
        "brand": {
            "@type": "Brand",
            "name": "LIC of India"
        },
        "url": pageUrl,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "INR"
        }
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${params.lang}` },
        { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${siteUrl}/${params.lang}/calculators` },
        { '@type': 'ListItem', position: 3, name: 'LIC Maturity Calculator', item: pageUrl },
      ],
    };

  const ArticleContent = () => (
    <div className="mt-12 space-y-8">
      {pageDict.quick_answer && (
        <Card id="quick-answer" className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">{pageDict.quick_answer.title}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: pageDict.quick_answer.intro }} />
            <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: pageDict.quick_answer.table_html}} />
          </CardContent>
        </Card>
      )}

      {Object.values(pageDict)
        .filter((section: any): section is { title: string; body: string; id: string; icon?: string } =>
          !!section && typeof section === 'object' && 'title' in section && 'body' in section && 'id' in section
        )
        .map((section, index) => {
          if (section.id === 'quick-answer' || section.id === 'conclusion' || section.id === 'plan-specifics' || section.id === 'faq') {
            return null;
          }
          const Icon = section.icon ? getIcon(section.icon) : null;
          return (
            <Card key={index} className="shadow-lg" id={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {Icon && <Icon className="h-8 w-8 text-primary" />}
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: section.body }} />
            </Card>
          );
        })}

      {pageDict.plan_specifics && (
        <Card id="plan-specifics" className="shadow-lg">
           <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">{pageDict.plan_specifics.title}</h2>
              </CardTitle>
               <CardDescription>{pageDict.plan_specifics.intro}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pageDict.plan_specifics.plans.map((plan: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg bg-muted/30">
                        <h4 className="font-bold text-lg mb-1">{plan.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{plan.desc}</p>
                        <Button variant="link" asChild className="p-0 h-auto">
                            <Link href={`/${params.lang}${plan.link}`}>View Calculator &rarr;</Link>
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
      )}

      {pageDict.faq && (
          <Card id="faq" className="shadow-lg">
             <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <HelpCircle className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">{pageDict.faq.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {pageDict.faq.questions.map((faq: {q: string, a: string}, idx: number) => (
                        <div key={idx}>
                            <h4 className="font-semibold">{faq.q}</h4>
                            <p className="text-muted-foreground text-sm" dangerouslySetInnerHTML={{ __html: faq.a }} />
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
      )}
    </div>
  );

  return (
    <div className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, howToSchema, financialProductSchema, breadcrumbSchema]) }} />
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline" dangerouslySetInnerHTML={{__html: pageDict.h1}} />
            {pageDict.top_cta && <p className="mt-4 text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: pageDict.top_cta }}></p>}
        </header>
        
        <div id="calculator-widget">
          <LicMaturityCalculator dictionary={pageDict.tool} />
        </div>

        <ArticleContent />

        {pageDict.conclusion && (
            <Card id="conclusion" className="mt-12 shadow-lg bg-accent/10 border-accent/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Star className="h-8 w-8 text-accent" />
                        <h2 className="text-2xl font-bold">{pageDict.conclusion.title}</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{pageDict.conclusion.body}</p>
                </CardContent>
            </Card>
        )}
        
        <div className="mt-12">
            <AuthorCard dictionary={dictionary.author_card} />
        </div>
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}
