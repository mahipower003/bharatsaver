
'use client';

import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";

import { LicJeevanLabhCalculator } from "@/components/calculators/LicJeevanLabhCalculator";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, HelpCircle, ShieldCheck, TrendingUp, SlidersHorizontal, BarChart2, StepForward, GitCompareArrows, FileText } from "lucide-react";

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
        default: return HelpCircle;
    }
}

export default function LicJeevanLabhCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

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
                    return <div key={idx} className="text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, params.lang) }}></div>;
                  case 'list':
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.replace(/{lang}/g, params.lang) }} />)}
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
                        {item.footer && <div className="text-xs text-muted-foreground mt-2 italic" dangerouslySetInnerHTML={{ __html: item.footer.replace(/{lang}/g, params.lang) }}></div>}
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
                                        <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: step.description.replace(/{lang}/g, params.lang) }}></div>
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
                                    <div className="mt-2 text-muted-foreground prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: example.body.replace(/{lang}/g, params.lang)}}></div>
                                </div>
                            ))}
                        </div>
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

  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-jeevan-labh-calculator`;
  
  const faqSection = pageDict.article.sections.find((s: any) => s.id === 'faq');
  const faqs = faqSection ? faqSection.content.find((c: any) => c.type === 'faq')?.items.map((f: any) => ({ question: f.q, answer: f.a })) : [];

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
          <LicJeevanLabhCalculator dictionary={pageDict.tool} />
        </div>
      }
      faqs={faqs}
      faqTitle="Frequently Asked Questions (FAQs)"
      pageUrl={pageUrl}
    >
        <ArticleContent />
        
    </CalculatorPageLayout>
  );
}
