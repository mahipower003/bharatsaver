'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { LicMaturityCalculator } from "@/components/calculators/LicMaturityCalculator";
import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { HelpCircle, SlidersHorizontal, StepForward, BarChart2, TrendingUp, FileText, GitCompareArrows, BookUser, Star, CheckCircle, ShieldCheck, Calculator, Table as TableIcon, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';

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
        case 'Calculator': return Calculator;
        case 'TableIcon': return TableIcon;
        case 'LinkIcon': return LinkIcon;
        default: return Star;
    }
}

const ContentRenderer = ({ content, lang }: { content: any[], lang: Locale }) => {
  return (
    <div className="space-y-4">
      {content.map((item, idx) => {
        switch (item.type) {
          case 'paragraph':
            return <div key={idx} className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, lang) }} />;
          case 'list':
            return (
              <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
                {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.replace(/{lang}/g, lang) }} />)}
              </ul>
            );
          case 'table':
            return (
              <div key={idx} className="overflow-x-auto">
                <Table>
                  {item.headers && <TableHeader><TableRow>{item.headers.map((header: string, hIdx: number) => <TableHead key={hIdx}>{header}</TableHead>)}</TableRow></TableHeader>}
                  <TableBody>
                    {item.rows.map((row: string[], rIdx: number) => (
                      <TableRow key={rIdx}>
                        {row.map((cell: string, cIdx: number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{ __html: cell.replace(/{lang}/g, lang) }} />)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {item.footer && <div className="text-xs text-muted-foreground mt-2 italic" dangerouslySetInnerHTML={{ __html: item.footer.replace(/{lang}/g, lang) }}></div>}
              </div>
            );
          case 'bar_chart':
            return (
              <div key={idx} className="h-64 w-full mt-4">
                  <ResponsiveContainer>
                      <BarChart data={item.data}>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis />
                          <Tooltip contentStyle={{ borderRadius: "var(--radius)", background: "hsl(var(--background))" }} />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
            );
          case 'alert':
            return (
              <Alert key={idx} variant={item.variant || 'default'}>
                {item.title && <AlertTitle>{item.title}</AlertTitle>}
                <AlertDescription dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, lang) }} />
              </Alert>
            );
          case 'formula':
            return <div key={idx} className="font-mono bg-muted p-4 rounded-md my-4 text-center" dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, lang) }}></div>;
           case 'faq':
             if (!item.items || !Array.isArray(item.items)) return null;
            return (
              <Accordion key={idx} type="single" collapsible className="w-full">
                {item.items.map((faq: {q: string, a: string}, qIdx: number) => (
                    <AccordionItem key={qIdx} value={`item-${qIdx}`}>
                        <AccordionTrigger>{faq.q}</AccordionTrigger>
                        <AccordionContent><div dangerouslySetInnerHTML={{__html: faq.a.replace(/{lang}/g, lang)}} /></AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            );
            case 'card_link':
              const CardIcon = getIcon(item.icon);
              return (
                  <Link key={idx} href={`/${lang}${item.href}`} className="group block">
                      <Card className="hover:shadow-md hover:border-primary/30 transition-all">
                          <CardHeader className="flex flex-row items-center gap-4">
                              <CardIcon className="h-8 w-8 text-primary" />
                              <div>
                                  <CardTitle className="text-lg">{item.title}</CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              </div>
                          </CardHeader>
                      </Card>
                  </Link>
              );
          default:
            return null;
        }
      })}
    </div>
  );
};


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
  
  const faqSection = pageDict.sections.find((s: any) => s.id === 'faq');
  const faqs = faqSection ? faqSection.content.find((c: any) => c.type === 'faq')?.items.map((f: any) => ({ question: f.q, answer: f.a })) : [];

  const ArticleContent = () => (
    <div className="mt-12 space-y-8">
      {pageDict.sections.map((section: any, index: number) => {
        const Icon = getIcon(section.icon);
        return (
          <Card key={index} id={section.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </CardTitle>
              {section.description && <CardDescription dangerouslySetInnerHTML={{ __html: section.description }} />}
            </CardHeader>
            <CardContent>
              <ContentRenderer content={section.content} lang={params.lang} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
  
  return (
    <CalculatorPageLayout
      lang={params.lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.top_cta}
      lastUpdated="May 2026"
      calculator={
        <div id="calculator-widget">
          <LicMaturityCalculator dictionary={pageDict.tool} />
        </div>
      }
      faqs={faqs}
      faqTitle="Frequently Asked Questions (FAQs)"
      pageUrl={pageUrl}
    >
      <div className="mt-12 space-y-8">
        {pageDict.sections.map((section: any, index: number) => {
          if (section.id === 'faq') return null; // FAQ is handled by CalculatorPageLayout
          const Icon = getIcon(section.icon);
          return (
            <Card key={index} id={section.id} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Icon className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </CardTitle>
                {section.description && <CardDescription dangerouslySetInnerHTML={{ __html: section.description.replace(/{lang}/g, params.lang) }} />}
              </CardHeader>
              <CardContent>
                <ContentRenderer content={section.content} lang={params.lang} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </CalculatorPageLayout>
  );
}
