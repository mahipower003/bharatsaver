
'use client';

import type { Dictionary } from "@/lib/types";
import type { Locale } from "@/lib/i18n-config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalculatorPageLayout } from "@/components/layout/CalculatorPageLayout";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Download, BarChart, FileText, CheckCircle, SlidersHorizontal, GitCompareArrows, AlertTriangle, Users, BookUser, Star, HelpCircle, UserCheck, Calculator } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { LicChildPlanCalculator } from "@/components/calculators/LicChildPlanCalculator";

function getIcon(iconName: string) {
    const icons: { [key: string]: React.ElementType } = {
        BarChart, FileText, CheckCircle, SlidersHorizontal, GitCompareArrows,
        AlertTriangle, Users, BookUser, Star, HelpCircle, UserCheck, Calculator
    };
    return icons[iconName] || HelpCircle;
}

const ContentRenderer = ({ content, lang }: { content: any[]; lang: Locale }) => {
    if (!content) return null;
    return (
        <div className="space-y-4">
            {content.map((item, idx) => {
                const Icon = item.icon ? getIcon(item.icon) : null;
                switch (item.type) {
                    case 'paragraph':
                        return <div key={idx} className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.text.replace(/{lang}/g, lang) }} />;
                    case 'list':
                        return <ul key={idx} className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {item.items.map((li: string, liIdx: number) => <li key={liIdx} dangerouslySetInnerHTML={{ __html: li.replace(/{lang}/g, lang) }} />)}
                        </ul>;
                    case 'table':
                        return <div key={idx} className="overflow-x-auto"><Table>
                            <TableHeader><TableRow>{item.headers.map((h: string, hIdx: number) => <TableHead key={hIdx}>{h}</TableHead>)}</TableRow></TableHeader>
                            <TableBody>{item.rows.map((row: (string|number)[], rIdx: number) => <TableRow key={rIdx}>{row.map((cell: string|number, cIdx: number) => <TableCell key={cIdx} dangerouslySetInnerHTML={{ __html: String(cell).replace(/{lang}/g, lang) }} />)}</TableRow>)}</TableBody>
                        </Table>{item.footer && <div className="text-xs text-muted-foreground mt-2 italic" dangerouslySetInnerHTML={{ __html: item.footer.replace(/{lang}/g, lang) }}></div>}</div>;
                    case 'faq':
                        return <Accordion key={idx} type="single" collapsible className="w-full">
                            {item.items.map((faq: {q: string; a: string}, qIdx: number) => (
                                <AccordionItem key={qIdx} value={`item-${qIdx}`}>
                                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                                    <AccordionContent><div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: faq.a}} /></AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>;
                    case 'calculator':
                         return <LicChildPlanCalculator key={idx} dictionary={item.dictionary} />;
                    case 'alert':
                         return <Alert key={idx} variant={item.variant || 'default'}><AlertTriangle className="h-4 w-4" /><AlertTitle>{item.title}</AlertTitle><AlertDescription dangerouslySetInnerHTML={{__html: item.text}} /></Alert>
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default function LicChildPlanPageClient({
  params,
  dictionary,
  pageDict,
}: {
  params: { lang: Locale };
  dictionary: Dictionary;
  pageDict: any;
}) {

  const siteUrl = process.env.SITE_URL || 'https://bharatsaver.com';
  const pageUrl = `${siteUrl}/${params.lang}/lic-child-plan`;
  
  const faqSection = pageDict.sections.find((s: any) => s.id === 'faq');
  const faqs = faqSection ? faqSection.content.find((c: any) => c.type === 'faq')?.items.map((f: any) => ({ question: f.q, answer: f.a })) : [];

  return (
    <CalculatorPageLayout
      lang={params.lang}
      dictionary={dictionary}
      pageDict={pageDict}
      h1={pageDict.h1}
      description={pageDict.intro}
      lastUpdated="September 2025"
      calculator={<></>}
      faqs={faqs}
      faqTitle="Frequently Asked Questions (FAQs)"
      pageUrl={pageUrl}
    >
        <div className="space-y-8">
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
                      {section.description && <CardDescription dangerouslySetInnerHTML={{ __html: section.description.replace(/{lang}/g, params.lang) }} />}
                    </CardHeader>
                    <CardContent>
                      <ContentRenderer content={section.content} lang={params.lang}/>
                    </CardContent>
                  </Card>
                )
            })}
        </div>
    </CalculatorPageLayout>
  );
}
