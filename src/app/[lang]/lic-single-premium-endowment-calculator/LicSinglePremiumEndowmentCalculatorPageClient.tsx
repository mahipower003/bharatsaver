
'use client';

import { LicSinglePremiumEndowmentCalculator } from "@/components/calculators/LicSinglePremiumEndowmentCalculator";

import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, HelpCircle, ShieldCheck, TrendingUp, SlidersHorizontal, BarChart2, StepForward, GitCompareArrows, FileText, Users } from "lucide-react";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";

function getIcon(iconName: string) {
    switch (iconName) {
        case 'ShieldCheck': return ShieldCheck;
        case 'CheckCircle': return CheckCircle;
        case 'HelpCircle': return HelpCircle;
        case 'TrendingUp': return TrendingUp;
        case 'SlidersHorizontal': return SlidersHorizontal;
        case 'BarChart2': return BarChart2;
        case 'StepForward': return StepForward;
        case 'GitCompareArrows': return GitCompareArrows;
        case 'FileText': return FileText;
        case 'Users': return Users;
        default: return HelpCircle;
    }
}

export default function LicSinglePremiumEndowmentCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

    const siteUrl = 'https://bharatsaver.com';
    const pageUrl = `${siteUrl}/${params.lang}/lic-single-premium-endowment-calculator`;

    const faqItems = pageDict.article.sections.find((s:any) => s.id === 'faq')?.content[0]?.items ?? [];
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map((faq: {q: string; a: string}) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a.replace(/<[^>]*>/g, '') // Strip HTML for schema
        }
      }))
    };
    
    const howToSteps = pageDict.article.sections.find((s:any) => s.id === 'how-to-use')?.content[0]?.items ?? [];
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use LIC Single Premium Endowment Calculator",
        "step": howToSteps.map((step: {title: string; description: string;}, index: number) => ({
            "@type": "HowToStep",
            "name": `Step ${index + 1}: ${step.title}`,
            "text": step.description
        }))
    };
    
    const financialProductSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "LIC Single Premium Endowment Plan (Plan No. 917/717)",
        "description": "A single premium, non-linked, with-profits endowment plan offering a combination of savings and protection.",
        "brand": {
            "@type": "Brand",
            "name": "LIC of India"
        },
        "identifier": "512N283V03", // UIN of the plan
        "url": pageUrl,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "INR"
        }
    };


  const ArticleContent = () => (
    <div className="mt-12 space-y-8 print-hide">
      {pageDict.article.sections.map((section: any, index: number) => {
        if (section.id === 'faq') return null;
        const Icon = section.icon ? getIcon(section.icon) : null;
        return (
          <Card key={index} className="shadow-lg" id={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {Icon && <Icon className="h-8 w-8 text-primary" />}
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.content.map((item: any, idx: number) => {
                switch (item.type) {
                  case 'paragraph':
                    return <p key={idx} className="text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: item.text }} />;
                  case 'list':
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li }} />)}
                      </ul>
                    );
                  case 'table':
                    return (
                        <div key={idx} className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                {item.headers.map((header: string, hIdx: number) => <TableHead key={hIdx}>{header}</TableHead>)}
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {item.rows.map((row: string[], rIdx: number) => (
                                <TableRow key={rIdx}>
                                {row.map((cell: string, cIdx: number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{ __html: cell.replace(/{lang}/g, params.lang) }} />)}
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        {item.footer && <p className="text-xs text-muted-foreground mt-2 italic" dangerouslySetInnerHTML={{ __html: item.footer }} />}
                        </div>
                    );
                  case 'steps':
                     return (
                        <ol key={idx} className="space-y-4">
                            {item.items.map((step: {title: string, description: string}, sIdx: number) => (
                                <li key={sIdx} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{sIdx + 1}</div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                     );
                  case 'examples':
                    return (
                        <div key={idx} className="space-y-4">
                            {item.items.map((example: {title: string, body: string}, eIdx: number) => (
                                <div key={eIdx} className="bg-muted/50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg">{example.title}</h3>
                                    <div className="mt-2 text-muted-foreground prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: example.body}}></div>
                                </div>
                            ))}
                        </div>
                    );
                  case 'faq':
                    return (
                        <Accordion key={idx} type="single" collapsible className="w-full">
                            {item.items.map((faq: {q: string, a: string}, qIdx: number) => (
                                <AccordionItem key={qIdx} value={`item-${qIdx}`}>
                                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                                    <AccordionContent><p dangerouslySetInnerHTML={{__html: faq.a}} /></AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    );
                  default:
                    return null;
                }
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const faqs = faqItems.map((f: {q: string; a: string}) => ({ question: f.q, answer: f.a }));

  return (
    <CalculatorPageLayout
      lang={params.lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.description}
      lastUpdated="August 2026"
      calculator={
        <div id="calculator-widget">
          <LicSinglePremiumEndowmentCalculator dictionary={pageDict.tool} />
        </div>
      }
      faqs={faqs}
      faqTitle="Frequently Asked Questions"
      pageUrl={pageUrl}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([howToSchema, financialProductSchema]) }} />
      <ArticleContent />
      {pageDict.article?.conclusion && (
        <Card className="shadow-lg mt-8 bg-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{pageDict.article.conclusion?.title || 'Conclusion'}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{__html: (pageDict.article.conclusion?.body || '').replace(/{lang}/g, params.lang)}} />
          </CardContent>
        </Card>
      )}
    </CalculatorPageLayout>
  );
}
