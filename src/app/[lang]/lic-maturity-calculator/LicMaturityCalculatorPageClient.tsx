
'use client';

import { LicMaturityCalculator } from "@/components/calculators/LicMaturityCalculator";
import { AuthorCard } from "@/components/layout/AuthorCard";
import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { FooterCta } from "@/components/layout/FooterCta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

    const faqSchema = {
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity":[
        {"@type":"Question","name":"How do I calculate my LIC policy maturity amount?","acceptedAnswer":{"@type":"Answer","text":"Enter sum assured, policy term, and an illustrative bonus rate per ₹1,000 SA into the calculator. Maturity = Sum Assured + (Vested bonus × policy term) + Final Additional Bonus (if any)."}},
        {"@type":"Question","name":"Does the LIC maturity calculator include bonus?","acceptedAnswer":{"@type":"Answer","text":"Yes. You can input an illustrative bonus rate per ₹1,000 SA or use historical averages. The calculator multiplies the annual bonus by the policy term to estimate total bonus."}},
        {"@type":"Question","name":"How accurate is the maturity estimate?","acceptedAnswer":{"@type":"Answer","text":"Estimates use the inputs and illustrative bonus/FAB rates. Actual maturity depends on LIC's declared bonuses and final underwriting; treat results as indicative, not binding."}},
        {"@type":"Question","name":"What is Final Additional Bonus (FAB)?","acceptedAnswer":{"@type":"Answer","text":"FAB is a loyalty bonus paid by LIC at maturity on long-term participating policies. It is variable and declared by LIC depending on business performance."}},
        {"@type":"Question","name":"How do I calculate surrender value of LIC policy?","acceptedAnswer":{"@type":"Answer","text":"Surrender value can be Guaranteed Surrender Value (a % of premiums paid) or Special Surrender Value (based on vested bonuses). Use the calculator's surrender tab and enter last premium date for a precise estimate."}},
        {"@type":"Question","name":"What is paid-up value?","acceptedAnswer":{"@type":"Answer","text":"Paid-up value applies if you stop paying premiums after two full years; benefits are reduced proportionately based on premiums paid and vested bonuses. The calculator can show paid-up estimates."}},
        {"@type":"Question","name":"How do riders affect maturity?","acceptedAnswer":{"@type":"Answer","text":"Riders increase premium but do not increase maturity sum-assured. Our calculator shows rider premium and the separate rider benefits (if any) but maturity formula remains SA + bonuses + FAB."}},
        {"@type":"Question","name":"Can NRIs use this LIC maturity calculator?","acceptedAnswer":{"@type":"Answer","text":"Yes, NRIs can use the calculator for estimates. Actual purchase may be subject to FEMA and LIC rules for NRIs; check with LIC/agent for eligibility."}},
        {"@type":"Question","name":"Does the calculator include GST?","acceptedAnswer":{"@type":"Answer","text":"By default the calculator excludes GST from maturity calculations (GST is not part of invested amount). You can toggle GST in premium breakdown for clarity on total payable."}},
        {"@type":"Question","name":"How do I find the bonus rate to use?","acceptedAnswer":{"@type":"Answer","text":"Use the bonus rate shown on your policy statement or the published LIC bonus notifications. If unavailable, use a historical average (e.g., 40–48 per ₹1,000 SA for typical endowment plans)." }},
        {"@type":"Question","name":"How to compute IRR of an LIC policy?","acceptedAnswer":{"@type":"Answer","text":"IRR is the discount rate that equates total premiums paid with maturity received. Our calculator provides an approximate IRR after computing maturity and total premiums paid." }},
        {"@type":"Question","name":"What is modal loading?","acceptedAnswer":{"@type":"Answer","text":"Modal loading is the extra cost when paying premium monthly/quarterly/half-yearly versus yearly. The calculator converts yearly premium using modal factors to show accurate mode-wise premiums."}},
        {"@type":"Question","name":"Is maturity tax-free under Section 10(10D)?","acceptedAnswer":{"@type":"Answer","text":"Generally yes, but the exemption depends on rules (notably if annual premium does not exceed 10% of Sum Assured for most policies). Check your policy specifics." }},
        {"@type":"Question","name":"Can I download the calculation as PDF?","acceptedAnswer":{"@type":"Answer","text":"Yes — click 'Download PDF' after calculating to save the maturity and premium breakdown for your records." }},
        {"@type":"Question","name":"How to compare LIC maturity vs mutual funds?","acceptedAnswer":{"@type":"Answer","text":"LIC policies are low-risk, lower-return, and tax-efficient for long-term conservative investors; mutual funds can offer higher returns with market risk. Use our comparison tool to evaluate both."}}
      ]
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
              <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {pageDict.quick_answer.table.headers.map((header: string, hIdx: number) => <TableHead key={hIdx}>{header}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pageDict.quick_answer.table.rows.map((row: string[], rIdx: number) => (
                            <TableRow key={rIdx}>
                            {row.map((cell: string, cIdx: number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{ __html: cell }} />)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

      {Object.values(pageDict)
        .filter((section: any) => section.title && section.body && section.id)
        .map((section: any, index: number) => {
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
        </header>
        
        <div id="calculator-widget">
          <LicMaturityCalculator dictionary={pageDict.tool} />
        </div>

        <ArticleContent />
        
        <div className="mt-12">
            <AuthorCard dictionary={dictionary.author_card} />
        </div>
        <FooterCta dictionary={dictionary.footer_cta} lang={params.lang} />
      </div>
    </div>
  );
}
