'use client';

import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, BarChart2, BookOpen, CheckCircle, FileText, GitCompareArrows, HelpCircle, TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LicLoanCalculator } from "@/components/calculators/LicLoanCalculator";

function getIcon(iconName: string) {
    switch (iconName) {
        case 'FileText': return FileText;
        case 'HelpCircle': return HelpCircle;
        case 'TrendingUp': return TrendingUp;
        case 'BarChart2': return BarChart2;
        case 'CheckCircle': return CheckCircle;
        case 'GitCompareArrows': return GitCompareArrows;
        case 'BookOpen': return BookOpen;
        default: return AlertTriangle;
    }
}

export default function LicLoanCalculatorPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-loan-calculator`;
  
  const faqSection = pageDict.sections.find((s:any) => s.id === 'faq');
  const faqs = faqSection ? (faqSection.content.find((c: any) => c.type === 'faq') as any)?.items.map((f: any) => ({ question: f.q, answer: f.a })) || [] : [];

  return (
    <CalculatorPageLayout
      lang={params.lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.description || ""}
      lastUpdated="August 2026"
      calculator={
        <div id="calculator-widget">
            <LicLoanCalculator dictionary={pageDict} />
        </div>
      }
      faqs={faqs}
      faqTitle="Frequently Asked Questions (FAQs)"
      pageUrl={pageUrl}
    >
        <div className="space-y-8 print-hide">
          {pageDict.sections.map((section: any, index: number) => {
            if (section.id === 'faq') return null;
            const Icon = getIcon(section.icon);
            return (
              <Card key={index} id={section.id} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-primary" />
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {section.content.map((item: any, idx: number) => {
                      switch(item.type) {
                        case 'paragraph':
                           return <div key={idx} className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, params.lang) }} />;
                        case 'list':
                           return <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.replace(/{lang}/g, params.lang) }} />)}
                              </ul>;
                        case 'table':
                            return <div key={idx} className="overflow-x-auto">
                                <Table><TableHeader><TableRow>{item.headers.map((h: string) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
                                <TableBody>{item.rows.map((row: string[], rIdx: number) => <TableRow key={rIdx}>{row.map((cell:string, cIdx:number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{__html: cell.replace(/{lang}/g, params.lang)}} />)}</TableRow>)}</TableBody>
                                </Table></div>;
                        case 'alert':
                            return <Alert key={idx} variant={item.variant || 'default'}><AlertTriangle className="h-4 w-4" /><AlertTitle>{item.title}</AlertTitle><AlertDescription dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, params.lang) }} /></Alert>;
                        default:
                          return null;
                      }
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
    </CalculatorPageLayout>
  );
}
